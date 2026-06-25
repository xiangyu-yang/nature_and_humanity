import { Router } from 'express';
import { z } from 'zod';
import { LLMConfigDAO, UserDAO, BaziRecordDAO, ConstitutionResultDAO } from '../db/dao';
import { getDailyInfo, getWeather } from '../utils/dailyAnalysis';

export const llmRouter = Router();

const chatSchema = z.object({
  userId: z.string().optional(),
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  apiUrl: z.string().optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  enableDeepThinking: z.boolean().optional(),
});

llmRouter.post('/chat', async (req, res) => {
  const parse = chatSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }

  try {
    const { userId, message, history = [], apiUrl, apiKey, model, enableDeepThinking } = parse.data;
    
    let configApiUrl = apiUrl;
    let configApiKey = apiKey;
    let configModel = model;
    
    let userInfo = '';
      let userCity = '';
      if (userId) {
        const savedConfig = await LLMConfigDAO.findByUserId(userId);
        if (savedConfig) {
          configApiUrl = savedConfig.apiUrl || configApiUrl;
          configApiKey = savedConfig.apiKey || configApiKey;
          configModel = savedConfig.model || configModel;
        }
        
        const profile = await loadUserProfile(userId);
        userInfo = profile.userInfo;
        userCity = profile.city;
      }
      
      const dailyInfo = getDailyInfo();
      const weatherInfo = await getWeather(userCity || '北京');
      
      const systemPrompt = buildSystemPrompt(userInfo, dailyInfo, weatherInfo);
    
    if (configApiUrl && configModel) {
      try {
        const isOllama = configApiUrl.includes('localhost:11434') || configApiKey === 'ollama';
        const reasoningEnabled = enableDeepThinking !== undefined ? enableDeepThinking : true;
        
        let fullUrl = configApiUrl;
        let requestBody: Record<string, any>;
        let responseParser: 'openai' | 'ollama' = 'openai';
        
        if (isOllama) {
          responseParser = 'ollama';
          if (!fullUrl.endsWith('/api/chat')) {
            if (fullUrl.endsWith('/v1')) {
              fullUrl = fullUrl.replace(/\/v1$/, '/api/chat');
            } else if (fullUrl.endsWith('/')) {
              fullUrl += 'api/chat';
            } else {
              fullUrl += '/api/chat';
            }
          }
          
          requestBody = {
            model: configModel,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: message },
            ],
            stream: true,
            think: reasoningEnabled,
            options: {
              num_ctx: 8192,
              num_predict: 8192,
            },
          };
        } else {
          responseParser = 'openai';
          if (!fullUrl.endsWith('/chat/completions')) {
            if (fullUrl.endsWith('/v1')) {
              fullUrl += '/chat/completions';
            } else if (fullUrl.endsWith('/')) {
              fullUrl += 'v1/chat/completions';
            } else {
              fullUrl += '/v1/chat/completions';
            }
          }
          
          requestBody = {
            model: configModel,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history,
              { role: 'user', content: message },
            ],
            max_tokens: 8192,
            temperature: 0.7,
            stream: true,
          };
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (configApiKey && configApiKey.trim() && configApiKey !== 'ollama') {
          headers['Authorization'] = `Bearer ${configApiKey}`;
        }
        
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });
        
        if (response.ok) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });
          
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('无法获取响应流');
          }
          
          const decoder = new TextDecoder();
          let buffer = '';
          
          if (responseParser === 'ollama') {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (!line.trim()) continue;
                try {
                  const data = JSON.parse(line);
                  const content = data.message?.content || '';
                  const thinking = data.message?.thinking || '';
                  
                  if (thinking) {
                    res.write(`data: ${JSON.stringify({ reasoning: thinking })}\n\n`);
                  }
                  if (content) {
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                  }
                  if (data.done) {
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return;
                  }
                } catch {
                  continue;
                }
              }
            }
          } else {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6);
                  if (dataStr === '[DONE]') {
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return;
                  }
                  try {
                    const data = JSON.parse(dataStr);
                    const content = data.choices?.[0]?.delta?.content || data.message?.content || '';
                    const reasoning = data.choices?.[0]?.delta?.reasoning || data.message?.reasoning || '';
                    if (content) {
                      res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    } else if (reasoning) {
                      res.write(`data: ${JSON.stringify({ reasoning })}\n\n`);
                    }
                  } catch {
                    continue;
                  }
                }
              }
            }
          }
          
          res.write('data: [DONE]\n\n');
          res.end();
        } else {
          const errorText = await response.text().catch(() => '');
          throw new Error(`API错误: ${errorText || `HTTP ${response.status}`}`);
        }
      } catch (e: any) {
        console.error('LLM调用失败:', e);
        const mockResponse = generateMockResponse(message);
        
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        
        for (let i = 0; i < mockResponse.length; i += 2) {
          res.write(`data: ${JSON.stringify({ content: mockResponse.slice(i, i + 2) })}\n\n`);
          await new Promise(r => setTimeout(r, 50));
        }
        
        res.write('data: [DONE]\n\n');
        res.end();
      }
    } else {
      const mockResponse = generateMockResponse(message);
      
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      
      for (let i = 0; i < mockResponse.length; i += 2) {
        res.write(`data: ${JSON.stringify({ content: mockResponse.slice(i, i + 2) })}\n\n`);
        await new Promise(r => setTimeout(r, 50));
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '对话失败' });
  }
});

const configSchema = z.object({
  apiUrl: z.string().url().optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  enableSearch: z.boolean().optional(),
});

llmRouter.post('/test', async (req, res) => {
  const parse = configSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }

  try {
    const { apiUrl, apiKey, model } = parse.data;
    
    if (apiUrl) {
      try {
        const isOllama = apiUrl.includes('localhost:11434') || apiKey === 'ollama';
        let fullUrl = apiUrl;
        let requestBody: Record<string, any>;
        
        if (isOllama) {
          if (!fullUrl.endsWith('/api/chat')) {
            if (fullUrl.endsWith('/v1')) {
              fullUrl = fullUrl.replace(/\/v1$/, '/api/chat');
            } else if (fullUrl.endsWith('/')) {
              fullUrl += 'api/chat';
            } else {
              fullUrl += '/api/chat';
            }
          }
          requestBody = {
            model: model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'hello' }],
            stream: false,
            think: false,
          };
        } else {
          if (!fullUrl.endsWith('/chat/completions')) {
            if (fullUrl.endsWith('/v1')) {
              fullUrl += '/chat/completions';
            } else if (fullUrl.endsWith('/')) {
              fullUrl += 'v1/chat/completions';
            } else {
              fullUrl += '/v1/chat/completions';
            }
          }
          requestBody = {
            model: model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'hello' }],
            max_tokens: 10,
          };
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (apiKey && apiKey.trim() && apiKey !== 'ollama') {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
        
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });
        
        if (response.ok) {
          res.json({ code: 0, data: { success: true, message: '连接成功' } });
        } else {
          const errorText = await response.text().catch(() => '');
          const errorMsg = errorText || `HTTP ${response.status}`;
          res.json({ code: 0, data: { success: false, message: `连接失败: ${errorMsg}` } });
        }
      } catch (e: any) {
        res.json({ code: 0, data: { success: false, message: `连接失败，无法访问API: ${e.message || '网络错误'}` } });
      }
    } else {
      res.json({ code: 0, data: { success: true, message: '使用内置模型，无需配置' } });
    }
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '测试失败' });
  }
});

llmRouter.post('/config', async (req, res) => {
  const schema = z.object({
    userId: z.string(),
    apiUrl: z.string().optional(),
    apiKey: z.string().optional(),
    model: z.string().optional(),
    enableSearch: z.boolean().optional(),
  });
  
  const parse = schema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }

  try {
    const { userId, ...config } = parse.data;
    
    await LLMConfigDAO.upsert(userId, {
      apiUrl: config.apiUrl || '',
      apiKey: config.apiKey || '',
      model: config.model || 'gpt-3.5-turbo',
      enableSearch: config.enableSearch ? 1 : 0,
    });
    
    res.json({
      code: 0,
      data: {
        apiUrl: config.apiUrl || '',
        apiKey: config.apiKey ? '***' : '',
        model: config.model || 'gpt-3.5-turbo',
        enableSearch: config.enableSearch || false,
      },
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '保存失败' });
  }
});

llmRouter.get('/config/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const config = await LLMConfigDAO.findByUserId(userId);
    
    if (config) {
      res.json({
        code: 0,
        data: {
          apiUrl: config.apiUrl,
          apiKey: config.apiKey ? '***' : '',
          model: config.model,
          enableSearch: config.enableSearch === 1,
        },
      });
    } else {
      res.json({
        code: 0,
        data: {
          apiUrl: '',
          apiKey: '',
          model: 'gpt-3.5-turbo',
          enableSearch: true,
        },
      });
    }
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '获取配置失败' });
  }
});

function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('八字') || lowerMessage.includes('排盘') || lowerMessage.includes('命理')) {
    return '您的八字命理分析需要结合具体的出生年月日时。根据您提供的信息，日主为己土，生于申月，五行中土旺金强。建议您登录后完善生辰信息，我可以为您提供详细的八字分析报告，包括五行平衡、十神分析、大运走势等内容。';
  }
  
  if (lowerMessage.includes('体质') || lowerMessage.includes('养生') || lowerMessage.includes('健康')) {
    return '中医体质养生讲究"辨证施治"。平和体质者应保持规律作息；气虚体质者宜多食山药、黄芪；阳虚体质者需注意保暖，可适当食用羊肉、桂圆；阴虚体质者应滋阴润燥，多食银耳、百合。建议您完成体质测评，我将为您提供个性化养生方案。';
  }
  
  if (lowerMessage.includes('运势') || lowerMessage.includes('运气') || lowerMessage.includes('今日')) {
    return '今日运势整体平稳。宜静不宜动，适合思考规划，不宜做出重大决策。幸运颜色为绿色，幸运数字为3和8。注意保持心态平和，顺其自然。详细运势分析请登录后查看今日运势模块。';
  }
  
  if (lowerMessage.includes('食疗') || lowerMessage.includes('饮食') || lowerMessage.includes('吃')) {
    return '中医食疗讲究"药食同源"。春季宜多食辛温发散之品如生姜、葱白；夏季宜清热解暑如绿豆、荷叶；秋季宜滋阴润燥如梨、蜂蜜；冬季宜温补如羊肉、红枣。具体食疗方案需结合您的体质类型。';
  }
  
  if (lowerMessage.includes('穴位') || lowerMessage.includes('按摩') || lowerMessage.includes('保健')) {
    return '中医穴位保健是传统养生方法。常用保健穴位有足三里（健脾养胃）、涌泉（益肾安神）、合谷（疏风解表）、内关（宁心安神）等。建议您查看穴位保健模块，了解各穴位的位置和功效。';
  }
  
  return `您好！我是中医命理大师。您问的问题是："${message}"

中医讲究"天人合一"，命理与养生相辅相成。以下是我的分析：

1. **问题解读**：您的问题涉及到${getQuestionCategory(message)}方面。

2. **中医视角**：从中医理论来看，${getChineseMedicinePerspective(message)}

3. **建议方案**：
   - 建议一：${getSuggestion1(message)}
   - 建议二：${getSuggestion2(message)}

如果您有更具体的问题，或者想了解更多细节，请随时告诉我！`;
}

function getQuestionCategory(message: string): string {
  const categories: Record<string, string> = {
    '健康': '健康养生',
    '疾病': '疾病调理',
    '养生': '养生保健',
    '饮食': '食疗养生',
    '运动': '运动养生',
    '睡眠': '睡眠调理',
    '情绪': '情志调节',
    '八字': '八字命理',
    '五行': '五行平衡',
    '运势': '运势分析',
    '体质': '体质辨识',
  };
  
  for (const [keyword, category] of Object.entries(categories)) {
    if (message.includes(keyword)) return category;
  }
  return '综合咨询';
}

function getChineseMedicinePerspective(message: string): string {
  if (message.includes('健康') || message.includes('养生')) {
    return '健康的根本在于阴阳平衡、气血调和。《黄帝内经》云："正气存内，邪不可干"，说明增强体质是预防疾病的关键。';
  }
  if (message.includes('八字') || message.includes('五行')) {
    return '八字命理与中医五行学说同源，均以金木水火土五行为基础。通过分析八字五行的强弱，可以了解个人的先天体质特点。';
  }
  if (message.includes('饮食') || message.includes('食疗')) {
    return '食物有寒热温凉四性，酸甘苦辛咸五味，不同性味对应不同脏腑。合理饮食能调节脏腑功能，达到养生目的。';
  }
  return '中医认为人体是一个有机整体，与自然界密切相关。无论是命理还是养生，都遵循"天人合一"的原则。';
}

function getSuggestion1(message: string): string {
  if (message.includes('健康') || message.includes('养生')) {
    return '保持规律作息，顺应自然界的昼夜节律，日出而作，日落而息。';
  }
  if (message.includes('八字') || message.includes('五行')) {
    return '完善您的生辰信息，我可以为您进行详细的八字排盘分析。';
  }
  if (message.includes('饮食')) {
    return '根据体质选择食物，平和体质可多样化饮食，偏颇体质需针对性调理。';
  }
  return '建议您登录后完善个人信息，以便获得更精准的分析。';
}

function getSuggestion2(message: string): string {
  if (message.includes('健康') || message.includes('养生')) {
    return '适当进行八段锦、太极拳等温和运动，促进气血运行。';
  }
  if (message.includes('八字') || message.includes('五行')) {
    return '结合中医体质测评，了解自身先天禀赋，制定个性化养生方案。';
  }
  if (message.includes('饮食')) {
    return '注意饮食五味调和，避免过食某一味，保持营养均衡。';
  }
  return '关注今日运势，了解每日宜忌，趋吉避凶。';
}

async function loadUserProfile(userId: string): Promise<{ userInfo: string; city: string }> {
  const parts: string[] = [];
  let city = '';
  
  try {
    const user = await UserDAO.findById(userId);
    if (user && user.birthYear) {
      const genderText = user.gender === 'male' ? '男' : '女';
      const calendarText = user.isLunar ? '农历' : '公历';
      if (user.birthPlace) {
        city = user.birthPlace;
      }
      parts.push(`【基本信息】
姓名：${user.name || '用户'}
性别：${genderText}
出生：${calendarText} ${user.birthYear}年${user.birthMonth}月${user.birthDay}日 ${user.birthHour}时
${user.birthPlace ? `出生地：${user.birthPlace}` : ''}`);
    }
    
    const bazi = await BaziRecordDAO.findByUserId(userId);
    if (bazi) {
      try {
        const wuxing = JSON.parse(bazi.wuxing || '{}');
        const shishen = JSON.parse(bazi.shishen || '{}');
        parts.push(`【八字命理】
四柱：${bazi.yearGan}${bazi.yearZhi}　${bazi.monthGan}${bazi.monthZhi}　${bazi.dayGan}${bazi.dayZhi}　${bazi.hourGan}${bazi.hourZhi}
日主：${bazi.dayMaster}（${bazi.dayMasterWuxing}）
五行：${Object.entries(wuxing).map(([k, v]) => `${k}:${v}`).join(' ')}
十神：${shishen.positive || ''}`);
      } catch {
        parts.push(`【八字命理】
四柱：${bazi.yearGan}${bazi.yearZhi}　${bazi.monthGan}${bazi.monthZhi}　${bazi.dayGan}${bazi.dayZhi}　${bazi.hourGan}${bazi.hourZhi}
日主：${bazi.dayMaster}（${bazi.dayMasterWuxing}）`);
      }
    }
    
    const constitution = await ConstitutionResultDAO.findByUserId(userId);
    if (constitution) {
      try {
        const scores = JSON.parse(constitution.scores || '{}');
        parts.push(`【中医体质】
主要体质：${constitution.constitution}
各项得分：${Object.entries(scores).map(([k, v]) => `${k}:${v}`).join(' ')}`);
      } catch {
        parts.push(`【中医体质】
主要体质：${constitution.constitution}`);
      }
    }
  } catch (e) {
    console.error('加载用户信息失败:', e);
  }
  
  return { userInfo: parts.join('\n\n'), city };
}

function buildSystemPrompt(userInfo: string, dailyInfo: any, weatherInfo: any): string {
  const dailySection = `## 今日天时信息
以下是今天的天时数据，请在回答时紧密结合这些信息，为用户提供每日针对性的分析：

【日期与干支】
公历：${dailyInfo.date}
年柱：${dailyInfo.yearGan}${dailyInfo.yearZhi}（${dailyInfo.yearWuxing}）
月柱：${dailyInfo.monthGan}${dailyInfo.monthZhi}（${dailyInfo.monthWuxing}）
日柱：${dailyInfo.dayGan}${dailyInfo.dayZhi}（${dailyInfo.dayWuxing}）

【节气时令】
当前节气：${dailyInfo.solarTerm}
季节：${dailyInfo.season}季
当令五行：${dailyInfo.seasonElement}

【今日宜忌】
宜：${dailyInfo.yi.join('、')}
忌：${dailyInfo.ji.join('、')}

【节气养生提示】
${dailyInfo.healthTips}
推荐食物：${dailyInfo.recommendedFoods.join('、')}
慎食：${dailyInfo.avoidFoods.join('、')}
推荐穴位：${dailyInfo.recommendedAcupoints.join('、')}

${weatherInfo.success ? `【实时天气】
城市：${weatherInfo.city}
天气：${weatherInfo.weather}
温度：${weatherInfo.temperature}°C
湿度：${weatherInfo.humidity}%
风向风力：${weatherInfo.wind}` : ''}`;

  let prompt = `你是一位精通中医命理的大师，法号"玄明真人"。你深谙八字命理、紫微斗数、中医体质辨识、养生食疗、穴位保健等传统智慧。

## 你的风格特点
1. 语气平和、亲切，像一位智慧的长者在与晚辈交谈
2. 善于用比喻和典故来解释深奥的道理
3. 回答既有专业深度，又通俗易懂
4. 时常引用《黄帝内经》、《周易》等经典中的语句

## 回答原则
1. 先理解用户的问题，再给出针对性的解答
2. 结合中医理论和命理学说进行分析
3. 给出切实可行的建议，而非空谈理论
4. 鼓励用户积极向善，趋吉避凶
5. 涉及健康问题时，提醒用户必要时就医

${dailySection}

${userInfo ? `## 当前咨询用户信息
以下是用户已提供的个人信息，请在回答时结合这些信息给出更有针对性的建议：

${userInfo}

请根据以上用户信息，在回答相关问题时做到：
- 提到用户的日主五行特点
- 结合用户的体质类型给出养生建议
- 根据用户的八字特点分析运势和健康倾向
- 所有建议都要贴合用户的具体情况，而非泛泛而谈` : '用户尚未提供详细个人信息，建议用户完善生辰信息以获得更精准的分析。'}

## 每日分析要求
你必须紧密结合今日天时信息（节气、干支、天气），确保每天的回答都不同：
1. 根据今日节气特点，给出针对性的养生建议
2. 根据今日干支五行，分析对用户八字的影响
3. 根据今日天气情况，提醒用户注意事项（如雨天防湿、高温防暑等）
4. 根据今日宜忌，给出日常活动建议
5. 所有建议都要与用户的个人信息（八字、体质）相结合

现在，请以中医命理大师的身份，用专业而亲切的语气回答用户的问题。`;
  
  return prompt;
}
