import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setConstitution = useUserStore((state) => state.setConstitution);
  const setBazi = useUserStore((state) => state.setBazi);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.code === 0) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        
        const profileResponse = await fetch(`/api/profile/${data.data.id}`);
        const profileData = await profileResponse.json();
        if (profileData.code === 0 && profileData.data) {
          if (profileData.data.constitution) {
            setConstitution({
              primaryType: profileData.data.constitution.primaryType,
              secondaryType: profileData.data.constitution.secondaryType || null,
            });
          }
          if (profileData.data.bazi) {
            setBazi(profileData.data.bazi);
          }
        }
        
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登录失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-rice to-amber-50">
      <div className="w-full max-w-md">
        <div className="card-paper p-8 shadow-2xl ornament-corner">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <span className="text-3xl">☯</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-teal-700 mb-2">五行中医智能体</h1>
            <p className="text-ink-400">探索您的命理与健康之旅</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink-600 mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-600 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-white/60 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-cinnabar-50 border border-cinnabar-200 rounded-xl text-cinnabar-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-500 text-sm">
              还没有账号？{' '}
              <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                立即注册
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-ink-400 text-xs">
          <p>中医智慧 · 天人合一</p>
        </div>
      </div>
    </div>
  );
}
