// 工具函数
export const WUXING_COLOR: Record<string, string> = {
  木: '#5A8E4A',
  火: '#C8553D',
  土: '#D4A84B',
  金: '#C9B87A',
  水: '#3A6E7C',
};

export const WUXING_BG: Record<string, string> = {
  木: 'bg-[#5A8E4A]/15 text-[#3D6B30]',
  火: 'bg-[#C8553D]/15 text-[#8B3525]',
  土: 'bg-[#D4A84B]/20 text-[#7A5C1F]',
  金: 'bg-[#C9B87A]/20 text-[#6B5C3E]',
  水: 'bg-[#3A6E7C]/15 text-[#1A4D5C]',
};

export function formatDate(date: Date | string, fmt = 'YYYY-MM-DD HH:mm'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return fmt
    .replace('YYYY', String(Y))
    .replace('MM', M)
    .replace('DD', D)
    .replace('HH', h)
    .replace('mm', m);
}

export function getWuxingElement(gan: string): string {
  return {
    甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
    己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
  }[gan] || '土';
}

export function getZhiWuxing(zhi: string): string {
  return {
    子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
    午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
  }[zhi] || '土';
}

export function getSeverityColor(level: 'low' | 'medium' | 'high'): string {
  return {
    low: 'text-amber-600 bg-amber-50 border-amber-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    high: 'text-cinnabar-500 bg-cinnabar-50 border-cinnabar-200',
  }[level];
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-[#5A8E4A]';
  if (score >= 65) return 'text-[#D4A84B]';
  if (score >= 50) return 'text-[#C8553D]';
  return 'text-[#8B7355]';
}

export function getRelationLabel(relation: string): string {
  const map: Record<string, string> = {
    father: '父亲', mother: '母亲', spouse: '配偶',
    son: '儿子', daughter: '女儿', brother: '兄弟', sister: '姊妹',
    grandfather: '祖父', grandmother: '祖母', other: '其他',
  };
  return map[relation] || relation;
}

export const RELATION_OPTIONS = [
  { value: 'father', label: '父亲' },
  { value: 'mother', label: '母亲' },
  { value: 'spouse', label: '配偶' },
  { value: 'son', label: '儿子' },
  { value: 'daughter', label: '女儿' },
  { value: 'brother', label: '兄弟' },
  { value: 'sister', label: '姊妹' },
  { value: 'grandfather', label: '祖父' },
  { value: 'grandmother', label: '祖母' },
  { value: 'other', label: '其他' },
];
