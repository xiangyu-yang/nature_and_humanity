import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { api, type ZiweiResult } from '@/api/client';
import { useUserStore } from '@/stores/userStore';

const PALACE_NAMES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '奴仆', '官禄', '田宅', '福德', '父母'];

export function ZiweiPage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const [ziwei, setZiwei] = useState<ZiweiResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/birth');
      return;
    }
    api.calcZiwei({
      year: user.birthYear,
      month: user.birthMonth,
      day: user.birthDay,
      hour: user.birthHour,
      gender: user.gender,
      isLunar: user.isLunar,
    }).then(d => {
      setZiwei(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">推演中...</div>;
  }
  if (!ziwei) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-ink-300 mx-auto mb-3" />
        <p className="text-ink-500">紫微推演失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">紫微星盘</h1>
        <p className="text-sm text-ink-400">{user?.name} · {ziwei.wuxingJuJu} · {ziwei.juNumber}局</p>
      </div>

      {/* 命盘主体 */}
      <section className="card-paper p-6 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 命盘图 */}
          <div className="lg:col-span-2">
            <ZiweiChart ziwei={ziwei} />
          </div>

          {/* 命宫信息 */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-5 text-ink-50">
              <div className="text-xs text-amber-300 tracking-widest mb-2">命宫</div>
              <div className="font-display text-2xl mb-3">
                {ziwei.lifePalace.earthlyBranch}宫 · {ziwei.lifePalace.heavenlyStem}{ziwei.lifePalace.earthlyBranch}
              </div>
              <div className="space-y-1.5">
                {ziwei.lifePalace.majorStars.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    <span className="text-amber-200 font-medium">{s.name}</span>
                    <span className="text-ink-100/60 text-xs ml-auto">{s.brightness}</span>
                  </div>
                ))}
                {ziwei.lifePalace.minorStars.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-ink-50/20">
                    {ziwei.lifePalace.minorStars.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 bg-ink-50/10 rounded">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-amber-300/40 bg-amber-50/50 p-5">
              <div className="text-xs text-amber-700 tracking-widest mb-2">身宫</div>
              <div className="font-display text-lg text-ink-600">
                {ziwei.bodyPalace.earthlyBranch}宫 · {ziwei.bodyPalace.name}
              </div>
              <div className="text-xs text-ink-500 mt-2">
                身宫主后天努力方向，代表中年后倾向
              </div>
            </div>

            <div className="card-paper p-4">
              <h3 className="text-sm font-medium text-ink-600 mb-2">命盘总论</h3>
              <p className="text-xs text-ink-500 leading-relaxed">{ziwei.summary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 十二宫位详情 */}
      <section>
        <h2 className="font-display text-xl text-ink-600 mb-4">十二宫位</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ziwei.palaces.map(p => (
            <PalaceCard key={p.index} palace={p} />
          ))}
        </div>
      </section>

      <section className="card-paper p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center">
          <Sparkles className="w-5 h-5 text-ink-50" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-ink-600">查看综合报告</div>
          <div className="text-xs text-ink-400">结合八字与紫微，三维分析</div>
        </div>
        <Link to="/report" className="btn-secondary flex items-center gap-1.5 text-sm py-2">
          前往 <ChevronRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

function ZiweiChart({ ziwei }: { ziwei: ZiweiResult }) {
  // 简化的命盘方格图：4x4 布局，4个角是固定位置（巳、酉、丑、卯），中间是命宫
  // 完整紫微盘为正方形十二宫，我们使用简化版
  const renderCell = (key: string, label: string, palaces: number[]) => (
    <div key={key} className="rounded-lg border border-ink-100 p-2 bg-white/40 min-h-[80px]">
      <div className="text-[10px] text-ink-400 tracking-widest mb-1">{label}</div>
      {palaces.map(idx => {
        const p = ziwei.palaces[idx];
        if (!p) return null;
        return (
          <div key={idx} className={`text-[11px] leading-tight ${p.isMingGong ? 'text-teal-600 font-medium' : 'text-ink-500'}`}>
            {p.earthlyBranch}·{p.name}
            {p.majorStars.slice(0, 2).map(s => (
              <span key={s.name} className="ml-1 text-amber-600">{s.name}</span>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="rounded-2xl bg-gradient-to-br from-ink-50 to-amber-50/30 p-4">
      <div className="text-center mb-3 text-xs text-ink-400 tracking-widest">紫微十二宫方阵图</div>
      <div className="grid grid-cols-4 gap-1.5 text-xs">
        {renderCell('tl', '巳', [10, 9, 8])}
        {renderCell('tm', '午', [11])}
        {renderCell('tr', '未', [0, 1, 2])}
        {renderCell('ml', '辰', [9])}
        <div className="grid place-items-center bg-gradient-to-br from-teal-500 to-teal-700 text-ink-50 rounded-lg">
          <div className="text-center">
            <div className="text-[10px] text-amber-300">命宫</div>
            <div className="font-display text-2xl my-1">{ziwei.lifePalace.earthlyBranch}</div>
            <div className="text-[10px] text-ink-50/80">{ziwei.wuxingJuJu}</div>
          </div>
        </div>
        {renderCell('mr', '申', [0])}
        {renderCell('bl', '卯', [7, 6, 5])}
        {renderCell('bm', '寅', [4])}
        {renderCell('br', '丑', [3, 2, 1])}
      </div>
      <div className="mt-3 text-center text-[10px] text-ink-400">
        紫微居中，外围十二宫按地支环列
      </div>
    </div>
  );
}

function PalaceCard({ palace }: { palace: ZiweiResult['palaces'][number] }) {
  return (
    <div className={`card-paper p-4 ${palace.isMingGong ? 'ring-2 ring-teal-400' : ''} ${palace.isShenGong ? 'ring-2 ring-amber-400' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg text-ink-600">{palace.earthlyBranch}</span>
          <span className="text-sm text-ink-500">{palace.name}</span>
        </div>
        {palace.isMingGong && <span className="text-[10px] px-1.5 py-0.5 bg-teal-500 text-ink-50 rounded">命</span>}
        {palace.isShenGong && <span className="text-[10px] px-1.5 py-0.5 bg-amber-500 text-ink-50 rounded">身</span>}
      </div>
      <div className="text-[10px] text-ink-400 mb-2">{palace.meaning}</div>
      {palace.majorStars.length > 0 ? (
        <div className="space-y-1">
          {palace.majorStars.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              <span className="text-amber-700 font-medium">{s.name}</span>
              <span className="text-ink-400">· {s.trait}</span>
              <span className="ml-auto text-[10px] text-ink-300">{s.brightness}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-ink-400 italic">无主星，借对宫</div>
      )}
      {palace.minorStars.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-ink-100">
          {palace.minorStars.map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-ink-50 text-ink-500 rounded">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
