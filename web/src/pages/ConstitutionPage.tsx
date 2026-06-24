import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, ChevronRight, ChevronLeft, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { api, type Question, type ConstitutionResult, type ConstitutionTypeInfo } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { WUXING_COLOR } from '@/data/ganzhi';

const CONSTITUTION_COLORS: Record<string, string> = {
  平和质: '#D4A84B',
  气虚质: '#A8902F',
  阳虚质: '#3A6E7C',
  阴虚质: '#C8553D',
  痰湿质: '#967724',
  湿热质: '#A6412C',
  血瘀质: '#745C1A',
  气郁质: '#5A8E4A',
  特禀质: '#C9B87A',
};

export function ConstitutionPage() {
  const navigate = useNavigate();
  const setConstitution = useUserStore(s => s.setConstitution);
  const stored = useUserStore(s => s.constitutionResult);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [types, setTypes] = useState<ConstitutionTypeInfo[]>([]);
  const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ConstitutionResult | null>(null);
  const [primaryInfo, setPrimaryInfo] = useState<ConstitutionTypeInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getConstitutionQuestions().then(setQuestions);
    api.getConstitutionTypes().then(setTypes);
  }, []);

  const startTest = () => {
    setStep('test');
    setCurrentIdx(0);
    setAnswers({});
  };

  const handleAnswer = (value: number) => {
    if (!questions[currentIdx]) return;
    const newAnswers = { ...answers, [questions[currentIdx].id]: value };
    setAnswers(newAnswers);
    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx(currentIdx + 1), 200);
    } else {
      setTimeout(() => submitTest(newAnswers), 200);
    }
  };

  const submitTest = async (finalAnswers: Record<number, number>) => {
    setSubmitting(true);
    try {
      const r = await api.evaluateConstitution(
        Object.fromEntries(Object.entries(finalAnswers).map(([k, v]) => [k, v]))
      );
      setResult(r);
      const primary = types.find(t => t.type === r.primaryType);
      setPrimaryInfo(primary || null);
      setConstitution({ primaryType: r.primaryType, secondaryType: r.secondaryType });
      setStep('result');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">中医体质测评</h1>
        <p className="text-sm text-ink-400">王琦教授九种体质辨识 · 标准化问卷</p>
      </div>

      {step === 'intro' && (
        <div className="card-paper p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 grid place-items-center">
              <Stethoscope className="w-10 h-10 text-ink-50" />
            </div>
            <h2 className="font-display text-2xl text-ink-600 mb-2">开启体质探索</h2>
            <p className="text-ink-500 text-sm leading-relaxed">
              通过{questions.length || 60}道标准化题目，辨识您的中医体质类型<br />
              为后续养生、食疗、穴位提供个性化依据
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {[
              { icon: '🩺', title: '科学权威', desc: '依据中华中医药学会标准' },
              { icon: '🌿', title: '个性定制', desc: '九种体质精准辨识' },
              { icon: '⏱', title: '3-5分钟', desc: '完成全部问卷' },
            ].map((c, i) => (
              <div key={i} className="rounded-xl border border-ink-100 p-4 text-center">
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className="text-sm font-medium text-ink-600">{c.title}</div>
                <div className="text-xs text-ink-400 mt-0.5">{c.desc}</div>
              </div>
            ))}
          </div>

          {stored && (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1 text-sm text-ink-600">
                您已测过：<span className="font-medium">{stored.primaryType}</span>
                {stored.secondaryType && `（倾向 ${stored.secondaryType}）`}
              </div>
            </div>
          )}

          <div className="text-center">
            <button onClick={startTest} className="btn-primary text-base px-8 py-3.5">
              {stored ? '重新测评' : '开始测评'}
            </button>
          </div>
        </div>
      )}

      {step === 'test' && questions[currentIdx] && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-ink-500 mb-2">
              <span>第 {currentIdx + 1} 题 / 共 {questions.length} 题</span>
              <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="card-paper p-6 md:p-8 min-h-[400px]">
            <div className="text-center mb-8">
              <div className="text-xs text-teal-600 tracking-widest mb-3">— {questions[currentIdx].type} —</div>
              <h2 className="font-display text-xl md:text-2xl text-ink-600 leading-relaxed">
                {questions[currentIdx].text}
              </h2>
            </div>

            <div className="space-y-2.5 max-w-md mx-auto">
              {questions[currentIdx].options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full py-3.5 px-4 text-left rounded-xl border-2 border-ink-100 hover:border-teal-400 hover:bg-teal-50/50 transition-all flex items-center gap-3 group"
                >
                  <span className="w-7 h-7 rounded-full border-2 border-ink-200 group-hover:border-teal-500 group-hover:bg-teal-500 group-hover:text-ink-50 grid place-items-center text-xs">
                    {opt.value}
                  </span>
                  <span className="text-ink-600">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="btn-ghost flex items-center gap-1 text-sm disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> 上一题
              </button>
              <div className="text-xs text-ink-400">
                已完成 {Object.keys(answers).length} 题
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && result && primaryInfo && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* 结果概览 */}
          <div className="card-paper p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="text-sm text-ink-400 tracking-widest mb-2">您的中医体质</div>
              <div
                className="inline-block px-8 py-3 rounded-2xl font-display text-3xl text-ink-50 shadow-ink"
                style={{ background: CONSTITUTION_COLORS[result.primaryType] || '#D4A84B' }}
              >
                {result.primaryType}
              </div>
              {result.secondaryType && (
                <div className="mt-3 text-sm text-ink-500">
                  兼夹倾向：<span className="font-medium text-ink-600">{result.secondaryType}</span>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-ink-50 p-5">
              <h3 className="text-sm font-medium text-ink-600 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                体质特征
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed">{primaryInfo.features}</p>
              <h3 className="text-sm font-medium text-ink-600 mt-4 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                易感倾向
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed">{primaryInfo.tendency}</p>
            </div>
          </div>

          {/* 体质评分 */}
          <div className="card-paper p-6">
            <h2 className="font-display text-lg text-ink-600 mb-4">九种体质得分</h2>
            <div className="space-y-2.5">
              {result.ranking.map(r => {
                const color = CONSTITUTION_COLORS[r.type] || '#D4A84B';
                return (
                  <div key={r.type} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-ink-500">{r.type}</div>
                    <div className="flex-1 h-5 bg-ink-50 rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all flex items-center justify-end px-2 text-[10px] text-ink-50 font-medium"
                        style={{ width: `${Math.max(r.score, 3)}%`, background: color }}
                      >
                        {r.score}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-ink-400 mt-3">得分越高，越倾向该体质（≥40为倾向，≥60为明显）</p>
          </div>

          {/* 调理建议 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-paper p-5">
              <h3 className="font-display text-base text-ink-600 mb-3">🍵 食疗方案</h3>
              <div className="space-y-2.5">
                <div>
                  <div className="text-xs text-ink-400 mb-1.5">宜食</div>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryInfo.food.map(f => (
                      <span key={f} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-ink-400 mb-1.5">忌口</div>
                  <div className="flex flex-wrap gap-1.5">
                    {primaryInfo.avoid.map(f => (
                      <span key={f} className="text-xs px-2 py-1 bg-cinnabar-50 text-cinnabar-600 rounded">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-paper p-5">
              <h3 className="font-display text-base text-ink-600 mb-3">🌿 调理建议</h3>
              <ul className="space-y-1.5 text-sm text-ink-600">
                {primaryInfo.advice.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-ink-100">
                <div className="text-xs text-ink-400 mb-1.5">推荐穴位</div>
                <div className="flex flex-wrap gap-1.5">
                  {primaryInfo.acupoints.map(a => (
                    <span key={a} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="grid md:grid-cols-3 gap-3">
            <button onClick={startTest} className="card-paper p-4 hover:shadow-ink-lg transition-all flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-teal-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-ink-600">重新测评</div>
                <div className="text-xs text-ink-400">更新体质数据</div>
              </div>
            </button>
            <Link to="/wellness" className="card-paper p-4 hover:shadow-ink-lg transition-all flex items-center gap-3">
              <span className="w-5 h-5 text-lg">🌿</span>
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-ink-600">养生建议</div>
                <div className="text-xs text-ink-400">起居·运动·情志</div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-300" />
            </Link>
            <Link to="/report" className="card-paper p-4 hover:shadow-ink-lg transition-all flex items-center gap-3 bg-gradient-to-br from-teal-50 to-amber-50">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-ink-600">综合报告</div>
                <div className="text-xs text-ink-400">三维分析</div>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-300" />
            </Link>
          </div>
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 bg-ink-600/30 backdrop-blur-sm grid place-items-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-ink-xl text-center">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-ink-600">分析您的体质...</p>
          </div>
        </div>
      )}
    </div>
  );
}
