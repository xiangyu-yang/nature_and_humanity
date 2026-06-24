import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { api, type FamilyMember } from '@/api/client';
import { useUserStore } from '@/stores/userStore';
import { RELATION_OPTIONS, getRelationLabel } from '@/utils';

export function FamilyPage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<FamilyMember> | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/birth');
      return;
    }
    loadMembers();
  }, [user, navigate]);

  const loadMembers = () => {
    if (!user) return;
    api.getFamily(user.id).then(d => {
      setMembers(d.data);
      setLoading(false);
    });
  };

  const handleSave = async () => {
    if (!user || !editing) return;
    if (!editing.name || !editing.relation) return;
    try {
      const payload = {
        ...editing,
        userId: user.id,
        birthYear: editing.birthYear || 1990,
        birthMonth: editing.birthMonth || 1,
        birthDay: editing.birthDay || 1,
        birthHour: editing.birthHour ?? 12,
        gender: editing.gender || 'male',
      } as Omit<FamilyMember, 'id' | 'createdAt'>;
      if (editing.id) {
        await api.updateFamilyMember(editing.id, payload);
      } else {
        await api.addFamilyMember(payload);
      }
      setEditing(null);
      loadMembers();
    } catch (e: any) {
      alert(e.message || '保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此家庭成员？')) return;
    await api.deleteFamilyMember(id);
    loadMembers();
  };

  if (loading) {
    return <div className="grid place-items-center min-h-[400px] text-ink-400 text-sm">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink-600 mb-2">家庭健康</h1>
          <p className="text-sm text-ink-400">管理家庭成员 · 共享健康档案</p>
        </div>
        <button
          onClick={() => setEditing({ name: '', gender: 'male', birthYear: 1990, birthMonth: 1, birthDay: 1, birthHour: 12, relation: 'father' })}
          className="btn-primary flex items-center gap-1.5 text-sm py-2"
        >
          <Plus className="w-4 h-4" /> 添加成员
        </button>
      </div>

      {/* 家庭概览 */}
      <div className="card-paper p-5 bg-gradient-to-br from-teal-50/40 to-amber-50/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 grid place-items-center">
            <Users className="w-6 h-6 text-ink-50" />
          </div>
          <div>
            <div className="text-2xl font-display text-ink-600">{members.length}</div>
            <div className="text-xs text-ink-400">位家庭成员</div>
          </div>
        </div>
      </div>

      {/* 成员列表 */}
      {members.length === 0 ? (
        <div className="card-paper p-12 text-center">
          <Users className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-1">还没有添加家庭成员</p>
          <p className="text-xs text-ink-400">添加家人，共同管理健康</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map(m => (
            <div key={m.id} className="card-paper p-5 group hover:shadow-ink-lg transition-all">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-full grid place-items-center text-ink-50 font-display text-lg shrink-0"
                  style={{
                    background: m.gender === 'male'
                      ? 'linear-gradient(135deg, #1A4D5C 0%, #3A6E7C 100%)'
                      : 'linear-gradient(135deg, #C8553D 0%, #D4A84B 100%)',
                  }}
                >
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-ink-600 truncate">{m.name}</h3>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-ink-300 hover:text-cinnabar-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-ink-400 mt-0.5">{getRelationLabel(m.relation)}</div>
                  <div className="text-xs text-ink-500 mt-1.5">
                    🎂 {m.birthYear}年{m.birthMonth}月{m.birthDay}日
                  </div>
                  {m.constitution && (
                    <div className="mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                        {m.constitution}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditing(m)}
                className="mt-3 w-full text-xs py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                编辑信息
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-ink-600/40 backdrop-blur-sm grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div
            className="bg-ink-50 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-ink-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-teal-600 to-teal-800 text-ink-50 p-5 rounded-t-2xl flex items-center justify-between">
              <h2 className="font-display text-xl">{editing.id ? '编辑成员' : '添加家庭成员'}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full bg-ink-50/10 grid place-items-center hover:bg-ink-50/20">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <Field label="姓名">
                <input
                  value={editing.name || ''}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                  maxLength={20}
                />
              </Field>
              <Field label="关系">
                <div className="grid grid-cols-3 gap-1.5">
                  {RELATION_OPTIONS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setEditing({ ...editing, relation: r.value })}
                      className={`py-2 text-xs rounded-lg border ${
                        editing.relation === r.value
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-ink-100 text-ink-500'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="性别">
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setEditing({ ...editing, gender: g })}
                      className={`py-2 rounded-lg border ${
                        editing.gender === g
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-ink-100 text-ink-500'
                      }`}
                    >
                      {g === 'male' ? '男' : '女'}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="出生日期">
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={editing.birthYear || 1990} onChange={e => setEditing({ ...editing, birthYear: Number(e.target.value) })} className="input" placeholder="年" />
                  <input type="number" value={editing.birthMonth || 1} onChange={e => setEditing({ ...editing, birthMonth: Number(e.target.value) })} className="input" placeholder="月" min={1} max={12} />
                  <input type="number" value={editing.birthDay || 1} onChange={e => setEditing({ ...editing, birthDay: Number(e.target.value) })} className="input" placeholder="日" min={1} max={31} />
                </div>
              </Field>
              <Field label="体质（可选）">
                <select
                  value={editing.constitution || ''}
                  onChange={e => setEditing({ ...editing, constitution: e.target.value || undefined })}
                  className="input"
                >
                  <option value="">未测</option>
                  {['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="健康备注">
                <textarea
                  value={editing.healthNote || ''}
                  onChange={e => setEditing({ ...editing, healthNote: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="用药、过敏、慢性病等..."
                />
              </Field>
              <button onClick={handleSave} className="btn-primary w-full">
                {editing.id ? '保存修改' : '添加成员'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-ink-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
