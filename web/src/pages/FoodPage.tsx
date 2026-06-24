import { useEffect, useState } from 'react';
import { Apple, Search, AlertCircle, Calendar, Leaf } from 'lucide-react';
import { api, type FoodItem } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { WUXING_COLOR } from '@/data/ganzhi';

export function FoodPage() {
  const constitution = useUserStore(s => s.constitutionResult);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [seasonal, setSeasonal] = useState<FoodItem[]>([]);
  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'recommend' | 'seasonal' | 'all'>('recommend');

  useEffect(() => {
    Promise.all([
      api.getFoods().catch(() => []),
      api.getFoodRecommend().then((d: any) => Array.isArray(d) ? { seasonal: d, term: null } : d),
    ]).then(([all, rec]) => {
      setFoods(all);
      setSeasonal(rec.seasonal || []);
      setTerm(rec.term);
      setLoading(false);
    });
  }, []);

  const constitutionFoods = constitution?.primaryType
    ? foods.filter(f => f.suitable.includes(constitution.primaryType))
    : [];

  const filteredFoods = foods.filter(f =>
    !search || f.name.includes(search) || f.effect.includes(search) || f.meridian.includes(search)
  );

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink-600 mb-2">食疗推荐</h1>
        <p className="text-sm text-ink-400">体质定制 · 节气养生 · 应季食材</p>
      </div>

      {/* 节气提示 */}
      {term && (
        <section className="card-paper-dark p-5 ornament-corner flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-300/20 grid place-items-center">
            <Calendar className="w-7 h-7 text-amber-300" />
          </div>
          <div className="flex-1">
            <div className="text-amber-300 text-xs tracking-widest mb-1">当前节气</div>
            <div className="text-ink-50 font-display text-xl">{term.name} · {term.season}季</div>
            <div className="text-ink-100/75 text-xs mt-1">{term.principle}</div>
          </div>
        </section>
      )}

      {/* 标签页 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <TabButton active={activeTab === 'recommend'} onClick={() => setActiveTab('recommend')}>
          {constitution?.primaryType || '体质'}推荐
        </TabButton>
        <TabButton active={activeTab === 'seasonal'} onClick={() => setActiveTab('seasonal')}>
          节气食谱
        </TabButton>
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          全部食材
        </TabButton>
      </div>

      {activeTab === 'recommend' && (
        <div>
          {!constitution?.primaryType && (
            <div className="card-paper p-4 mb-4 bg-amber-50/40 border-amber-200 text-sm text-ink-500 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-amber-600" />
              您尚未进行体质测评，显示通用养生食材。完成测评可获得更精准推荐。
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(constitution?.primaryType ? constitutionFoods : foods.slice(0, 12)).map(f => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
          {constitution?.primaryType && constitutionFoods.length === 0 && (
            <div className="text-center py-12 text-ink-400 text-sm">未找到匹配的食材</div>
          )}
        </div>
      )}

      {activeTab === 'seasonal' && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasonal.map(f => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
          {seasonal.length === 0 && (
            <div className="text-center py-12 text-ink-400 text-sm">暂无当季食材</div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索食材名称、功效或归经..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-ink-100 focus:border-teal-400 focus:outline-none rounded-xl text-ink-600 text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFoods.map(f => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <div className="text-center py-12 text-ink-400 text-sm">未找到匹配的食材</div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-ink-50 shadow-ink'
          : 'bg-white/60 text-ink-500 hover:bg-amber-50/60'
      }`}
    >
      {children}
    </button>
  );
}

function FoodCard({ food }: { food: FoodItem }) {
  return (
    <div className="card-paper p-4 hover:shadow-ink-lg transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium text-ink-600 text-base">{food.name}</h3>
          <div className="flex items-center gap-2 text-xs text-ink-400 mt-1">
            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">{food.nature}</span>
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">{food.flavor}</span>
          </div>
        </div>
        <div className="text-2xl">{foodIcon(food.name)}</div>
      </div>
      <div className="text-xs text-ink-500 mb-2">
        <span className="text-ink-400">归经：</span>{food.meridian}
      </div>
      <p className="text-sm text-ink-500 leading-relaxed line-clamp-2">{food.effect}</p>
      {food.suitable.length > 0 && (
        <div className="mt-3 pt-3 border-t border-ink-100">
          <div className="text-[10px] text-ink-400 mb-1.5">适合体质</div>
          <div className="flex flex-wrap gap-1">
            {food.suitable.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function foodIcon(name: string): string {
  const map: Record<string, string> = {
    '黄芪': '🌿', '山药': '🥔', '大枣': '🫒', '鸡肉': '🍗',
    '生姜': '🫚', '羊肉': '🥩', '韭菜': '🌱', '核桃': '🌰',
    '肉桂': '🪵', '桂圆': '🍒', '银耳': '🍄', '百合': '🌸',
    '麦冬': '🌾', '梨': '🍐', '鸭肉': '🦆', '薏米': '🌾',
    '冬瓜': '🥒', '绿豆': '🫛', '苦瓜': '🥒', '白萝卜': '🥕',
    '赤小豆': '🫘', '茯苓': '🍄', '山楂': '🍎', '红花': '🌺',
    '黑木耳': '🍄', '洋葱': '🧅', '红糖': '🟫', '陈皮': '🍊',
    '玫瑰花': '🌹', '佛手': '🍋', '柑橘': '🍊', '春笋': '🎋',
    '荠菜': '🌿', '香椿': '🌱', '莲子': '🪷', '黑芝麻': '⚫',
    '菊花': '🌼', '栗子': '🌰', '猕猴桃': '🥝', '小米': '🌾',
    '南瓜': '🎃',
  };
  return map[name] || '🌿';
}
