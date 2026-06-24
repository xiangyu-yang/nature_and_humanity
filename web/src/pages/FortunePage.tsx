import { useEffect, useState } from 'react';
import { Compass, AlertCircle, Sparkles, Compass as CompassIcon } from 'lucide-react';
import { api, type DailyFortune } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { WUXING_COLOR } from '@/data/ganzhi';
import { WuxingIcon } from '@/components/Branding';

export function FortunePage() {
  const user = useUserStore(s => s.user);
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTodayFortune(user?.id).then(d => {
      setFortune(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">推算今日运势...</div>;
  }
  if (!fortune) {
    return <div className="text-center py-20 text-ink-500">运势数据加载失败</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">今日运势</h1>
        <p className="text-sm text-ink-400">{fortune.date} · 干支 {fortune.dayPillar.gan}{fortune.dayPillar.zhi}日</p>
      </div>

      {/* 综合运势 */}
      <section className="card-paper-dark p-6 md:p-8 ornament-corner">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              今日综合运势
            </div>
            <div className="flex items-baseline gap-3 mb-3">
              <div className="font-display text-7xl text-ink-50">{fortune.overall}</div>
              <div className="text-ink-100/70">/ 100</div>
            </div>
            <p className="text-ink-100/85 text-sm leading-relaxed">{fortune.description}</p>
            <p className="text-ink-100/70 text-xs mt-3 italic">「 {fortune.mantra} 」</p>
          </div>
          <div className="space-y-3">
            <BarRow label="事业" value={fortune.career} color="#5A8E4A" />
            <BarRow label="财运" value={fortune.wealth} color="#D4A84B" />
            <BarRow label="感情" value={fortune.love} color="#C8553D" />
            <BarRow label="健康" value={fortune.health} color="#3A6E7C" />
          </div>
        </div>
      </section>

      {/* 宜忌 */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="card-paper p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-ink-50 grid place-items-center font-display">宜</div>
            <h2 className="font-display text-lg text-ink-600">今日宜做</h2>
          </div>
          <div className="space-y-1.5">
            {fortune.yi.map((y, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-600 py-1.5 px-2 rounded-lg hover:bg-emerald-50/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {y}
              </div>
            ))}
          </div>
        </div>
        <div className="card-paper p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-cinnabar-500 text-ink-50 grid place-items-center font-display">忌</div>
            <h2 className="font-display text-lg text-ink-600">今日忌做</h2>
          </div>
          <div className="space-y-1.5">
            {fortune.ji.map((j, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-600 py-1.5 px-2 rounded-lg hover:bg-cinnabar-50/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cinnabar-500" />
                {j}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 幸运指引 */}
      <section className="card-paper p-6">
        <div className="flex items-center gap-2 mb-4">
          <CompassIcon className="w-5 h-5 text-amber-600" />
          <h2 className="font-display text-xl text-ink-600">幸运指引</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LuckyCard label="幸运色" value={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-ink" style={{ background: fortune.lucky.colorHex }} />
              <span>{fortune.lucky.color}</span>
            </div>
          } />
          <LuckyCard label="幸运数字" value={
            <div className="flex gap-1">
              {fortune.lucky.number.map(n => (
                <span key={n} className="font-display text-2xl text-amber-600">{n}</span>
              ))}
            </div>
          } />
          <LuckyCard label="吉方" value={
            <div className="flex items-center gap-2 text-teal-600">
              <Compass className="w-4 h-4" />
              {fortune.lucky.direction}
            </div>
          } />
          <LuckyCard label="吉时" value={
            <div className="text-cinnabar-500 text-sm font-medium">{fortune.lucky.time}</div>
          } />
        </div>
      </section>

      {/* 今日五行 */}
      <section className="card-paper p-6">
        <div className="flex items-center gap-2 mb-3">
          <WuxingIcon element={fortune.wuxing} size={28} />
          <h2 className="font-display text-lg text-ink-600">今日五行 · {fortune.wuxing}</h2>
        </div>
        <p className="text-sm text-ink-500 leading-relaxed">{fortune.advice}</p>
      </section>
    </div>
  );
}

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-ink-100/80 mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-2 bg-ink-50/15 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function LuckyCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 p-4 bg-white/60">
      <div className="text-xs text-ink-400 tracking-widest mb-2">{label}</div>
      <div className="text-ink-600">{value}</div>
    </div>
  );
}
