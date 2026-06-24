import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, AlertCircle, Sparkles, Activity, ShieldAlert, ChevronRight } from 'lucide-react';
import { api, type ReportResult } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { WUXING_COLOR } from '@/data/ganzhi';

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  medium: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  high: { bg: 'bg-cinnabar-50', text: 'text-cinnabar-600', border: 'border-cinnabar-200' },
};

export function ReportPage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const stored = useUserStore(s => s.constitutionResult);
  const [report, setReport] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/birth');
      return;
    }
    api.generateReport({
      birth: {
        year: user.birthYear,
        month: user.birthMonth,
        day: user.birthDay,
        hour: user.birthHour,
        gender: user.gender,
        isLunar: Boolean(user.isLunar),
      },
      constitution: stored?.primaryType || null,
    }).then(d => {
      setReport(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, stored, navigate]);

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">生成综合报告中...</div>;
  }
  if (!report) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-ink-300 mx-auto mb-3" />
        <p className="text-ink-500">报告生成失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">综合健康报告</h1>
        <p className="text-sm text-ink-400">{user?.name} · 八字 × 紫微 × 体质 · 三维交叉分析</p>
      </div>

      {/* 综合画像 */}
      <section className="card-paper-dark p-6 md:p-8 ornament-corner">
        <div className="flex items-center gap-2 text-amber-300 text-xs tracking-widest mb-3">
          <Sparkles className="w-4 h-4" /> 综合健康画像
        </div>
        <p className="text-ink-50 text-base md:text-lg leading-relaxed text-balance">
          {report.cross.overallPattern}
        </p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Metric label="八字日主" value={report.bazi.dayMaster} subValue={report.bazi.dayMasterWuxing} />
          <Metric label="紫微格局" value={report.ziwei.wuxingJuJu} subValue={`第${report.ziwei.juNumber}局`} />
          <Metric label="中医体质" value={report.constitution?.type || '未测'} subValue={report.constitution?.element} />
        </div>
      </section>

      {/* 五行平衡 */}
      <section className="card-paper p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="font-display text-xl text-ink-600">五行平衡诊断</h2>
          </div>
          <ScoreCircle score={report.balance.overallScore} label="平衡度" />
        </div>
        <p className="text-sm text-ink-500 leading-relaxed mb-4">{report.balance.diagnosis}</p>

        <div className="space-y-2">
          {(['木', '火', '土', '金', '水'] as const).map(el => {
            const value = report.balance.balance[el] || 0;
            return (
              <div key={el} className="flex items-center gap-3">
                <div className="w-10 text-sm font-medium">{el}</div>
                <div className="flex-1 h-6 bg-ink-50 rounded-md overflow-hidden">
                  <div
                    className="h-full flex items-center justify-end px-2 text-[10px] text-ink-50 font-medium"
                    style={{ width: `${Math.max(value, 4)}%`, background: WUXING_COLOR[el] }}
                  >
                    {value}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {report.balance.supplements.length > 0 && (
          <div className="mt-5 pt-5 border-t border-ink-100">
            <h3 className="text-sm font-medium text-ink-600 mb-3">补益方案</h3>
            <div className="space-y-3">
              {report.balance.supplements.map((s, i) => (
                <div key={i} className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                  <div className="text-sm font-medium text-emerald-700 mb-1.5">补{s.element}</div>
                  <div className="text-xs text-ink-500 leading-relaxed">{s.methods.join(' · ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.balance.cautions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-ink-600 mb-3">调理警示</h3>
            <div className="space-y-2">
              {report.balance.cautions.map((c, i) => (
                <div key={i} className="rounded-lg bg-cinnabar-50 border border-cinnabar-200 p-3 text-sm text-cinnabar-600">
                  ⚠ {c.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 三维交叉分析 */}
      <section className="grid md:grid-cols-3 gap-4">
        <AlignmentCard title="相合之处" icon="✨" items={report.cross.alignment.aligned} color="emerald" />
        <AlignmentCard title="相冲之处" icon="⚡" items={report.cross.alignment.conflict} color="cinnabar" />
        <AlignmentCard title="需补之处" icon="🌱" items={report.cross.alignment.supplement} color="amber" />
      </section>

      {/* 健康风险 */}
      <section className="card-paper p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-cinnabar-500" />
          <h2 className="font-display text-xl text-ink-600">健康风险预测</h2>
        </div>
        <p className="text-sm text-ink-500 leading-relaxed mb-4">{report.health.overallHealth}</p>

        {report.health.risks.length > 0 ? (
          <div className="space-y-3">
            {report.health.risks.map((r, i) => (
              <div key={i} className="rounded-xl border border-ink-100 p-4 bg-white/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg grid place-items-center font-display" style={{ background: WUXING_COLOR[r.element] + '20', color: WUXING_COLOR[r.element] }}>
                      {r.organ}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink-600">{r.organ}系统</div>
                      <div className="text-xs text-ink-400">{r.element}行</div>
                    </div>
                  </div>
                  <RiskBar level={r.riskLevel} />
                </div>
                <div className="text-xs text-ink-500 space-y-1">
                  <div><span className="text-ink-400">原因：</span>{r.reasons.join('；')}</div>
                  <div><span className="text-ink-400">建议：</span>{r.prevention.join('；')}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm text-emerald-700">
            🎉 您的身体状态良好，无明显健康风险
          </div>
        )}

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="text-sm font-medium text-amber-700 mb-1.5">📅 节气养生提醒</div>
          <p className="text-xs text-ink-600 leading-relaxed">{report.health.seasonalAdvice}</p>
        </div>
      </section>

      {/* 核心建议 */}
      <section className="card-paper p-6 bg-gradient-to-br from-amber-50/40 to-emerald-50/40">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="font-display text-xl text-ink-600">核心调理建议</h2>
        </div>
        <p className="text-base text-ink-600 leading-relaxed text-balance">{report.cross.coreRecommendation}</p>
      </section>

      {/* 行动入口 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ActionCard to="/wellness" icon="🌿" title="养生建议" desc="起居·运动·情志" />
        <ActionCard to="/food" icon="🍵" title="食疗推荐" desc="体质定制食谱" />
        <ActionCard to="/acupoint" icon="💆" title="穴位保健" desc="常用穴位按摩" />
        <ActionCard to="/fortune" icon="🧭" title="今日运势" desc="每日宜忌分析" />
      </section>
    </div>
  );
}

function Metric({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="rounded-xl bg-ink-50/10 p-3 border border-ink-50/10">
      <div className="text-[10px] text-amber-300/80 tracking-widest mb-1">{label}</div>
      <div className="text-ink-50 font-display text-xl">{value}</div>
      {subValue && <div className="text-ink-100/50 text-xs mt-0.5">{subValue}</div>}
    </div>
  );
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  return (
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#E8E0D0" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={score >= 80 ? '#5A8E4A' : score >= 60 ? '#D4A84B' : '#C8553D'}
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * 264} 264`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-base font-display text-ink-600">{score}</div>
          <div className="text-[9px] text-ink-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

function RiskBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-32 h-2 bg-ink-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${level}%`,
            background: level >= 70 ? '#C8553D' : level >= 50 ? '#D4A84B' : '#5A8E4A',
          }}
        />
      </div>
      <span className="text-xs text-ink-500 font-mono">{level}%</span>
    </div>
  );
}

function AlignmentCard({ title, icon, items, color }: { title: string; icon: string; items: string[]; color: 'emerald' | 'cinnabar' | 'amber' }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    cinnabar: 'bg-cinnabar-50 border-cinnabar-200 text-cinnabar-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };
  return (
    <div className="card-paper p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-medium text-ink-600">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2 text-xs text-ink-500">
          {items.map((it, i) => (
            <li key={i} className="leading-relaxed pl-3 border-l-2" style={{ borderColor: 'currentColor' }}>
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-ink-400 italic">无明显记录</div>
      )}
    </div>
  );
}

function ActionCard({ to, icon, title, desc }: { to: string; icon: string; title: string; desc: string }) {
  return (
    <Link to={to} className="card-paper p-4 hover:shadow-ink-lg hover:-translate-y-0.5 transition-all flex items-center gap-3 group">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink-600">{title}</div>
        <div className="text-xs text-ink-400 truncate">{desc}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
