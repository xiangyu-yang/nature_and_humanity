import { Router } from 'express';

export const newsRouter = Router();

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
  date: string;
  source: string;
  url?: string;
  imageUrl?: string;
  externalLink?: string;
  fetching?: boolean;
}

const LOCAL_NEWS: NewsArticle[] = [
  { 
    id: 'local-1',
    title: '小满时节：清热利湿，养心健脾', 
    summary: '小满者，物至于此小得盈满。中医认为此时阳气始盛，湿热渐起，宜食苦清热，甘淡利湿...', 
    tag: '节气养生', 
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    source: '中医知识库',
    content: `## 小满节气养生要点

小满是二十四节气中的第八个节气，夏季的第二个节气。小满者，物至于此小得盈满。此时，北方麦类等夏熟作物籽粒开始饱满，但尚未成熟，故称小满。

### 一、气候特点

小满时节，气温明显升高，雨水增多，天地间阳气旺盛，湿气渐重。中医认为，此时湿热交蒸，人体容易受到湿热之邪的侵袭。

### 二、养生原则

**1. 清热利湿**

小满时节，湿热并重，饮食宜清淡，多食具有清热利湿作用的食物，如：

- 苦瓜：味苦性寒，清热解毒，明目益气
- 冬瓜：味甘淡性凉，利水消肿，清热解暑
- 绿豆：味甘性寒，清热解毒，消暑利水
- 薏米：味甘淡性凉，健脾利湿，清热排脓
- 荷叶：味苦性平，清暑利湿，升发清阳

**2. 养心健脾**

夏属火，对应心脏。小满时节，阳气旺盛，心火易亢，应注意养心安神：

- 保持心情舒畅，避免烦躁暴怒
- 适当午休，补充睡眠
- 食红色食物养心，如红豆、红枣、西红柿
- 苦味入心，可适当食用苦味食物

**3. 起居有常**

- 晚睡早起，顺应阳气变化
- 避免大汗淋漓，防止伤津耗气
- 适当运动，以微汗为宜
- 注意防暑降温，避免中暑

### 三、推荐食谱

**冬瓜薏米汤**

材料：冬瓜500克，薏米30克，排骨200克，生姜3片

做法：
1. 薏米提前浸泡2小时
2. 排骨焯水，冬瓜切块
3. 所有材料放入锅中，加水煮沸后转小火炖1.5小时
4. 加盐调味即可

功效：清热利湿，健脾消肿

**绿豆百合粥**

材料：绿豆50克，百合20克，大米100克，冰糖适量

做法：
1. 绿豆提前浸泡2小时
2. 大米洗净，百合洗净
3. 所有材料放入锅中，加水煮沸后转小火煮至粥稠
4. 加冰糖调味即可

功效：清热解毒，润肺安神

### 四、穴位保健

**足三里穴**

- 位置：外膝眼下3寸，胫骨外侧一横指处
- 功效：健脾和胃，扶正培元
- 方法：每日按揉2-3次，每次1-3分钟

**曲池穴**

- 位置：肘横纹外侧端，屈肘时尺泽与肱骨外上髁连线中点
- 功效：清热解表，疏通经络
- 方法：每日按揉2次，每次1-2分钟

### 五、注意事项

1. 忌食辛辣油腻食物，以免助湿生热
2. 避免贪凉饮冷，防止损伤脾胃阳气
3. 注意情绪调节，保持心态平和
4. 运动宜在清晨或傍晚进行，避免中午烈日

小满时节，万物繁茂，生长最盛。人体新陈代谢旺盛，消耗也大，应及时补充营养，保持精力充沛。`,
  },
  { 
    id: 'local-2',
    title: '九种体质辨识：你是哪一种？', 
    summary: '中医将人体分为九种体质：平和、气虚、阳虚、阴虚、痰湿、湿热、血瘀、气郁、特禀。每种体质都有其独特的特点和养生方法...', 
    tag: '体质知识', 
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    source: '中医知识库',
    content: `## 中医九种体质辨识

中医体质学说认为，不同的人有不同的体质类型，了解自己的体质，才能有针对性地进行养生保健。中华中医药学会将人体体质分为九种类型。

### 一、平和质

**特征：** 体形匀称健壮，面色、肤色润泽，头发稠密有光泽，目光有神，鼻色明润，嗅觉通利，唇色红润，精力充沛，不易疲劳，耐受寒热，睡眠良好，胃纳佳，二便正常。

**调养方式：**
- 饮食有节，不偏食
- 劳逸结合，适度运动
- 保持良好心态

### 二、气虚质

**特征：** 肌肉松软不实，语音低弱，气短懒言，容易疲乏，精神不振，易出汗，舌淡红，舌边有齿痕，脉弱。

**调养方式：**
- 饮食：多吃益气健脾食物，如山药、黄芪、党参、大枣
- 运动：适度运动，避免过度劳累
- 生活：起居有常，避免熬夜
- 穴位：常按足三里、气海穴

### 三、阳虚质

**特征：** 肌肉松软不实，平素畏冷，手足不温，喜热饮食，精神不振，舌淡胖嫩，脉沉迟。

**调养方式：**
- 饮食：多食温热食物，如羊肉、生姜、桂圆、韭菜
- 运动：多做户外运动，多晒太阳
- 生活：注意保暖，避免受凉
- 穴位：常按关元、命门穴

### 四、阴虚质

**特征：** 体形偏瘦，手足心热，口燥咽干，鼻微干，喜冷饮，大便干燥，舌红少津，脉细数。

**调养方式：**
- 饮食：多食滋阴润燥食物，如银耳、百合、雪梨、枸杞
- 运动：适度运动，避免大汗
- 生活：早睡早起，避免熬夜
- 穴位：常按三阴交、太溪穴

### 五、痰湿质

**特征：** 体形肥胖，腹部肥满松软，面部皮肤油脂较多，多汗且黏，胸闷，痰多，口黏腻或甜，喜食肥甘甜黏，苔腻，脉滑。

**调养方式：**
- 饮食：清淡饮食，多食薏米、冬瓜、赤小豆
- 运动：坚持运动，控制体重
- 生活：居住环境宜干燥
- 穴位：常按丰隆、阴陵泉穴

### 六、湿热质

**特征：** 面垢油光，易生痤疮，口苦口干，身重困倦，大便黏滞不畅或燥结，小便短黄，男性易阴囊潮湿，女性易带下增多，舌质偏红，苔黄腻，脉滑数。

**调养方式：**
- 饮食：清热利湿，多食苦瓜、绿豆、芹菜
- 运动：适度运动，出汗排毒
- 生活：避免湿热环境
- 穴位：常按曲池、阴陵泉穴

### 七、血瘀质

**特征：** 肤色晦黯，色素沉着，容易出现瘀斑，口唇黯淡，舌黯或有瘀点，舌下络脉紫黯或增粗，脉涩。

**调养方式：**
- 饮食：活血化瘀，多食山楂、红糖、玫瑰花
- 运动：坚持运动，促进气血运行
- 生活：保持心情舒畅
- 穴位：常按血海、三阴交穴

### 八、气郁质

**特征：** 体形瘦者为多，性格内向不稳定，敏感多疑，情感脆弱，烦闷不乐，舌淡红，苔薄白，脉弦。

**调养方式：**
- 饮食：疏肝理气，多食玫瑰花、佛手、柑橘
- 运动：多参加集体活动
- 生活：保持心情舒畅，培养兴趣爱好
- 穴位：常按太冲、期门穴

### 九、特禀质

**特征：** 过敏体质，易对药物、食物、气味、花粉、季节过敏。

**调养方式：**
- 饮食：清淡均衡，避免过敏原
- 运动：适度运动，增强体质
- 生活：避免接触过敏原
- 穴位：常按曲池、血海穴

### 体质测试方法

您可以通过专业的中医体质辨识问卷进行测试，或者前往中医院进行体质辨识。了解自己的体质后，可以有针对性地进行养生保健。

需要注意的是，很多人并不是单一的体质类型，可能是两种或多种体质的兼夹。建议在专业中医师指导下进行调理。`,
  },
  { 
    id: 'local-3',
    title: '足三里：万能的保健要穴', 
    summary: '足三里穴是足阳明胃经的合穴，被誉为"长寿第一穴"，能健脾和胃、扶正培元、通经活络...', 
    tag: '穴位保健', 
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    source: '中医知识库',
    content: `## 足三里穴：长寿第一穴

足三里穴是中医保健中最重要的穴位之一，被誉为"长寿第一穴"。它是足阳明胃经的合穴，也是保健要穴，自古以来就备受推崇。

### 一、穴位定位

**位置：** 在小腿前外侧，当犊鼻下3寸，距胫骨前缘一横指（中指）处。

**简单找法：**
1. 正坐屈膝成90度
2. 找到膝盖外侧凹陷处（犊鼻穴）
3. 从凹陷处向下量四横指（约3寸）
4. 再向胫骨外侧量一横指处，就是足三里穴

### 二、穴位功效

**1. 健脾和胃**

足三里是胃经的合穴，"合治内腑"，是治疗脾胃疾病的要穴：

- 胃痛、腹胀、消化不良
- 呕吐、泄泻、便秘
- 食欲不振、身体消瘦

**2. 扶正培元**

足三里能补益气血，增强体质：

- 体质虚弱、容易疲劳
- 免疫力低下、容易感冒
- 病后体虚、术后恢复

**3. 通经活络**

足三里位于下肢，能疏通经络：

- 下肢痿痹、麻木
- 膝痛、腿痛
- 脚气、水肿

**4. 其他功效**

- 安神定志：改善失眠、焦虑
- 美容养颜：改善面色萎黄
- 调节血糖：辅助降糖
- 降脂减肥：促进代谢

### 三、按摩方法

**按揉法：**
1. 用拇指或中指指腹按揉足三里穴
2. 力度以有酸胀感为宜
3. 每次按揉1-3分钟，每日2-3次
4. 两侧穴位都要按揉

**艾灸法：**
1. 用艾条温和灸足三里穴
2. 距离皮肤2-3厘米，以温热舒适为宜
3. 每次灸10-15分钟，每日或隔日1次
4. 注意防止烫伤

**拍打/叩击法：**
1. 双手握拳，用拳眼叩击足三里穴
2. 力度适中，每次叩击100-200下
3. 每日1-2次

### 四、最佳刺激时间

- **辰时（7-9点）：** 胃经当令，此时刺激足三里，健脾效果最好
- **饭后半小时：** 促进消化，增强脾胃功能
- **睡前：** 安神助眠，改善睡眠质量

### 五、注意事项

1. 孕妇慎用，尤其是怀孕早期
2. 皮肤有破损、感染时不宜按摩或艾灸
3. 过饥过饱时不宜强刺激
4. 艾灸时注意通风，避免一氧化碳中毒
5. 按摩力度以舒适为度，不宜过猛

### 六、搭配穴位

**增强健脾效果：** 足三里 + 脾俞 + 中脘
**增强补气效果：** 足三里 + 气海 + 关元
**改善失眠：** 足三里 + 三阴交 + 神门
**调理肠胃：** 足三里 + 天枢 + 上巨虚

### 七、历代记载

- 《灵枢》："邪在脾胃，则病肌肉痛，阳气有余，阴气不足，则热中善饥；阳气不足，阴气有余，则寒中肠鸣腹痛。阴阳俱有余，若俱不足，则有寒有热。皆调于三里。"
- 《针灸甲乙经》："五脏六腑之胀，皆取三里。三里者，胀之要穴也。"
- 《针灸大成》："主胃中寒，心腹胀满，肠鸣，脏气虚惫，真气不足，腹痛食不下，大便不通，心闷不已，卒心痛，腹有逆气上攻，腰痛，小肠气，水气蛊毒，霍乱呕吐，痢疾。"

足三里穴是中医保健的万能穴，坚持按摩或艾灸，对身体健康大有益处。常按足三里，胜吃老母鸡！`,
  },
];

const articleCache: Map<string, NewsArticle> = new Map();
let newsCache: NewsArticle[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 30 * 60 * 1000;

function scheduleDailyRefresh() {
  const now = new Date();
  const targetTime = new Date(now);
  targetTime.setHours(12, 0, 0, 0);
  
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }
  
  let delay = targetTime.getTime() - now.getTime();
  
  const runRefresh = () => {
    console.log('[News] Daily refresh triggered at', new Date().toLocaleString());
    fetchRealNews(true).catch(console.error);
    
    delay = 24 * 60 * 60 * 1000;
    setTimeout(runRefresh, delay);
  };
  
  setTimeout(runRefresh, delay);
  console.log('[News] Scheduled daily refresh at', targetTime.toLocaleString());
}

scheduleDailyRefresh();

async function fetchRealNews(forceRefresh = false): Promise<NewsArticle[]> {
  const now = Date.now();
  if (!forceRefresh && newsCache.length > 0 && now - lastFetchTime < CACHE_TTL) {
    return newsCache;
  }

  try {
    const allKeywordThemes = [
      '体质辨识 中医养生',
      '节气养生 传统中医',
      '穴位按摩 保健方法',
      '中医食疗 养生健康',
      '药膳食谱 养生调理',
      '黄帝内经 养生智慧',
      '经络养生 中医保健',
      '八段锦 养生功法',
      '刮痧疗法 中医养生',
      '太极拳 养生运动',
      '艾灸养生 保健方法',
      '五行养生 中医调理',
    ];
    
    const shuffled = [...allKeywordThemes].sort(() => Math.random() - 0.5);
    const keywords = shuffled.slice(0, 4);
    
    const searchResults = await Promise.all(
      keywords.map(keyword => fetchFromSogou(keyword))
    );
    
    const candidateArticles: NewsArticle[] = [];
    const seenTitles = new Set<string>();
    
    for (const articles of searchResults) {
      for (const article of articles) {
        const normalizedTitle = article.title.replace(/\s/g, '');
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle);
          
          if (article.url?.includes('sogou.com/link')) continue;
          if (article.url?.includes('iiyiyi.com')) continue;
          if (article.url?.includes('mp.weixin.qq.com')) continue;
          if (article.url?.includes('baidu.com/s?')) continue;
          if (article.url?.includes('zhihu.com/question')) continue;
          if (article.url?.includes('baike.baidu.com')) continue;
          
          candidateArticles.push(article);
        }
      }
    }
    
    const validatedArticles: NewsArticle[] = [];
    
    for (const article of candidateArticles) {
      if (validatedArticles.length >= 8) break;
      
      try {
        const content = await fetchArticleContent(article.url || '', 1);
        if (content && content.length > 150) {
          validatedArticles.push({ ...article, content });
          articleCache.set(article.id, article);
        }
      } catch (error) {
        console.warn('[News] Failed to validate:', article.title.substring(0, 30));
      }
    }
    
    if (validatedArticles.length < 4) {
      const themeKeywords = [
        { theme: '体质', keywords: ['中医体质 九种体质辨识', '气虚阳虚阴虚体质'] },
        { theme: '节气', keywords: ['二十四节气养生', '节气养生注意事项'] },
        { theme: '穴位', keywords: ['人体穴位保健按摩', '足三里涌泉穴位'] },
        { theme: '食疗', keywords: ['药膳食疗养生', '养生药膳食谱'] },
      ];
      
      for (const theme of themeKeywords) {
        if (validatedArticles.length >= 8) break;
        
        const themeKeyword = theme.keywords[Math.floor(Math.random() * theme.keywords.length)];
        const themeArticles = await fetchFromSogou(themeKeyword);
        
        for (const article of themeArticles) {
          if (validatedArticles.length >= 8) break;
          
          const normalizedTitle = article.title.replace(/\s/g, '');
          if (seenTitles.has(normalizedTitle)) continue;
          if (article.url?.includes('sogou.com/link')) continue;
          
          seenTitles.add(normalizedTitle);
          
          try {
            const content = await fetchArticleContent(article.url || '', 1);
            if (content && content.length > 150) {
              validatedArticles.push({ ...article, content, tag: theme.theme + '养生' });
              articleCache.set(article.id, article);
            }
          } catch (error) {
            console.warn('[News] Failed theme:', theme.theme, article.title.substring(0, 30));
          }
        }
      }
    }
    
    if (validatedArticles.length === 0) {
      console.warn('[News] No validated articles, using local news');
      return LOCAL_NEWS.slice(0, 8);
    }
    
    newsCache = validatedArticles;
    lastFetchTime = now;
    
    return newsCache;
  } catch (error) {
    console.warn('[News] Failed to fetch real news:', error);
    if (newsCache.length > 0) {
      return newsCache;
    }
    return LOCAL_NEWS;
  }
}

async function fetchArticleContent(url: string, maxRetries = 2): Promise<string> {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  ];

  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000,
        redirect: 'follow',
      } as any);
      
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 2000 * (retry + 1)));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      let content = '';
      
      const contentSelectors = [
        /<article[^>]*>([\s\S]*?)<\/article>/i,
        /<div[^>]*class="article-content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="main-content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="post-content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="entry-content"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="article-body"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="article"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="detail"[^>]*>([\s\S]*?)<\/div>/i,
        /<div[^>]*class="text-content"[^>]*>([\s\S]*?)<\/div>/i,
      ];
      
      for (const selector of contentSelectors) {
        const match = html.match(selector);
        if (match) {
          content = match[1];
          break;
        }
      }
      
      if (!content) {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          content = bodyMatch[1];
        }
      }
      
      content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      content = content.replace(/<[^>]+>/g, '\n');
      content = content.replace(/\n{2,}/g, '\n');
      content = content.trim();
      
      const lines = content.split('\n');
      const filteredLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 10 && 
               !trimmed.includes('返回首页') && 
               !trimmed.includes('上一篇') && 
               !trimmed.includes('下一篇') && 
               !trimmed.includes('分享') && 
               !trimmed.includes('收藏') && 
               !trimmed.includes('相关推荐') &&
               !trimmed.includes('广告') &&
               !trimmed.includes('登录') &&
               !trimmed.includes('注册');
      });
      
      const result = filteredLines.join('\n\n').substring(0, 8000);
      
      if (result.length > 200) {
        return result;
      }
      
      if (retry < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
      }
    } catch (error) {
      console.warn('[News] Fetch article content attempt', retry + 1, 'failed:', error);
      if (retry < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (retry + 1)));
      }
    }
  }
  
  console.warn('[News] All attempts to fetch article content failed:', url);
  return '';
}

async function fetchFromBaidu(keyword: string): Promise<NewsArticle[]> {
  try {
    const url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword + ' 养生知识')}&rn=10`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 5000,
    } as any);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    const articles: NewsArticle[] = [];
    
    const titleRegex = /<h3[^>]*class="c-title"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/g;
    const contentRegex = /<span[^>]*class="c-content-right"[^>]*>([\s\S]*?)<\/span>/g;
    const sourceRegex = /<span[^>]*class="c-color-gray"[^>]*>([^<]+)<\/span>/g;
    
    let match;
    let index = 0;
    const contents: string[] = [];
    const sources: string[] = [];
    
    while ((match = contentRegex.exec(html)) !== null) {
      contents.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    
    while ((match = sourceRegex.exec(html)) !== null) {
      sources.push(match[1].trim());
    }
    
    while ((match = titleRegex.exec(html)) !== null && index < 10) {
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      const url = match[1];
      
      if (title && title.length > 5) {
        const article: NewsArticle = {
          id: `baidu-${Date.now()}-${index}`,
          title: title.substring(0, 50),
          summary: contents[index] || '点击查看详情',
          content: '',
          tag: keyword,
          date: new Date().toISOString().split('T')[0],
          source: sources[index] || '百度',
          url: url.startsWith('http') ? url : `https://www.baidu.com${url}`,
        };
        articles.push(article);
        index++;
      }
    }
    
    return articles;
  } catch (error) {
    console.warn('[News] Baidu fetch failed:', error);
    return [];
  }
}

async function fetchFromSogou(keyword: string): Promise<NewsArticle[]> {
  try {
    const url = `https://www.sogou.com/web?query=${encodeURIComponent(keyword + ' 养生方法')}&num=10`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 5000,
    } as any);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    const articles: NewsArticle[] = [];
    
    const itemRegex = /<div[^>]*class="vrwrap"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
    const titleRegex = /<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/;
    const contentRegex = /<p[^>]*class="star-wiki"[^>]*>([\s\S]*?)<\/p>/;
    const sourceRegex = /<cite[^>]*>([^<]+)<\/cite>/;
    
    let match;
    let index = 0;
    
    while ((match = itemRegex.exec(html)) !== null && index < 10) {
      const itemHtml = match[1];
      
      const titleMatch = itemHtml.match(titleRegex);
      const contentMatch = itemHtml.match(contentRegex);
      const sourceMatch = itemHtml.match(sourceRegex);
      
      if (titleMatch) {
        const title = titleMatch[2].replace(/<[^>]+>/g, '').trim();
        
        if (title && title.length > 5) {
          const article: NewsArticle = {
            id: `sogou-${Date.now()}-${index}`,
            title: title.substring(0, 50),
            summary: contentMatch ? contentMatch[1].replace(/<[^>]+>/g, '').trim().substring(0, 100) : '点击查看详情',
            content: '',
            tag: keyword,
            date: new Date().toISOString().split('T')[0],
            source: sourceMatch ? sourceMatch[1].trim() : '搜狗',
            url: titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.sogou.com${titleMatch[1]}`,
          };
          articles.push(article);
          index++;
        }
      }
    }
    
    return articles;
  } catch (error) {
    console.warn('[News] Sogou fetch failed:', error);
    return [];
  }
}

newsRouter.get('/', async (_req, res) => {
  try {
    const [localArticles, realArticles] = await Promise.all([
      Promise.resolve(LOCAL_NEWS.slice(0, 3)),
      fetchRealNews(),
    ]);
    
    const seenIds = new Set<string>();
    const uniqueArticles: NewsArticle[] = [];
    
    for (const article of [...realArticles, ...localArticles]) {
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
    }
    
    const combined = uniqueArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
    
    res.json({ code: 0, data: combined });
  } catch (error) {
    console.error('[News] Error:', error);
    res.json({ code: 0, data: LOCAL_NEWS });
  }
});

newsRouter.post('/refresh', async (_req, res) => {
  try {
    const [realArticles, localArticles] = await Promise.all([
      fetchRealNews(true),
      Promise.resolve(LOCAL_NEWS.slice(0, 5)),
    ]);
    
    const seenIds = new Set<string>();
    const uniqueArticles: NewsArticle[] = [];
    
    for (const article of [...realArticles, ...localArticles]) {
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
    }
    
    const combined = uniqueArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
    
    res.json({ code: 0, data: combined, message: '刷新成功' });
  } catch (error) {
    console.error('[News] Refresh error:', error);
    res.json({ code: 500, message: '刷新失败' });
  }
});

newsRouter.get('/local', (_req, res) => {
  res.json({ code: 0, data: LOCAL_NEWS });
});

newsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  const localArticle = LOCAL_NEWS.find(a => a.id === id);
  if (localArticle) {
    return res.json({ code: 0, data: localArticle });
  }
  
  let cachedArticle = articleCache.get(id);
  if (cachedArticle) {
    if (!cachedArticle.content && (cachedArticle.url || cachedArticle.externalLink)) {
      fetchArticleContent(cachedArticle.url || cachedArticle.externalLink || '')
        .then(content => {
          if (content) {
            articleCache.set(id, { ...cachedArticle, content, fetching: false });
          } else {
            articleCache.set(id, { ...cachedArticle, fetching: false });
          }
        })
        .catch(err => {
          console.warn('[News] Async fetch article content failed:', err);
          articleCache.set(id, { ...cachedArticle, fetching: false });
        });
      
      return res.json({ code: 0, data: { ...cachedArticle, fetching: true } });
    }
    return res.json({ code: 0, data: { ...cachedArticle, fetching: false } });
  }
  
  res.status(404).json({ code: 404, message: '文章不存在' });
});