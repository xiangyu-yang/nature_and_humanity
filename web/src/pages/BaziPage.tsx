import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { api, type BaziResult } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { WUXING_COLOR } from '@/data/ganzhi';
import { WuxingIcon } from '@/components/Branding';

export function BaziPage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const [bazi, setBazi] = useState<BaziResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/birth');
      return;
    }
    api.calcBazi({
      year: user.birthYear,
      month: user.birthMonth,
      day: user.birthDay,
      hour: user.birthHour,
      gender: user.gender,
      isLunar: user.isLunar,
    }).then(d => {
      setBazi(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[400px]">
        <div className="text-ink-400 text-sm">排盘中...</div>
      </div>
    );
  }
  if (!bazi) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-ink-300 mx-auto mb-3" />
        <p className="text-ink-500">排盘失败，请重试</p>
        <Link to="/birth" className="btn-primary inline-flex mt-4">重新填写生辰</Link>
      </div>
    );
  }

  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.hourPillar];
  const labels = ['年柱', '月柱', '日柱', '时柱'];
  const subtitles = ['祖上·根', '父母·苗', '自己·花', '子女·果'];
  const wuxingList = ['木', '火', '土', '金', '水'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">八字排盘</h1>
        <p className="text-sm text-ink-400">{user?.name} · {user?.birthYear}年{user?.birthMonth}月{user?.birthDay}日 · 日主 {bazi.dayMaster}（{bazi.dayMasterWuxing}）</p>
      </div>

      {/* 四柱展示 */}
      <section className="card-paper p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {pillars.map((p, i) => {
            const ganWx = WUXING_COLOR[{'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'}[p.gan] || '土'];
            const zhiWx = WUXING_COLOR[{'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'}[p.zhi] || '土'];
            return (
              <div key={i} className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ink-100/40 to-amber-100/30 -z-10" />
                <div className="rounded-2xl border-2 border-ink-100 p-4 bg-white/60 hover:shadow-ink transition-all">
                  <div className="text-center text-xs text-ink-400 mb-3 tracking-widest">
                    {labels[i]}
                    <span className="text-[10px] text-ink-300 ml-1">· {subtitles[i]}</span>
                  </div>
                  <div
                    className="rounded-xl py-4 text-center text-3xl font-display tracking-wider"
                    style={{ color: ganWx, background: `${ganWx}10` }}
                  >
                    {p.gan}
                  </div>
                  <div
                    className="rounded-xl py-4 mt-2 text-center text-3xl font-display tracking-wider"
                    style={{ color: zhiWx, background: `${zhiWx}10` }}
                  >
                    {p.zhi}
                  </div>
                  <div className="mt-3 space-y-0.5 text-center text-[10px] text-ink-400">
                    {p.canggan.map((cg, j) => (
                      <div key={j} className="opacity-70">藏：{cg}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center text-sm text-ink-500 leading-relaxed">
          <p>纳音：{bazi.nayin.year} · {bazi.nayin.month} · {bazi.nayin.day} · {bazi.nayin.hour}</p>
        </div>
      </section>

      {/* 五行分析 */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card-paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-teal-600" />
            <h2 className="font-display text-xl text-ink-600">五行分布</h2>
          </div>
          <div className="space-y-3">
            {wuxingList.map(el => {
              const percent = bazi.wuxingPercent[el];
              const count = bazi.wuxingCount[el];
              const isMissing = bazi.wuxingMissing.includes(el);
              const isStrong = bazi.wuxingStrong.includes(el);
              return (
                <div key={el} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium flex items-center gap-1.5">
                    <WuxingIcon element={el} size={20} />
                    {el}
                  </div>
                  <div className="flex-1 h-7 bg-ink-50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all flex items-center justify-end px-2 text-xs text-ink-50 font-medium"
                      style={{
                        width: `${Math.max(percent, 5)}%`,
                        background: WUXING_COLOR[el],
                      }}
                    >
                      {percent}%
                    </div>
                  </div>
                  <div className="w-20 text-right text-xs">
                    {isMissing && <span className="text-cinnabar-500">缺失</span>}
                    {!isMissing && isStrong && <span className="text-amber-600">偏旺</span>}
                    {!isMissing && !isStrong && <span className="text-ink-400">{(count || 0).toFixed(1)}个</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-100 text-sm text-ink-500 leading-relaxed">
            {bazi.summary}
          </div>
        </div>

        <div className="card-paper p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h2 className="font-display text-xl text-ink-600">十神配置</h2>
          </div>
          <div className="space-y-2">
            {(['year', 'month', 'hour'] as const).map((pos, i) => {
              const shishen = bazi.shishen[pos];
              const desc = bazi.shishenDesc[shishen] || '';
              return (
                <div key={pos} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-ink-50/60 transition-colors">
                  <div className="w-12 text-xs text-ink-400">{labels[i]}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-teal-600">{shishen}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            to="/report"
            className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between text-sm text-teal-600 hover:text-teal-700"
          >
            <span>查看综合分析报告</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 大运 */}
      <section className="card-paper p-6">
        <h2 className="font-display text-xl text-ink-600 mb-4">大运流转</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {bazi.dayun.map(dy => (
              <div
                key={dy.sequence}
                className="w-16 shrink-0 rounded-xl border border-ink-100 bg-white/60 p-2 text-center"
              >
                <div className="text-[10px] text-ink-400">{dy.startAge}岁</div>
                <div className="font-display text-lg text-ink-600 mt-1">{dy.gan}</div>
                <div className="font-display text-lg text-ink-600">{dy.zhi}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-400 mt-3">大运每十年一转，顺逆依年干阴阳与性别而定</p>
      </section>

      {/* 行动建议 */}
      <section className="grid md:grid-cols-2 gap-4">
        <Link to="/ziwei" className="card-paper p-5 hover:shadow-ink-lg transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cinnabar-400 to-cinnabar-600 grid place-items-center">
            <Sparkles className="w-6 h-6 text-ink-50" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-ink-600">紫微星盘</div>
            <div className="text-xs text-ink-400 mt-0.5">查看十二宫位命盘</div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link to="/report" className="card-paper p-5 hover:shadow-ink-lg transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center">
            <Compass className="w-6 h-6 text-ink-50" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-ink-600">综合报告</div>
            <div className="text-xs text-ink-400 mt-0.5">八字 × 紫微 × 体质</div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </section>
    </div>
  );
}
