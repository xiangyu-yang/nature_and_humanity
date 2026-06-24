import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, AlertCircle, Sun, Moon, Activity, Brain, Calendar } from 'lucide-react';
import { api, type WellnessResult } from '@/api/client';
import { useUserStore } from '@/stores/userStore';

const TABS = [
  { key: 'daily', label: '起居', icon: Sun },
  { key: 'sport', label: '运动', icon: Activity },
  { key: 'emotion', label: '情志', icon: Brain },
  { key: 'seasonal', label: '节气', icon: Calendar },
] as const;

type TabKey = typeof TABS[number]['key'];

const PRIORITY_COLORS: Record<string, string> = {
  high: 'border-l-cinnabar-400 bg-cinnabar-50/30',
  medium: 'border-l-amber-400 bg-amber-50/30',
  low: 'border-l-emerald-400 bg-emerald-50/30',
};

export function WellnessPage() {
  const user = useUserStore(s => s.user);
  const constitution = useUserStore(s => s.constitutionResult);
  const [data, setData] = useState<WellnessResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('daily');

  useEffect(() => {
    api.getWellness({
      constitution: constitution?.primaryType,
      dayMasterWuxing: undefined,
    }).then(d => {
      setData(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [constitution?.primaryType]);

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">加载中...</div>;
  }
  if (!data) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-ink-300 mx-auto mb-3" />
        <p className="text-ink-500">养生建议加载失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">养生建议</h1>
        <p className="text-sm text-ink-400">
          {user?.name} · 体质：<span className="text-teal-600 font-medium">{constitution?.primaryType || '未测'}</span>
        </p>
      </div>

      {/* 标签页 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.key
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-ink-50 shadow-ink'
                : 'bg-white/60 text-ink-500 hover:bg-amber-50/60'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'daily' && <DailyTab data={data} />}
      {tab === 'sport' && <SportTab data={data} />}
      {tab === 'emotion' && <EmotionTab data={data} />}
      {tab === 'seasonal' && <SeasonalTab data={data} />}

      <div className="card-paper p-5 bg-gradient-to-br from-cinnabar-50/30 to-amber-50/30 flex items-center gap-4">
        <Heart className="w-8 h-8 text-cinnabar-500 shrink-0" />
        <div className="flex-1">
          <div className="font-medium text-ink-600">上医治未病</div>
          <div className="text-xs text-ink-500 mt-0.5">养生之道，在于顺应四时，调和阴阳，恒持为要</div>
        </div>
      </div>
    </div>
  );
}

function DailyTab({ data }: { data: WellnessResult }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {data.daily.items.map((it, i) => (
        <div
          key={i}
          className={`card-paper p-4 border-l-4 ${PRIORITY_COLORS[it.priority] || PRIORITY_COLORS.medium}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{it.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-ink-600">{it.title}</h3>
                {it.priority === 'high' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-cinnabar-500 text-ink-50 rounded">重要</span>
                )}
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">{it.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SportTab({ data }: { data: WellnessResult }) {
  const sport = data.sport;
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card-paper p-6 bg-gradient-to-br from-emerald-50/40 to-amber-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h2 className="font-display text-xl text-ink-600">运动方案</h2>
        </div>
        <div className="text-center my-4">
          <div className="font-display text-2xl text-ink-600">{sport.type}</div>
          <div className="text-xs text-ink-400 mt-1">推荐运动类型</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <InfoCard label="强度" value={sport.intensity} />
          <InfoCard label="频率" value={sport.frequency} />
          <InfoCard label="时长" value={sport.duration} />
          <InfoCard label="最佳时段" value={sport.bestTime} />
          <InfoCard label="注意" value={sport.note} wide />
        </div>
      </div>

      <div className="card-paper p-5">
        <h3 className="font-medium text-ink-600 mb-3">🌅 四季运动要点</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { season: '春', principle: '广步于庭，被发缓行', desc: '舒展筋骨，助阳气生发' },
            { season: '夏', principle: '无厌于日，使气得泄', desc: '适度出汗，忌大汗淋漓' },
            { season: '秋', principle: '收敛神气，使秋气平', desc: '动静相宜，养肺润燥' },
            { season: '冬', principle: '去寒就温，无泄皮肤', desc: '早睡晚起，藏精养肾' },
          ].map(s => (
            <div key={s.season} className="rounded-lg border border-ink-100 p-3">
              <div className="font-display text-lg text-teal-600">{s.season}</div>
              <div className="text-ink-600 mt-1 leading-relaxed">{s.principle}</div>
              <div className="text-ink-400 mt-1.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-lg bg-white/70 p-3 ${wide ? 'col-span-2 md:col-span-3' : ''}`}>
      <div className="text-xs text-ink-400 mb-1">{label}</div>
      <div className="text-sm text-ink-600">{value}</div>
    </div>
  );
}

function EmotionTab({ data }: { data: WellnessResult }) {
  const e = data.emotion;
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card-paper p-6 bg-gradient-to-br from-purple-50/30 to-teal-50/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h2 className="font-display text-xl text-ink-600">情志调养</h2>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-4">
          <div className="text-xs text-amber-700 tracking-widest mb-1">总则</div>
          <p className="text-sm text-ink-600 leading-relaxed">{e.principle}</p>
        </div>
        <div className="space-y-2.5">
          <div className="text-sm font-medium text-ink-600 mb-2">调养方法</div>
          {e.method.map((m: string, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/60">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-teal-500 text-ink-50 grid place-items-center text-xs">
                {i + 1}
              </div>
              <span className="text-sm text-ink-600">{m}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-ink-100">
          <div className="text-xs text-purple-600 tracking-widest mb-1">贴心建议</div>
          <p className="text-sm text-ink-500 leading-relaxed">{e.tip}</p>
        </div>
      </div>

      <div className="card-paper p-5">
        <h3 className="font-medium text-ink-600 mb-3">五音疗心</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { note: '角', element: '木', organ: '肝', desc: '疏肝解郁', color: '#5A8E4A' },
            { note: '徵', element: '火', organ: '心', desc: '振奋心阳', color: '#C8553D' },
            { note: '宫', element: '土', organ: '脾', desc: '健脾和中', color: '#D4A84B' },
            { note: '商', element: '金', organ: '肺', desc: '养肺润燥', color: '#C9B87A' },
            { note: '羽', element: '水', organ: '肾', desc: '滋阴降火', color: '#3A6E7C' },
          ].map(s => (
            <div key={s.note} className="text-center p-3 rounded-lg" style={{ background: `${s.color}10` }}>
              <div className="font-display text-2xl" style={{ color: s.color }}>{s.note}</div>
              <div className="text-[10px] text-ink-500 mt-1">{s.element}·{s.organ}</div>
              <div className="text-[10px] text-ink-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SeasonalTab({ data }: { data: WellnessResult }) {
  const s = data.seasonal;
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card-paper-dark p-6 md:p-8 ornament-corner">
        <div className="flex items-center gap-2 text-amber-300 text-xs tracking-widest mb-2">
          <Calendar className="w-4 h-4" /> 当前节气
        </div>
        <div className="font-display text-4xl text-ink-50 mb-2">{s.term}</div>
        <div className="text-ink-100/80 text-sm mb-4">{s.season}季 · 主养{s.body} · {s.organs?.join('·')}</div>
        <div className="rounded-xl bg-ink-50/10 border border-ink-50/15 p-4 text-ink-50 text-base leading-relaxed">
          <span className="text-amber-300">养生原则：</span>{s.principle}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-paper p-5">
          <h3 className="font-medium text-ink-600 mb-3 flex items-center gap-2">
            <span>🍵</span> 宜食
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {s.foods?.map((f: string) => (
              <span key={f} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{f}</span>
            ))}
          </div>
        </div>
        <div className="card-paper p-5">
          <h3 className="font-medium text-ink-600 mb-3 flex items-center gap-2">
            <span>🚫</span> 慎食
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {s.avoid?.map((f: string) => (
              <span key={f} className="text-xs px-2 py-1 bg-cinnabar-50 text-cinnabar-600 rounded">{f}</span>
            ))}
          </div>
        </div>
        <div className="card-paper p-5">
          <h3 className="font-medium text-ink-600 mb-3 flex items-center gap-2">
            <span>💆</span> 穴位
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {s.acupoints?.map((a: string) => (
              <Link key={a} to="/acupoint" className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded hover:bg-amber-100">
                {a}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="card-paper p-5">
        <h3 className="font-medium text-ink-600 mb-3">健康提示</h3>
        <p className="text-sm text-ink-500 leading-relaxed">{s.health}</p>
      </div>
    </div>
  );
}
