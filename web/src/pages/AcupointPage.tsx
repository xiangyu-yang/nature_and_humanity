import { useEffect, useState } from 'react';
import { Activity, Search, AlertCircle, X } from 'lucide-react';
import { api, type Acupoint } from '@/api/client';

const CATEGORIES = [
  { key: 'all', label: '全部', icon: '🌐' },
  { key: 'head', label: '头部', icon: '🧠' },
  { key: 'body', label: '躯干', icon: '🫁' },
  { key: 'limbs', label: '四肢', icon: '🦵' },
];

export function AcupointPage() {
  const [data, setData] = useState<Acupoint[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Acupoint | null>(null);

  useEffect(() => {
    api.getAcupoints().then(d => {
      console.log('Acupoints data:', d);
      setData(d.data);
      setCategories(d.categories);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch acupoints:', err);
      setError('加载穴位数据失败，请刷新重试');
      setLoading(false);
    });
  }, []);

  const filtered = data.filter(a => {
    if (activeCat !== 'all' && a.category !== activeCat) return false;
    if (search) {
      const kw = search.toLowerCase();
      return a.name.toLowerCase().includes(kw) ||
        a.pinyin.toLowerCase().includes(kw) ||
        a.code.toLowerCase().includes(kw) ||
        a.effect.some(e => e.toLowerCase().includes(kw)) ||
        a.indications.some(i => i.toLowerCase().includes(kw));
    }
    return true;
  });

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">加载中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-cinnabar-500 mx-auto mb-3" />
        <p className="text-ink-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">穴位保健</h1>
        <p className="text-sm text-ink-400">人体常用穴位 · 按摩手法 · 对症选穴</p>
      </div>

      {/* 搜索 + 分类 */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索穴位名称、拼音、代码或主治..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 border border-ink-100 focus:border-teal-400 focus:outline-none rounded-xl text-ink-600 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeCat === c.key
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-ink-50 shadow-ink'
                  : 'bg-white/60 text-ink-500 hover:bg-amber-50/60'
              }`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a)}
            className="card-paper p-4 text-left hover:shadow-ink-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/15 to-amber-500/15 grid place-items-center">
                <Activity className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink-600">{a.name}</h3>
                <div className="text-xs text-ink-400">{a.code} · {a.meridian}</div>
              </div>
            </div>
            <div className="text-xs text-ink-500 mb-2 line-clamp-1">定位：{a.location}</div>
            <div className="flex flex-wrap gap-1">
              {a.indications.slice(0, 3).map(i => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">{i}</span>
              ))}
              {a.indications.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-ink-50 text-ink-400 rounded">+{a.indications.length - 3}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-ink-400 text-sm">未找到匹配的穴位</div>
      )}

      {/* 详情弹窗 */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-ink-600/40 backdrop-blur-sm grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-ink-50 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-ink-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-teal-600 to-teal-800 text-ink-50 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-amber-300 text-xs tracking-widest mb-1">{selected.meridian}</div>
                  <h2 className="font-display text-3xl text-ink-50">{selected.name}</h2>
                  <div className="text-ink-100/80 text-sm mt-1">{selected.pinyin} · {selected.code}</div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-ink-50/10 grid place-items-center hover:bg-ink-50/20">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-ink-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-teal-500 rounded" /> 定位
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">{selected.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded" /> 主治
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.indications.map(i => (
                    <span key={i} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">{i}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-cinnabar-500 rounded" /> 功效
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.effect.map(e => (
                    <span key={e} className="text-xs px-2 py-1 bg-cinnabar-50 text-cinnabar-600 rounded">{e}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded" /> 按摩方法
                </h3>
                <p className="text-sm text-ink-500 leading-relaxed">{selected.method}</p>
                <p className="text-xs text-ink-400 mt-1.5">⏱ {selected.duration}</p>
              </div>
              {selected.caution && (
                <div className="rounded-lg bg-cinnabar-50 border border-cinnabar-200 p-3 text-sm text-cinnabar-600">
                  ⚠ {selected.caution}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
