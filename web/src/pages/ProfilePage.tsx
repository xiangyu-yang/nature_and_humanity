import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Bell, Lock, Heart, ChevronRight, Edit, LogOut, Sparkles, BookOpen, History, Bot, Settings, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { api, type ProfileData, type LLMConfig } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const logout = useUserStore(s => s.logout);
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    apiUrl: '',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    enableSearch: true,
  });
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/birth');
      return;
    }
    Promise.all([
      api.getProfile(user.id),
      api.getLLMConfig(user.id),
    ]).then(([profileResult, configResult]) => {
      setData(profileResult.data);
      setLlmConfig(configResult.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [user, navigate]);

  const handleLogout = () => {
    if (confirm('确定退出登录？生辰信息将保留')) {
      logout();
      navigate('/login');
    }
  };

  const handleTestLLM = async () => {
    setTestResult('testing');
    try {
      const result = await api.testLLMConnection(llmConfig);
      if (result.data.success) {
        setTestResult('success');
        setTestMessage(result.data.message);
      } else {
        setTestResult('error');
        setTestMessage(result.data.message);
      }
    } catch {
      setTestResult('error');
      setTestMessage('测试失败，请检查网络连接');
    }
  };

  const handleSaveLLMConfig = async () => {
    try {
      await api.saveLLMConfig(user?.id || '', llmConfig);
      alert('配置保存成功');
    } catch {
      alert('保存失败');
    }
  };

  if (loading || !data) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 用户信息卡 */}
      <section className="card-paper-dark p-6 md:p-8 ornament-corner">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 grid place-items-center text-ink-50 font-display text-3xl shadow-ink">
            {user!.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl text-ink-50 mb-1">{user!.name}</h1>
            <div className="text-ink-100/80 text-sm space-y-0.5">
              <div>{user!.gender === 'male' ? '乾 · 男' : '坤 · 女'}</div>
              <div>🎂 {user!.birthYear}年{user!.birthMonth}月{user!.birthDay}日 {String(user!.birthHour).padStart(2, '0')}:00</div>
              {user!.birthPlace && <div>📍 {user!.birthPlace}</div>}
              <div>📅 注册于 {formatDate(user!.createdAt, 'YYYY-MM-DD')}</div>
            </div>
          </div>
          <Link to="/birth" className="p-2 rounded-full bg-ink-50/10 hover:bg-ink-50/20 text-ink-50" title="编辑">
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 命理档案 */}
      <section>
        <h2 className="font-display text-lg text-ink-600 mb-3">命理档案</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/bazi" className="card-paper p-4 flex items-center gap-3 hover:shadow-ink-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 grid place-items-center">
              <BookOpen className="w-5 h-5 text-ink-50" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-ink-600">八字排盘</div>
              <div className="text-xs text-ink-400 mt-0.5">日主 {data.bazi?.dayMaster || '—'} · {data.bazi?.dayMasterWuxing || '—'}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-300" />
          </Link>
          <Link to="/ziwei" className="card-paper p-4 flex items-center gap-3 hover:shadow-ink-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cinnabar-400 to-cinnabar-600 grid place-items-center">
              <Sparkles className="w-5 h-5 text-ink-50" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-ink-600">紫微星盘</div>
              <div className="text-xs text-ink-400 mt-0.5">已生成命盘数据</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-300" />
          </Link>
          <Link to="/constitution" className="card-paper p-4 flex items-center gap-3 hover:shadow-ink-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center">
              <Heart className="w-5 h-5 text-ink-50" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-ink-600">中医体质</div>
              <div className="text-xs text-ink-400 mt-0.5">{data.constitution?.primaryType || '尚未测评'}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-300" />
          </Link>
          <Link to="/report" className="card-paper p-4 flex items-center gap-3 hover:shadow-ink-lg transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 grid place-items-center">
              <History className="w-5 h-5 text-ink-50" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-ink-600">综合报告</div>
              <div className="text-xs text-ink-400 mt-0.5">三维交叉分析</div>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-300" />
          </Link>
        </div>
      </section>

      {/* 家庭成员 */}
      <section>
        <h2 className="font-display text-lg text-ink-600 mb-3 flex items-center justify-between">
          <span>家庭成员</span>
          <Link to="/family" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
            管理 <ChevronRight className="w-4 h-4" />
          </Link>
        </h2>
        {data.family.length === 0 ? (
          <div className="card-paper p-6 text-center text-sm text-ink-400">
            还没有添加家庭成员
          </div>
        ) : (
          <div className="card-paper p-4 flex items-center gap-3 overflow-x-auto">
            {data.family.slice(0, 6).map(m => (
              <div key={m.id} className="flex flex-col items-center min-w-[60px]">
                <div
                  className="w-12 h-12 rounded-full grid place-items-center text-ink-50 font-display mb-1"
                  style={{
                    background: m.gender === 'male'
                      ? 'linear-gradient(135deg, #1A4D5C 0%, #3A6E7C 100%)'
                      : 'linear-gradient(135deg, #C8553D 0%, #D4A84B 100%)',
                  }}
                >
                  {m.name.charAt(0)}
                </div>
                <div className="text-xs text-ink-600">{m.name}</div>
              </div>
            ))}
            {data.family.length > 6 && (
              <div className="text-xs text-ink-400 ml-2">+{data.family.length - 6}</div>
            )}
          </div>
        )}
      </section>

      {/* 设置 */}
      <section>
        <h2 className="font-display text-lg text-ink-600 mb-3">设置中心</h2>
        <div className="card-paper divide-y divide-ink-100">
          <SettingItem icon={Bell} title="消息通知" desc="运势提醒、节气养生" />
          <SettingItem icon={Lock} title="账号安全" desc="密码与登录管理" />
          <SettingItem icon={UserIcon} title="个人资料" desc="编辑个人信息" link="/birth" />
          <button
            onClick={() => setShowLLMConfig(!showLLMConfig)}
            className="w-full p-4 flex items-center gap-3 hover:bg-ink-50/30 transition-colors"
          >
            <Settings className="w-5 h-5 text-ink-500" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-ink-600">大模型配置</div>
              <div className="text-xs text-ink-400 mt-0.5">API地址、密钥等设置</div>
            </div>
            <ChevronRight className={`w-4 h-4 text-ink-300 transition-transform ${showLLMConfig ? 'rotate-90' : ''}`} />
          </button>
          
          {showLLMConfig && (
            <div className="p-4 bg-ink-50/50 space-y-4">
              <div>
                <label className="block text-xs text-ink-500 mb-1">API地址</label>
                <input
                  type="text"
                  value={llmConfig.apiUrl}
                  onChange={(e) => setLlmConfig({ ...llmConfig, apiUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1/chat/completions"
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-500 mb-1">API密钥</label>
                <input
                  type="password"
                  value={llmConfig.apiKey}
                  onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-500 mb-1">模型名称</label>
                <input
                  type="text"
                  value={llmConfig.model}
                  onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
                  placeholder="gpt-3.5-turbo"
                  className="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">启用联网搜索</span>
                <button
                  onClick={() => setLlmConfig({ ...llmConfig, enableSearch: !llmConfig.enableSearch })}
                  className={`w-12 h-6 rounded-full transition-colors ${llmConfig.enableSearch ? 'bg-teal-500' : 'bg-ink-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${llmConfig.enableSearch ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTestLLM}
                  disabled={testResult === 'testing'}
                  className="flex-1 px-4 py-2 rounded-xl border border-ink-200 text-sm text-ink-600 hover:bg-ink-50 transition-colors flex items-center justify-center gap-2"
                >
                  {testResult === 'testing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      测试中...
                    </>
                  ) : (
                    <>测试连接</>
                  )}
                </button>
                <button
                  onClick={handleSaveLLMConfig}
                  className="flex-1 px-4 py-2 rounded-xl bg-teal-500 text-ink-50 text-sm hover:bg-teal-600 transition-colors"
                >
                  保存配置
                </button>
              </div>
              {testResult !== 'idle' && (
                <div className={`flex items-center gap-2 text-sm ${testResult === 'success' ? 'text-emerald-600' : 'text-cinnabar-600'}`}>
                  {testResult === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testMessage}
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3 hover:bg-cinnabar-50/30 transition-colors text-cinnabar-500"
          >
            <LogOut className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">退出登录</div>
              <div className="text-xs text-cinnabar-400/70 mt-0.5">生辰信息将保留在本地</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 关于 */}
      <section className="card-paper p-5 text-center">
        <div className="text-ink-400 text-xs">
          <p>五行中医智能体 · v1.0.0</p>
          <p className="mt-1">天人合一 · 调和致中</p>
        </div>
      </section>
    </div>
  );
}

function SettingItem({ icon: Icon, title, desc, link }: any) {
  const Tag = link ? Link : 'button';
  return (
    <Tag to={link} className="w-full p-4 flex items-center gap-3 hover:bg-ink-50/30 transition-colors">
      <Icon className="w-5 h-5 text-ink-500" />
      <div className="flex-1 text-left">
        <div className="text-sm font-medium text-ink-600">{title}</div>
        <div className="text-xs text-ink-400 mt-0.5">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-ink-300" />
    </Tag>
  );
}
