// 天干地支与五行基础知识

export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 天干五行
export const GAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
// 地支五行
export const ZHI_WUXING: Record<string, string> = {
  子: '水', 亥: '水', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 丑: '土',
};
// 天干阴阳
export const GAN_YINYANG: Record<string, '阳' | '阴'> = {
  甲: '阳', 丙: '阳', 戊: '阳', 庚: '阳', 壬: '阳',
  乙: '阴', 丁: '阴', 己: '阴', 辛: '阴', 癸: '阴',
};
// 地支阴阳
export const ZHI_YINYANG: Record<string, '阳' | '阴'> = {
  子: '阳', 寅: '阳', 辰: '阳', 午: '阳', 申: '阳', 戌: '阳',
  丑: '阴', 卯: '阴', 巳: '阴', 未: '阴', 酉: '阴', 亥: '阴',
};
// 地支藏干（本气）
export const ZHI_CANGGAN: Record<string, string[]> = {
  子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'], 卯: ['乙'],
  辰: ['戊', '乙', '癸'], 巳: ['丙', '戊', '庚'], 午: ['丁', '己'], 未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'], 酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
};

export const WUXING_LIST = ['木', '火', '土', '金', '水'] as const;
export const WUXING_COLOR: Record<string, string> = {
  木: '#5A8E4A', 火: '#C8553D', 土: '#D4A84B', 金: '#C9B87A', 水: '#3A6E7C',
};
export const WUXING_DESC: Record<string, string> = {
  木: '肝胆 · 青色 · 春 · 仁',
  火: '心小肠 · 红色 · 夏 · 礼',
  土: '脾胃 · 黄色 · 长夏 · 信',
  金: '肺大肠 · 白色 · 秋 · 义',
  水: '肾膀胱 · 黑色 · 冬 · 智',
};

// 时辰对照
export const HOUR_ZHI: Record<number, string> = {
  0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅', 5: '卯',
  6: '卯', 7: '辰', 8: '辰', 9: '巳', 10: '巳', 11: '午',
  12: '午', 13: '未', 14: '未', 15: '申', 16: '申', 17: '酉',
  18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥', 23: '子',
};

export const HOUR_RANGE: Record<string, string> = {
  子: '23:00-01:00', 丑: '01:00-03:00', 寅: '03:00-05:00', 卯: '05:00-07:00',
  辰: '07:00-09:00', 巳: '09:00-11:00', 午: '11:00-13:00', 未: '13:00-15:00',
  申: '15:00-17:00', 酉: '17:00-19:00', 戌: '19:00-21:00', 亥: '21:00-23:00',
};

// 十神（以日干为我，与其他天干的关系）
export const SHISHEN: Record<string, Record<string, string>> = {
  甲: { 甲: '比肩', 乙: '劫财', 丙: '食神', 丁: '伤官', 戊: '偏财', 己: '正财', 庚: '七杀', 辛: '正官', 壬: '偏印', 癸: '正印' },
  乙: { 乙: '比肩', 甲: '劫财', 丁: '食神', 丙: '伤官', 己: '偏财', 戊: '正财', 辛: '七杀', 庚: '正官', 癸: '偏印', 壬: '正印' },
  丙: { 丙: '比肩', 丁: '劫财', 戊: '食神', 己: '伤官', 庚: '偏财', 辛: '正财', 壬: '七杀', 癸: '正官', 甲: '偏印', 乙: '正印' },
  丁: { 丁: '比肩', 丙: '劫财', 己: '食神', 戊: '伤官', 辛: '偏财', 庚: '正财', 癸: '七杀', 壬: '正官', 乙: '偏印', 甲: '正印' },
  戊: { 戊: '比肩', 己: '劫财', 庚: '食神', 辛: '伤官', 壬: '偏财', 癸: '正财', 甲: '七杀', 乙: '正官', 丙: '偏印', 丁: '正印' },
  己: { 己: '比肩', 戊: '劫财', 辛: '食神', 庚: '伤官', 癸: '偏财', 壬: '正财', 乙: '七杀', 甲: '正官', 丁: '偏印', 丙: '正印' },
  庚: { 庚: '比肩', 辛: '劫财', 壬: '食神', 癸: '伤官', 甲: '偏财', 乙: '正财', 丙: '七杀', 丁: '正官', 戊: '偏印', 己: '正印' },
  辛: { 辛: '比肩', 庚: '劫财', 癸: '食神', 壬: '伤官', 乙: '偏财', 甲: '正财', 丁: '七杀', 丙: '正官', 己: '偏印', 戊: '正印' },
  壬: { 壬: '比肩', 癸: '劫财', 甲: '食神', 乙: '伤官', 丙: '偏财', 丁: '正财', 戊: '七杀', 己: '正官', 庚: '偏印', 辛: '正印' },
  癸: { 癸: '比肩', 壬: '劫财', 乙: '食神', 甲: '伤官', 丁: '偏财', 丙: '正财', 己: '七杀', 戊: '正官', 辛: '偏印', 庚: '正印' },
};

export const SHISHEN_DESC: Record<string, string> = {
  '比肩': '独立自主，刚毅自信，与日主同心。',
  '劫财': '热情豪爽，竞争意识强，重义气。',
  '食神': '温和善良，才华洋溢，重享受。',
  '伤官': '聪明伶俐，个性张扬，反传统。',
  '偏财': '善于理财，人缘广，重商机。',
  '正财': '勤俭持家，重实际，稳健。',
  '七杀': '威严果断，魄力十足。',
  '正官': '正直守法，有责任感。',
  '偏印': '思维独特，喜研究。',
  '正印': '仁慈宽厚，重学习。',
};

// 节气日期（每月两个节气）
export const JIEQI: { name: string; month: number; approximateDay: number }[] = [
  { name: '小寒', month: 1, approximateDay: 5 },
  { name: '大寒', month: 1, approximateDay: 20 },
  { name: '立春', month: 2, approximateDay: 4 },
  { name: '雨水', month: 2, approximateDay: 19 },
  { name: '惊蛰', month: 3, approximateDay: 5 },
  { name: '春分', month: 3, approximateDay: 20 },
  { name: '清明', month: 4, approximateDay: 5 },
  { name: '谷雨', month: 4, approximateDay: 20 },
  { name: '立夏', month: 5, approximateDay: 5 },
  { name: '小满', month: 5, approximateDay: 21 },
  { name: '芒种', month: 6, approximateDay: 6 },
  { name: '夏至', month: 6, approximateDay: 21 },
  { name: '小暑', month: 7, approximateDay: 7 },
  { name: '大暑', month: 7, approximateDay: 23 },
  { name: '立秋', month: 8, approximateDay: 7 },
  { name: '处暑', month: 8, approximateDay: 23 },
  { name: '白露', month: 9, approximateDay: 7 },
  { name: '秋分', month: 9, approximateDay: 23 },
  { name: '寒露', month: 10, approximateDay: 8 },
  { name: '霜降', month: 10, approximateDay: 23 },
  { name: '立冬', month: 11, approximateDay: 7 },
  { name: '小雪', month: 11, approximateDay: 22 },
  { name: '大雪', month: 12, approximateDay: 7 },
  { name: '冬至', month: 12, approximateDay: 22 },
];
