import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Bot, User, Sparkles, Settings, X, Menu, Trash2, Plus, Clock, MessageCircle } from 'lucide-react';
import { api, API_BASE, type LLMConfig } from '@/api/client';
import { useUserStore } from '@/stores/userStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  thinkingContent?: string; // 思考过程内容
  thinkingCollapsed?: boolean; // 思考过程是否折叠
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export function ChatPage() {
  const user = useUserStore(s => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [llmConfig, setLlmConfig] = useState<LLMConfig | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [enableDeepThinking, setEnableDeepThinking] = useState(true); // 深度思考开关
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    loadConfig();
    loadSessions();
  }, [user?.id]);

  const loadConfig = async () => {
    try {
      const result = await api.getLLMConfig(user?.id || '');
      setLlmConfig(result.data);
    } catch (e) {
      console.error('加载配置失败:', e);
      setLlmConfig({ apiUrl: '', apiKey: '', model: '', enableSearch: true });
    }
  };

  const loadSessions = async () => {
    if (!user?.id) return;
    
    try {
      const result = await fetch(`${API_BASE}/llm/sessions/${user.id}`);
      const data = await result.json();
      if (data.code === 0 && data.data) {
        const parsedSessions = data.data.map((s: any) => ({
          id: s.id,
          title: s.title,
          lastMessage: s.lastMessage,
          timestamp: new Date(s.timestamp),
          messages: s.messages?.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })) || [],
        }));
        setSessions(parsedSessions);
        localStorage.setItem(`chat_sessions_${user.id}`, JSON.stringify(parsedSessions));
      } else {
        throw new Error('加载失败');
      }
    } catch (e) {
      console.error('加载会话失败，使用本地缓存:', e);
      const stored = localStorage.getItem(`chat_sessions_${user?.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSessions(parsed);
        } catch {
          setSessions([]);
        }
      }
    }
  };

  const saveSessionToServer = async (sessionData: {
    sessionId?: string;
    title: string;
    messages: Message[];
    lastMessage: string;
  }) => {
    if (!user?.id) return null;
    
    try {
      const result = await fetch(`${API_BASE}/llm/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: sessionData.sessionId,
          title: sessionData.title,
          messages: sessionData.messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
            thinkingContent: m.thinkingContent,
            thinkingCollapsed: m.thinkingCollapsed,
          })),
          lastMessage: sessionData.lastMessage,
        }),
      });
      const data = await result.json();
      if (data.code === 0 && data.data) {
        return data.data;
      }
      return null;
    } catch (e) {
      console.error('保存会话到服务器失败:', e);
      return null;
    }
  };

  const deleteSessionFromServer = async (sessionId: string) => {
    try {
      const result = await fetch(`${API_BASE}/llm/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      const data = await result.json();
      return data.code === 0;
    } catch (e) {
      console.error('删除会话失败:', e);
      return false;
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    localStorage.setItem(`chat_sessions_${user?.id}`, JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  const createNewSession = () => {
    setActiveSession(null);
    setMessages([]);
    setShowSessions(false);
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(sessionId);
      setMessages(session.messages);
    }
    setShowSessions(false);
  };

  const deleteSession = async (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    saveSessions(updated);
    if (activeSession === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
    await deleteSessionFromServer(sessionId);
  };

  const saveCurrentSession = async (newMessages: Message[]) => {
    const firstUserMessage = newMessages.find(m => m.role === 'user');
    if (!firstUserMessage) return;

    const title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
    const lastMessage = newMessages[newMessages.length - 1]?.content || '';

    if (activeSession) {
      const updated = sessions.map(s => 
        s.id === activeSession 
          ? { ...s, title, lastMessage, timestamp: new Date(), messages: newMessages }
          : s
      );
      saveSessions(updated);
      await saveSessionToServer({
        sessionId: activeSession,
        title,
        messages: newMessages,
        lastMessage,
      });
    } else {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        lastMessage,
        timestamp: new Date(),
        messages: newMessages,
      };
      const updated = [newSession, ...sessions.slice(0, 19)];
      saveSessions(updated);
      setActiveSession(newSession.id);
      
      const serverResult = await saveSessionToServer({
        title,
        messages: newMessages,
        lastMessage,
      });
      
      if (serverResult && serverResult.id) {
        const finalUpdated = updated.map(s => 
          s.id === newSession.id ? { ...s, id: serverResult.id } : s
        );
        saveSessions(finalUpdated);
        setActiveSession(serverResult.id);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const thinkingMessageId = (Date.now() + 1).toString();
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isThinking: true,
    };
    const messagesWithThinking = [...newMessages, thinkingMessage];
    setMessages(messagesWithThinking);

    try {
      const history = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const configToUse = llmConfig && llmConfig.apiUrl && llmConfig.model 
        ? { apiUrl: llmConfig.apiUrl, apiKey: llmConfig.apiKey, model: llmConfig.model }
        : undefined;

      const response = await fetch(`${API_BASE}/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user?.id || '', 
          message: input.trim(), 
          history,
          enableDeepThinking,
          ...configToUse 
        }),
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let accumulatedReasoning = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              // 如果关闭了深度思考，直接显示最终答案
              if (!enableDeepThinking && accumulatedContent) {
                const finalMessages = messagesWithThinking
                  .filter(m => m.id !== thinkingMessageId)
                  .concat([{
                    id: thinkingMessageId,
                    role: 'assistant' as const,
                    content: accumulatedContent,
                    timestamp: new Date(),
                  }]);
                setMessages(finalMessages);
                await saveCurrentSession(finalMessages);
                setIsLoading(false);
                return;
              }
              // 如果开启了深度思考，折叠显示思考过程
              const finalMessages = messagesWithThinking
                .filter(m => m.id !== thinkingMessageId)
                .concat([{
                  id: thinkingMessageId,
                  role: 'assistant' as const,
                  content: accumulatedContent || '抱歉，我没有生成任何回答。',
                  timestamp: new Date(),
                  thinkingContent: accumulatedReasoning,
                  thinkingCollapsed: true, // 默认折叠
                }]);
              setMessages(finalMessages);
              await saveCurrentSession(finalMessages);
              setIsLoading(false);
              return;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                accumulatedContent += data.content;
                if (!enableDeepThinking) {
                  // 关闭深度思考时，只显示最终答案
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === thinkingMessageId 
                        ? { ...m, content: accumulatedContent, isThinking: false }
                        : m
                    )
                  );
                } else {
                  // 开启深度思考时，显示思考过程
                  const displayContent = `【分析中...】\n${accumulatedContent}`;
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === thinkingMessageId 
                        ? { ...m, content: displayContent, isThinking: true }
                        : m
                    )
                  );
                }
              } else if (data.reasoning && enableDeepThinking) {
                accumulatedReasoning += data.reasoning;
                if (accumulatedContent === '') {
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === thinkingMessageId 
                        ? { ...m, content: `【思考中...】\n${accumulatedReasoning.trim()}`, isThinking: true }
                        : m
                    )
                  );
                }
              }
            } catch {
              continue;
            }
          }
        }
      }

      const finalContent = accumulatedContent || accumulatedReasoning || '抱歉，我没有生成任何回答。';
      const finalMessages = messagesWithThinking
        .filter(m => m.id !== thinkingMessageId)
        .concat([{
          id: thinkingMessageId,
          role: 'assistant' as const,
          content: finalContent,
          timestamp: new Date(),
        }]);
      setMessages(finalMessages);
      await saveCurrentSession(finalMessages);
      setIsLoading(false);
    } catch (error) {
      console.error('聊天错误:', error);
      const errorMessages = messagesWithThinking
        .filter(m => m.id !== thinkingMessageId)
        .concat([{
          id: thinkingMessageId,
          role: 'assistant' as const,
          content: '抱歉，我暂时无法回答您的问题，请稍后重试。',
          timestamp: new Date(),
        }]);
      setMessages(errorMessages);
      await saveCurrentSession(errorMessages);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveConfig = async () => {
    try {
      await api.saveLLMConfig(user?.id || '', llmConfig!);
      alert('配置保存成功');
      setShowConfig(false);
    } catch {
      alert('保存失败');
    }
  };

  return (
    <div className="h-full flex">
      {/* 会话列表侧边栏 - 桌面端 */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 bg-ink-50 border-r border-ink-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${showSessions ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-ink-200 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink-600 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            历史会话
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={createNewSession}
              className="p-2 hover:bg-ink-100 rounded-lg transition-colors"
              title="新建会话"
            >
              <Plus className="w-4 h-4 text-ink-500" />
            </button>
            <button
              onClick={() => setShowSessions(false)}
              className="p-2 hover:bg-ink-100 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-4 h-4 text-ink-500" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-ink-100 mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-ink-400" />
              </div>
              <p className="text-sm text-ink-400">暂无历史会话</p>
              <p className="text-xs text-ink-300 mt-1">开始对话后会自动保存</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className={`p-3 rounded-xl cursor-pointer transition-all group ${
                  activeSession === session.id
                    ? 'bg-teal-500 text-ink-50'
                    : 'bg-white hover:bg-ink-100 text-ink-600 border border-ink-100'
                }`}
                onClick={() => selectSession(session.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium truncate flex-1">{session.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定删除这个会话？')) {
                        deleteSession(session.id);
                      }
                    }}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      activeSession === session.id 
                        ? 'hover:bg-ink-50/20' 
                        : 'hover:bg-ink-200'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className={`text-xs mt-1 truncate line-clamp-2 ${
                  activeSession === session.id ? 'text-ink-50/70' : 'text-ink-400'
                }`}>
                  {session.lastMessage}
                </p>
                <p className={`text-xs mt-2 ${
                  activeSession === session.id ? 'text-ink-50/50' : 'text-ink-300'
                }`}>
                  {new Date(session.timestamp).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* 遮罩层 - 移动端 */}
      {showSessions && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setShowSessions(false)}
        />
      )}

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="card-paper-dark p-4 ornament-corner">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSessions(true)}
              className="p-2 hover:bg-ink-50/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-ink-100" />
            </button>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-lg bg-gradient-to-br from-teal-500 to-teal-700">
              <img
                src="/img/profile.png"
                alt="中医命理大师"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl text-ink-50">中医命理大师</h1>
              <p className="text-xs text-ink-100/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {llmConfig?.apiUrl ? '已配置本地模型' : '使用内置响应'}
              </p>
            </div>
            <button
              onClick={async () => {
                setShowConfig(!showConfig);
                if (!showConfig) {
                  await loadConfig();
                }
              }}
              className="p-2 hover:bg-ink-50/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-ink-100" />
            </button>
          </div>
        </header>

        {/* 配置面板 - 移到header下方 */}
        {showConfig && (
          <div className="bg-ink-50 p-4 border-b border-ink-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-ink-600">大模型配置</h3>
              <button onClick={() => setShowConfig(false)}>
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink-500 mb-1">API地址</label>
                <input
                  type="text"
                  value={llmConfig?.apiUrl || ''}
                  onChange={(e) => setLlmConfig({ ...(llmConfig || {}), apiUrl: e.target.value })}
                  placeholder="http://localhost:11434/v1"
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-500 mb-1">模型名称</label>
                <input
                  type="text"
                  value={llmConfig?.model || ''}
                  onChange={(e) => setLlmConfig({ ...(llmConfig || {}), model: e.target.value })}
                  placeholder="qwen3.6:35b-a3b-q8_0"
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-ink-500 mb-1">API密钥（Ollama不需要）</label>
                <input
                  type="password"
                  value={llmConfig?.apiKey || ''}
                  onChange={(e) => setLlmConfig({ ...(llmConfig || {}), apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-ink-200">
                  <div>
                    <p className="text-sm text-ink-600 font-medium">深度思考</p>
                    <p className="text-xs text-ink-400">开启后，大模型会展示思考过程</p>
                  </div>
                  <button
                    onClick={() => setEnableDeepThinking(!enableDeepThinking)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      enableDeepThinking ? 'bg-teal-500' : 'bg-ink-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        enableDeepThinking ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 px-4 py-2 rounded-xl bg-teal-500 text-ink-50 text-sm hover:bg-teal-600 transition-colors"
                >
                  保存配置
                </button>
                <button
                  onClick={() => {
                    setLlmConfig({ apiUrl: '', apiKey: '', model: '', enableSearch: true });
                    setShowConfig(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-ink-200 text-sm text-ink-600 hover:bg-ink-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-teal-50/50 to-amber-50/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full mb-6 flex items-center justify-center bg-gradient-to-br from-teal-100 to-amber-100">
                <Bot className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="font-display text-2xl text-ink-600 mb-3">您好，我是中医命理大师</h3>
              <p className="text-sm text-ink-400 max-w-md mb-8">
                我可以为您解答八字命理、中医养生、运势分析等问题。有什么我可以帮助您的？
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  '帮我分析一下我的八字五行',
                  '气虚体质怎么调理？',
                  '今年运势如何？',
                  '推荐一些养生食疗方',
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="p-4 text-left rounded-xl bg-white border border-ink-100 hover:border-teal-300 hover:shadow-md transition-all text-sm text-ink-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex-shrink-0 grid place-items-center ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-teal-500 to-teal-600' 
                    : 'bg-gradient-to-br from-amber-400 to-amber-500'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-ink-50" />
                  ) : (
                    <Bot className="w-4 h-4 text-ink-50" />
                  )}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-ink-50 rounded-br-md'
                      : 'bg-white border border-ink-100 text-ink-600 rounded-bl-md shadow-sm'
                  }`}>
                    {msg.isThinking && !msg.content ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-teal-500" />
                        <span className="text-sm text-ink-400">正在思考...</span>
                        <div className="flex gap-0.5 ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {msg.thinkingContent && msg.thinkingCollapsed !== undefined && (
                          <div className="border-b border-ink-100 pb-2 mb-2">
                            <button
                              onClick={() => {
                                setMessages(prev => prev.map(m => 
                                  m.id === msg.id 
                                    ? { ...m, thinkingCollapsed: !m.thinkingCollapsed }
                                    : m
                                ));
                              }}
                              className="flex items-center gap-2 text-xs text-teal-600 hover:text-teal-700 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{msg.thinkingCollapsed ? '点击展开思考过程' : '点击收起思考过程'}</span>
                              <span className="text-ink-300">({msg.thinkingContent.length} 字)</span>
                            </button>
                            {!msg.thinkingCollapsed && (
                              <div className="mt-2 p-2 bg-amber-50/50 rounded-lg text-xs text-ink-400 italic whitespace-pre-wrap">
                                {msg.thinkingContent.trim()}
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-ink-300 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="card-paper p-4 border-t border-ink-100">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题，如：我的八字五行如何？..."
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-ink-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none text-sm placeholder-ink-300 transition-all"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-ink-50 shadow-lg hover:shadow-xl'
                  : 'bg-ink-100 text-ink-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
