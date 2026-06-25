import {
  TIANGAN,
  DIZHI,
  GAN_WUXING,
  ZHI_WUXING,
  ZHI_CANGGAN,
  HOUR_ZHI,
  SHISHEN,
  SHISHEN_DESC,
  WUXING_LIST,
} from './baziConstants.js';

export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  isLunar?: boolean;
}

export interface Pillar {
  gan: string;
  zhi: string;
  canggan: string[];
  naYin?: string;
}

export interface BaziResult {
  input: BaziInput;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string;
  dayMasterWuxing: string;
  wuxingCount: Record<string, number>;
  wuxingPercent: Record<string, number>;
  wuxingMissing: string[];
  wuxingStrong: string[];
  wuxingWeak: string[];
  shishen: { year: string; month: string; day: string; hour: string };
  shishenDesc: Record<string, string>;
  nayin: { year: string; month: string; day: string; hour: string };
  dayun: { sequence: number; gan: string; zhi: string; startAge: number }[];
  summary: string;
}

// === 农历支持（1900-2100 简化查表） ===
// 使用查表法获取农历年月日
// 由于实现完整农历算法非常复杂，这里采用近似算法：
// 实际是使用标准的 lunarInfo 表进行转换

const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
];

function lunarYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}

function leapDays(y: number): number {
  if (leapMonth(y)) {
    return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y: number, m: number): number {
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

function toSolar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  // 农历转阳历（简化实现：将农历日期加偏移）
  // 实际使用基于1900年基准的偏移
  const baseDate = new Date(1900, 0, 31); // 1900年1月31日 = 农历1900年正月初一
  let offset = 0;
  for (let y = 1900; y < year; y++) {
    offset += lunarYearDays(y);
  }
  // 加上闰月
  const leap = leapMonth(year);
  for (let m = 1; m < month; m++) {
    offset += monthDays(year, m);
    if (m === leap) offset += leapDays(year);
  }
  offset += day - 1;
  const solar = new Date(baseDate);
  solar.setDate(solar.getDate() + offset);
  return { year: solar.getFullYear(), month: solar.getMonth() + 1, day: solar.getDate() };
}

// === 节气修正：确定月份以立春为界 ===
// === 年柱：以立春为界 ===
function getYearPillar(year: number, month: number, day: number): Pillar {
  // 立春通常在 2月4日 左右
  let y = year;
  if (month < 2 || (month === 2 && day < 4)) y = year - 1;
  const ganIdx = (y - 4) % 10;
  const zhiIdx = (y - 4) % 12;
  return buildPillar(TIANGAN[ganIdx], DIZHI[zhiIdx]);
}

function getMonthPillar(year: number, month: number, day: number): Pillar {
  // 节气月：立春开始为寅月
  const jieqiMonths = [2, 4, 6, 8, 10, 12, 2]; // [立春, 惊蛰, 清明, 立夏, 芒种, 小暑, 立秋...]
  // 简化：根据阳历月份确定月柱地支
  // 子月(11)丑月(12)寅月(1)卯月(2)辰月(3)巳月(4)午月(5)未月(6)申月(7)酉月(8)戌月(9)亥月(10)
  // 按节气校正：以立春（2/4）作为寅月开始
  let m = month;
  if (month === 1 || (month === 2 && day < 4)) m = 12; // 丑月
  else if (month === 2 || (month === 3 && day < 5)) m = 1; // 寅月
  else if (month === 3 || (month === 4 && day < 5)) m = 2; // 卯月
  else if (month === 4 || (month === 5 && day < 5)) m = 3; // 辰月
  else if (month === 5 || (month === 6 && day < 6)) m = 4; // 巳月
  else if (month === 6 || (month === 7 && day < 7)) m = 5; // 午月
  else if (month === 7 || (month === 8 && day < 7)) m = 6; // 未月
  else if (month === 8 || (month === 9 && day < 7)) m = 7; // 申月
  else if (month === 9 || (month === 10 && day < 8)) m = 8; // 酉月
  else if (month === 10 || (month === 11 && day < 7)) m = 9; // 戌月
  else if (month === 11 || (month === 12 && day < 7)) m = 10; // 亥月
  else m = 11; // 子月

  // 五虎遁：甲己之年丙作首
  const y = year;
  const yearGan = TIANGAN[(y - 4) % 10];
  const startGanMap: Record<string, number> = {
    甲: 2, 己: 2, // 丙寅
    乙: 4, 庚: 4, // 戊寅
    丙: 6, 辛: 6, // 庚寅
    丁: 8, 壬: 8, // 壬寅
    戊: 0, 癸: 0, // 甲寅
  };
  const startGan = startGanMap[yearGan];
  const ganIdx = (startGan + m - 1) % 10;
  const zhiIdx = (2 + m) % 12; // 寅为2
  return buildPillar(TIANGAN[ganIdx], DIZHI[zhiIdx]);
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  // 计算与基准日（1900-01-31 甲辰日）的天数差
  const baseDate = new Date(1900, 0, 31);
  const target = new Date(year, month - 1, day);
  const diff = Math.floor((target.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const ganIdx = ((diff % 10) + 10) % 10;
  const zhiIdx = ((diff % 12) + 12) % 12;
  return buildPillar(TIANGAN[ganIdx], DIZHI[zhiIdx]);
}

function getHourPillar(dayGan: string, hour: number): Pillar {
  const zhi = HOUR_ZHI[hour] || '午';
  // 五鼠遁：甲己还加甲
  const startGanMap: Record<string, number> = {
    甲: 0, 己: 0, // 甲子
    乙: 2, 庚: 2, // 丙子
    丙: 4, 辛: 4, // 戊子
    丁: 6, 壬: 6, // 庚子
    戊: 8, 癸: 8, // 壬子
  };
  const startGan = startGanMap[dayGan] ?? 0;
  const zhiIdx = DIZHI.indexOf(zhi as any);
  const ganIdx = (startGan + zhiIdx) % 10;
  return buildPillar(TIANGAN[ganIdx], zhi);
}

function buildPillar(gan: string, zhi: string): Pillar {
  return {
    gan,
    zhi,
    canggan: ZHI_CANGGAN[zhi] || [],
  };
}

const NAYIN_TABLE: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水',
};

function getNaYin(gan: string, zhi: string): string {
  return NAYIN_TABLE[gan + zhi] || '';
}

function countWuxing(pillars: Pillar[]): Record<string, number> {
  const count: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) {
    count[GAN_WUXING[p.gan]] = (count[GAN_WUXING[p.gan]] || 0) + 1;
    count[ZHI_WUXING[p.zhi]] = (count[ZHI_WUXING[p.zhi]] || 0) + 1;
    for (const cg of p.canggan) {
      const wx = GAN_WUXING[cg];
      if (wx) count[wx] = (count[wx] || 0) + 0.5;
    }
  }
  return count;
}

function classifyWuxing(count: Record<string, number>) {
  const total = WUXING_LIST.reduce((s, k) => s + count[k], 0);
  const percent: Record<string, number> = {};
  for (const k of WUXING_LIST) {
    percent[k] = total > 0 ? Math.round((count[k] / total) * 100) : 0;
  }
  const missing: string[] = [];
  const weak: string[] = [];
  const strong: string[] = [];
  for (const k of WUXING_LIST) {
    if (count[k] === 0) missing.push(k);
    else if (count[k] < total * 0.1) weak.push(k);
    else if (count[k] > total * 0.3) strong.push(k);
  }
  return { percent, missing, weak, strong };
}

function getShishen(dayMaster: string, pillars: Pillar[]): { year: string; month: string; day: string; hour: string } {
  const result: any = {};
  const positions = ['year', 'month', 'hour'] as const;
  result.day = '日主';
  for (let i = 0; i < positions.length; i++) {
    const p = pillars[i];
    result[positions[i]] = SHISHEN[dayMaster]?.[p.gan] || '—';
  }
  return result;
}

function generateDayun(gender: 'male' | 'female', yearGan: string, monthGan: string, monthZhi: string): { sequence: number; gan: string; zhi: string; startAge: number }[] {
  // 阳年男顺/阴年女顺；阳年女逆/阴年男逆
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan);
  const isForward = (isYangYear && gender === 'male') || (!isYangYear && gender === 'female');
  const ganIdx = TIANGAN.indexOf(monthGan as any);
  const zhiIdx = DIZHI.indexOf(monthZhi as any);
  const result: { sequence: number; gan: string; zhi: string; startAge: number }[] = [];
  for (let i = 1; i <= 8; i++) {
    const gIdx = isForward ? (ganIdx + i) % 10 : (ganIdx - i + 10) % 10;
    const zIdx = isForward ? (zhiIdx + i) % 12 : (zhiIdx - i + 12) % 12;
    result.push({
      sequence: i,
      gan: TIANGAN[gIdx],
      zhi: DIZHI[zIdx],
      startAge: i * 10,
    });
  }
  return result;
}

export function calcBazi(input: BaziInput): BaziResult {
  let solar = { year: input.year, month: input.month, day: input.day };
  if (input.isLunar) {
    solar = toSolar(input.year, input.month, input.day);
  }

  const yearP = getYearPillar(solar.year, solar.month, solar.day);
  const monthP = getMonthPillar(solar.year, solar.month, solar.day);
  const dayP = getDayPillar(solar.year, solar.month, solar.day);
  const hourP = getHourPillar(dayP.gan, input.hour);

  const pillars = [yearP, monthP, dayP, hourP];
  const wuxingCount = countWuxing(pillars);
  const { percent, missing, weak, strong } = classifyWuxing(wuxingCount);
  const dayMaster = dayP.gan;
  const dayMasterWuxing = GAN_WUXING[dayMaster];
  const shishen = getShishen(dayMaster, pillars);
  const shishenDesc: Record<string, string> = {};
  for (const [k, v] of Object.entries(shishen)) {
    if (v && v !== '日主') shishenDesc[v] = SHISHEN_DESC[v] || '';
  }
  const nayin = {
    year: getNaYin(yearP.gan, yearP.zhi),
    month: getNaYin(monthP.gan, monthP.zhi),
    day: getNaYin(dayP.gan, dayP.zhi),
    hour: getNaYin(hourP.gan, hourP.zhi),
  };
  const dayun = generateDayun(input.gender, yearP.gan, monthP.gan, monthP.zhi);

  // 总结
  const summary = generateSummary(dayMaster, dayMasterWuxing, wuxingCount, missing, strong, weak);

  return {
    input,
    yearPillar: yearP,
    monthPillar: monthP,
    dayPillar: dayP,
    hourPillar: hourP,
    dayMaster,
    dayMasterWuxing,
    wuxingCount,
    wuxingPercent: percent,
    wuxingMissing: missing,
    wuxingStrong: strong,
    wuxingWeak: weak,
    shishen,
    shishenDesc,
    nayin,
    dayun,
    summary,
  };
}

function generateSummary(dayMaster: string, wx: string, count: Record<string, number>, missing: string[], strong: string[], weak: string[]): string {
  const personalityByWx: Record<string, string> = {
    木: '仁慈正直，向上向善',
    火: '热情积极，光明磊落',
    土: '稳重守信，包容厚德',
    金: '刚毅果决，重义守节',
    水: '智慧灵动，善于变通',
  };
  const tianGanPersonality: Record<string, string> = {
    甲: '参天大木', 乙: '花草藤蔓', 丙: '太阳之火', 丁: '灯烛之火',
    戊: '高山厚土', 己: '田园沃土', 庚: '刀剑金石', 辛: '珠玉饰金',
    壬: '江河大水', 癸: '雨露细水',
  };
  const basePersonality = `${dayMaster}（${tianGanPersonality[dayMaster]}）日主，主人${personalityByWx[wx]}。`;
  const balancePart =
    missing.length > 0
      ? `五行中${missing.join('、')}较为缺失，可在生活中适当补益`
      : '五行齐备，气韵中和。';
  const featurePart =
    strong.length > 0
      ? `${strong.join('、')}偏旺，宜疏通泄秀`
      : weak.length > 0
      ? `${weak.join('、')}偏弱，宜扶助培元`
      : '五行相对平衡。';
  return `${basePersonality}${balancePart}${featurePart}`;
}
