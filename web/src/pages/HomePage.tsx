import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Calendar, BookOpen, Sparkles, Stethoscope, FileText,
  Heart, Compass, Apple, Activity, Users, Settings,
  ChevronRight, Sun, Moon,
} from 'lucide-react';
import { api, type DailyFortune } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { formatDate, getScoreColor } from '@/utils';
import { TaijiLogo, BaguaWheel } from '@/components/Branding';

const quickEntries = [
  { path: '/birth', label: '生辰信息', icon: Calendar, desc: '开启命理之旅', color: 'from-teal-500 to-teal-700' },
  { path: '/bazi', label: '八字排盘', icon: BookOpen, desc: '天干地支·五行', color: 'from-amber-500 to-amber-600' },
  { path: '/ziwei', label: '紫微星盘', icon: Sparkles, desc: '十二宫位·星曜', color: 'from-cinnabar-400 to-cinnabar-600' },
  { path: '/constitution', label: '体质测评', icon: Stethoscope, desc: '九种体质辨识', color: 'from-emerald-500 to-emerald-700' },
  { path: '/report', label: '综合报告', icon: FileText, desc: '多维健康画像', color: 'from-purple-500 to-purple-700' },
  { path: '/wellness', label: '养生建议', icon: Heart, desc: '起居·运动·情志', color: 'from-rose-400 to-rose-600' },
  { path: '/fortune', label: '今日运势', icon: Compass, desc: '每日宜忌·吉方', color: 'from-amber-400 to-amber-600' },
  { path: '/food', label: '食疗推荐', icon: Apple, desc: '体质食疗·节气', color: 'from-red-400 to-red-600' },
];

const newsArticles = [
  { title: '小满时节：清热利湿，养心健脾', summary: '小满者，物至于此小得盈满。中医认为此时阳气始盛，湿热渐起，宜食苦清热...', tag: '节气养生', date: '05-21' },
  { title: '九种体质辨识：你是哪一种？', summary: '中医将人体分为九种体质：平和、气虚、阳虚、阴虚、痰湿、湿热、血瘀、气郁、特禀...', tag: '体质知识', date: '05-18' },
  { title: '足三里：万能的保健要穴', summary: '足三里穴是足阳明胃经的合穴，被誉为"长寿第一穴"，能健脾和胃、扶正培元...', tag: '穴位保健', date: '05-15' },
  { title: '五行与五脏：古老智慧的现代解读', summary: '木火土金水对应肝心脾肺肾，五行相生相克，维系着人体的动态平衡...', tag: '中医理论', date: '05-12' },
];

export function HomePage() {
  const user = useUserStore(s => s.user);
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTodayFortune(user?.id).then(d => {
      setFortune(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {/* Hero 欢迎区 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-ink-50 p-8 md:p-12 shadow-ink-lg">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cinnabar-400/30 blur-3xl" />
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <BaguaWheel size={300} />
        </div>
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-sm mb-3">
              <Sun className="w-4 h-4" />
              <span className="tracking-widest">{formatDate(new Date(), 'YYYY年MM月DD日')}</span>
              <Moon className="w-4 h-4 ml-2" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              {user ? `${user.name}，欢迎` : '欢迎'}<br />
              <span className="text-amber-300">开启命理之旅</span>
            </h1>
            <p className="text-ink-100/80 leading-relaxed mb-6 max-w-md text-balance">
              融合八字、紫微、中医体质三维分析<br />
              以天人合一之道，探寻健康与生命的密码
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/birth" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-ink-700 rounded-xl font-medium transition-all hover:-translate-y-0.5 shadow-ink">
                <Calendar className="w-4 h-4" />
                {user ? '更新生辰' : '填写生辰'}
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/constitution" className="inline-flex items-center gap-2 px-6 py-3 bg-ink-50/10 hover:bg-ink-50/20 text-ink-50 border border-ink-50/30 rounded-xl font-medium transition-all">
                开始体质测评
              </Link>
            </div>
          </div>
          {fortune && !loading && (
            <div className="relative">
              <div className="bg-ink-50/10 backdrop-blur-md rounded-2xl p-6 border border-ink-50/20">
                <div className="text-xs text-amber-300 tracking-widest mb-2">今日运势</div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(245,241,232,0.2)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="#D4A84B" strokeWidth="8"
                        strokeDasharray={`${(fortune.overall / 100) * 264} 264`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-center">
                        <div className="text-2xl font-display">{fortune.overall}</div>
                        <div className="text-[10px] text-ink-100/60">综合分</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Row label="事业" value={fortune.career} />
                    <Row label="财运" value={fortune.wealth} />
                    <Row label="感情" value={fortune.love} />
                    <Row label="健康" value={fortune.health} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-ink-50/20 flex items-center gap-4 text-xs">
                  <div>
                    <div className="text-ink-100/60">幸运色</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-3 h-3 rounded-full" style={{ background: fortune.lucky.colorHex }} />
                      <span className="text-ink-50">{fortune.lucky.color}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-ink-100/60">吉方</div>
                    <div className="text-ink-50 mt-1">{fortune.lucky.direction}</div>
                  </div>
                  <div className="ml-auto">
                    <Link to="/fortune" className="text-amber-300 hover:text-amber-200 text-xs">查看详情 →</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 快捷功能 */}
      <section>
        <SectionTitle title="快捷功能" subtitle="十二模块 · 全维养生" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {quickEntries.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="group relative card-paper p-5 hover:-translate-y-1 hover:shadow-ink-lg transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`} />
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center shadow-ink mb-3`}>
                <item.icon className="w-5 h-5 text-ink-50" />
              </div>
              <h3 className="font-medium text-ink-600">{item.label}</h3>
              <p className="text-xs text-ink-400 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 养生资讯 */}
      <section>
        <SectionTitle title="养生资讯" subtitle="节气 · 体质 · 穴位" link="/wellness" linkText="更多内容" />
        <div className="grid md:grid-cols-2 gap-4">
          {newsArticles.map((article, idx) => (
            <article
              key={idx}
              className="card-paper p-5 flex gap-4 hover:shadow-ink-lg transition-shadow"
            >
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-100 to-amber-100 grid place-items-center shrink-0">
                <TaijiLogo size={48} className="opacity-70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{article.tag}</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-medium text-ink-600 line-clamp-1 mb-1.5">{article.title}</h3>
                <p className="text-sm text-ink-400 line-clamp-2 leading-relaxed">{article.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 五行理念 */}
      <section className="card-paper p-8 ornament-corner">
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-ink-600 mb-2">五行 · 天人合一</h2>
          <p className="text-sm text-ink-400 tracking-widest">木 火 土 金 水 · 五脏六腑 · 调和致中</p>
        </div>
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {['木', '火', '土', '金', '水'].map((el, i) => {
            const colors: Record<string, string> = {
              木: '#5A8E4A', 火: '#C8553D', 土: '#D4A84B', 金: '#C9B87A', 水: '#3A6E7C',
            };
            const organs: Record<string, string> = {
              木: '肝胆', 火: '心小肠', 土: '脾胃', 金: '肺大肠', 水: '肾膀胱',
            };
            const seasons: Record<string, string> = {
              木: '春', 火: '夏', 土: '长夏', 金: '秋', 水: '冬',
            };
            return (
              <div key={el} className="text-center group cursor-pointer">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full grid place-items-center font-display text-2xl md:text-3xl text-ink-50 shadow-ink group-hover:scale-110 transition-transform"
                  style={{ background: colors[el] }}
                >
                  {el}
                </div>
                <div className="text-xs text-ink-500 mt-2">{organs[el]}</div>
                <div className="text-[10px] text-ink-400 mt-0.5">{seasons[el]}季</div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-ink-400 mt-6 leading-relaxed">
          五行相生相克，维系着人体与自然的动态平衡<br />
          知五行，通脏腑，调阴阳，致中和
        </p>
      </section>
    </div>
  );
}

function SectionTitle({ title, subtitle, link, linkText }: { title: string; subtitle?: string; link?: string; linkText?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="font-display text-2xl text-ink-600">{title}</h2>
        {subtitle && <p className="text-xs text-ink-400 mt-1 tracking-widest">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
          {linkText || '查看更多'} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-ink-100/70">{label}</span>
      <div className="flex-1 h-1.5 bg-ink-50/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: value >= 75 ? '#5A8E4A' : value >= 60 ? '#D4A84B' : '#C8553D' }}
        />
      </div>
      <span className="w-6 text-right text-ink-50 font-mono">{value}</span>
    </div>
  );
}
