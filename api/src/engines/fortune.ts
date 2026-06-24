// 今日运势计算引擎
import dayjs from 'dayjs';

export interface DailyFortune {
  date: string; // YYYY-MM-DD
  dayPillar: { gan: string; zhi: string; wuxing: string };
  overall: number; // 0-100
  love: number;
  career: number;
  wealth: number;
  health: number;
  lucky: {
    color: string;
    colorHex: string;
    number: number[];
    direction: string;
    time: string;
  };
  yi: string[]; // 宜
  ji: string[]; // 忌
  description: string;
  advice: string;
  mantra: string; // 今日箴言
  wuxing: string; // 今日五行
}

const FORTUNE_QUOTES = [
  '宁静致远，淡泊明志。',
  '上善若水，水善利万物而不争。',
  '天行健，君子以自强不息。',
  '地势坤，君子以厚德载物。',
  '己所不欲，勿施于人。',
  '知足者富，自胜者强。',
  '大道至简，悟在天成。',
  '厚积薄发，水到渠成。',
  '心若安宁，便是归处。',
  '春风化雨，润物无声。',
];

const YI_OPTIONS = ['祭祀', '出行', '理发', '沐浴', '纳财', '开业', '动土', '修造', '安床', '嫁娶', '会友', '读书', '运动', '听曲', '品茶'];
const JI_OPTIONS = ['动土', '安葬', '开仓', '出货', '诉讼', '争执', '熬夜', '暴饮暴食', '过劳', '冒险'];

const LUCKY_COLORS = [
  { name: '朱红', hex: '#C8553D' },
  { name: '琥珀', hex: '#D4A84B' },
  { name: '竹青', hex: '#5A8E4A' },
  { name: '玄青', hex: '#3A6E7C' },
  { name: '月白', hex: '#F5F1E8' },
  { name: '烟紫', hex: '#8B7B8B' },
  { name: '米黄', hex: '#E8D9A8' },
  { name: '黛绿', hex: '#4A6741' },
];

const DIRECTIONS = ['东方', '南方', '西方', '北方', '东南', '东北', '西南', '西北'];

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
const ZHI_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getDayPillar(date: Date): { gan: string; zhi: string; wuxing: string } {
  const base = new Date(1900, 0, 31);
  const diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
  const gan = TIANGAN[((diff % 10) + 10) % 10];
  const zhi = DIZHI[((diff % 12) + 12) % 12];
  return { gan, zhi, wuxing: GAN_WUXING[gan] };
}

export function getDailyFortune(date: Date = new Date(), userKey?: string): DailyFortune {
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  const dayPillar = getDayPillar(date);
  const seed = hash(userKey ? `${userKey}-${dateStr}` : dateStr);

  const wuxingMap: Record<string, string> = {
    木: '木旺，宜青色，利肝胆',
    火: '火旺，宜红色，利心脑',
    土: '土旺，宜黄色，脾胃需调',
    金: '金旺，宜白色，利肺肠',
    水: '水旺，宜黑色，补肾固本',
  };

  const overall = 60 + (seed % 35); // 60-94
  const love = 50 + (seed % 45);
  const career = 55 + ((seed >> 3) % 40);
  const wealth = 45 + ((seed >> 5) % 50);
  const health = 50 + ((seed >> 7) % 45);

  const color = LUCKY_COLORS[seed % LUCKY_COLORS.length];
  const numbers = [
    1 + (seed % 9),
    10 + ((seed >> 2) % 10),
  ];
  const direction = DIRECTIONS[(seed >> 4) % DIRECTIONS.length];
  const time = `${(seed >> 6) % 12 + 1}:00-${(seed >> 6) % 12 + 3}:00`;

  // 选择宜忌
  const yiCount = 3 + (seed % 3);
  const jiCount = 2 + ((seed >> 1) % 2);
  const yi: string[] = [];
  const ji: string[] = [];
  for (let i = 0; i < yiCount; i++) {
    const item = YI_OPTIONS[(seed + i * 3) % YI_OPTIONS.length];
    if (!yi.includes(item)) yi.push(item);
  }
  for (let i = 0; i < jiCount; i++) {
    const item = JI_OPTIONS[(seed + i * 5 + 2) % JI_OPTIONS.length];
    if (!ji.includes(item)) ji.push(item);
  }

  const description = `今日${dayPillar.gan}${dayPillar.zhi}日，${wuxingMap[dayPillar.wuxing] || ''}。整体运势${overall >= 80 ? '上佳' : overall >= 70 ? '良好' : overall >= 60 ? '平稳' : '略低'}，${overall >= 75 ? '宜把握机遇' : '宜守正待机'}。`;
  const advice = `建议保持${dayPillar.wuxing}之气的调和，${overall >= 75 ? '积极行动' : '静心守己'}，方为上策。`;
  const mantra = FORTUNE_QUOTES[seed % FORTUNE_QUOTES.length];

  return {
    date: dateStr,
    dayPillar,
    overall,
    love,
    career,
    wealth,
    health,
    lucky: {
      color: color.name,
      colorHex: color.hex,
      number: numbers,
      direction,
      time,
    },
    yi,
    ji,
    description,
    advice,
    mantra,
    wuxing: dayPillar.wuxing,
  };
}
