import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { api } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { HOUR_RANGE } from '@/data/ganzhi';

const places = [
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '广州', label: '广州' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '南京', label: '南京' },
  { value: '成都', label: '成都' },
  { value: '武汉', label: '武汉' },
  { value: '西安', label: '西安' },
  { value: '重庆', label: '重庆' },
  { value: '苏州', label: '苏州' },
  { value: '天津', label: '天津' },
  { value: '青岛', label: '青岛' },
  { value: '厦门', label: '厦门' },
  { value: '长沙', label: '长沙' },
  { value: '其他', label: '其他' },
];

export function BirthPage() {
  const navigate = useNavigate();
  const setUser = useUserStore(s => s.setUser);
  const existingUser = useUserStore(s => s.user);

  const [step, setStep] = useState(1);
  const [name, setName] = useState(existingUser?.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(existingUser?.gender || 'male');
  const [year, setYear] = useState(existingUser?.birthYear || 1990);
  const [month, setMonth] = useState(existingUser?.birthMonth || 1);
  const [day, setDay] = useState(existingUser?.birthDay || 1);
  const [hour, setHour] = useState(existingUser?.birthHour ?? 12);
  const [place, setPlace] = useState(existingUser?.birthPlace || '北京');
  const [isLunar, setIsLunar] = useState(existingUser?.isLunar || false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('请输入姓名');
        return;
      }
      setError('');
    }
    if (step < 3) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError('');
    try {
      let user;
      if (existingUser) {
        user = await api.updateUser(existingUser.id, {
          name: name.trim(),
          gender,
          birthYear: year,
          birthMonth: month,
          birthDay: day,
          birthHour: hour,
          birthPlace: place,
          isLunar,
        });
      } else {
        user = await api.createUser({
          name: name.trim(),
          gender,
          birthYear: year,
          birthMonth: month,
          birthDay: day,
          birthHour: hour,
          birthPlace: place,
          isLunar,
        });
      }
      setUser(user);
      setError('保存成功');
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      let user;
      if (existingUser) {
        user = await api.updateUser(existingUser.id, {
          name: name.trim(),
          gender,
          birthYear: year,
          birthMonth: month,
          birthDay: day,
          birthHour: hour,
          birthPlace: place,
          isLunar,
        });
      } else {
        user = await api.createUser({
          name: name.trim(),
          gender,
          birthYear: year,
          birthMonth: month,
          birthDay: day,
          birthHour: hour,
          birthPlace: place,
          isLunar,
        });
      }
      setUser(user);
      navigate('/bazi');
    } catch (e: any) {
      setError(e.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl text-ink-600 mb-2">生辰信息</h1>
        <p className="text-sm text-ink-400">填写准确信息，开启您的命理分析之旅</p>
      </div>

      {/* 步骤指示 */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full grid place-items-center text-sm font-medium transition-all ${
                step >= s
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-ink-50 shadow-ink'
                  : 'bg-ink-100 text-ink-400'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-10 h-0.5 ${step > s ? 'bg-teal-500' : 'bg-ink-100'}`} />}
          </div>
        ))}
      </div>

      <div className="card-paper p-6 md:p-8 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <SectionTitle icon={User} title="基本信息" desc="您的姓名与性别" />
            <div>
              <label className="block text-sm text-ink-500 mb-2">姓名</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 bg-ink-50 border-2 border-ink-100 focus:border-teal-400 focus:outline-none rounded-xl text-ink-600 transition-colors"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm text-ink-500 mb-2">性别</label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      gender === g
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-ink-100 text-ink-500 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-2xl">{g === 'male' ? '☯' : '☯'}</div>
                    <span className="text-sm font-medium">{g === 'male' ? '乾 · 男' : '坤 · 女'}</span>
                  </button>
                ))}
              </div>
            </div>
            {error && (
            <div className={`text-sm ${error === '保存成功' ? 'text-emerald-600' : 'text-cinnabar-500'}`}>
              {error}
            </div>
          )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <SectionTitle icon={Calendar} title="出生时间" desc="阳历或农历皆可" />
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLunar}
                  onChange={e => setIsLunar(e.target.checked)}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-ink-500">使用农历</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-ink-400 mb-1">年</label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  min={1900}
                  max={2100}
                  className="w-full px-3 py-2.5 bg-ink-50 border border-ink-100 focus:border-teal-400 focus:outline-none rounded-lg text-ink-600"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">月</label>
                <input
                  type="number"
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="w-full px-3 py-2.5 bg-ink-50 border border-ink-100 focus:border-teal-400 focus:outline-none rounded-lg text-ink-600"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-400 mb-1">日</label>
                <input
                  type="number"
                  value={day}
                  onChange={e => setDay(Number(e.target.value))}
                  min={1}
                  max={31}
                  className="w-full px-3 py-2.5 bg-ink-50 border border-ink-100 focus:border-teal-400 focus:outline-none rounded-lg text-ink-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-ink-500 mb-2">出生时辰</label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, h) => (
                  <button
                    key={h}
                    onClick={() => setHour(h)}
                    className={`py-2 px-1 text-xs rounded-lg border transition-all ${
                      hour === h
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-ink-100 text-ink-500 hover:border-amber-300'
                    }`}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-2">
                当前选择：{String(hour).padStart(2, '0')}:00 - {HOUR_RANGE[hour] || ''}
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <SectionTitle icon={MapPin} title="出生地点" desc="用于参考地域五行" />
            <div>
              <label className="block text-sm text-ink-500 mb-2">城市</label>
              <div className="grid grid-cols-4 gap-2">
                {places.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setPlace(p.value)}
                    className={`py-2.5 px-2 text-sm rounded-lg border transition-all ${
                      place === p.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-ink-100 text-ink-500 hover:border-amber-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5 text-sm">
              <h4 className="font-medium text-ink-600 mb-2">信息确认</h4>
              <Row label="姓名" value={name} />
              <Row label="性别" value={gender === 'male' ? '男' : '女'} />
              <Row label="出生" value={`${year}年${month}月${day}日 ${String(hour).padStart(2, '0')}:00`} />
              <Row label="历法" value={isLunar ? '农历' : '阳历'} />
              <Row label="地点" value={place} />
            </div>
            {error && (
            <div className={`text-sm ${error === '保存成功' ? 'text-emerald-600' : 'text-cinnabar-500'}`}>
              {error}
            </div>
          )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-ink-100">
          <button
            onClick={handleBack}
            className="px-5 py-2.5 text-ink-500 hover:text-teal-600 flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? '返回' : '上一步'}
          </button>
          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary flex items-center gap-1.5">
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-5 py-2.5 border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-xl font-medium flex items-center gap-1.5 disabled:opacity-50 transition-all"
              >
                {submitting ? '保存中...' : '保存信息'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? '保存中...' : '开启命理之旅'}
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/15 to-amber-500/15 grid place-items-center">
        <Icon className="w-5 h-5 text-teal-600" />
      </div>
      <div>
        <h2 className="font-display text-xl text-ink-600">{title}</h2>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center text-sm">
      <span className="w-16 text-ink-400">{label}</span>
      <span className="text-ink-600">{value}</span>
    </div>
  );
}
