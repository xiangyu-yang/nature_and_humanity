import { TIANGAN, DIZHI, GAN_WUXING, ZHI_WUXING } from '../engines/baziConstants';
import { getCurrentSolarTerm, SOLAR_TERMS } from '../engines/solar';

const GAN_OFFSET = 4;
const ZHI_OFFSET = 4;

export function getDayGan(date: Date = new Date()): string {
  const startDate = new Date('1900-01-01');
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const index = (diffDays + GAN_OFFSET) % 10;
  return TIANGAN[index];
}

export function getDayZhi(date: Date = new Date()): string {
  const startDate = new Date('1900-01-01');
  const diffTime = date.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const index = (diffDays + ZHI_OFFSET) % 12;
  return DIZHI[index];
}

export function getDayGanZhi(date: Date = new Date()): string {
  return `${getDayGan(date)}${getDayZhi(date)}`;
}

export function getMonthGan(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const yearGanIndex = (year - 4) % 10;
  const yearGan = TIANGAN[yearGanIndex];
  const monthGanMap: Record<string, string[]> = {
    '甲': ['丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁'],
    '乙': ['丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊'],
    '丙': ['戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
    '丁': ['己', '庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚'],
    '戊': ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'],
    '己': ['辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬'],
    '庚': ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    '辛': ['癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲'],
    '壬': ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙'],
    '癸': ['乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸', '甲', '乙', '丙'],
  };
  return monthGanMap[yearGan]?.[month] || TIANGAN[0];
}

export function getYearGan(date: Date = new Date()): string {
  const year = date.getFullYear();
  const index = (year - 4) % 10;
  return TIANGAN[index];
}

export function getYearZhi(date: Date = new Date()): string {
  const year = date.getFullYear();
  const index = (year - 4) % 12;
  return DIZHI[index];
}

const YI_ACTIONS: Record<string, string[]> = {
  '甲': ['祭祀', '祈福', '求嗣', '开光', '出行', '解除'],
  '乙': ['嫁娶', '祭祀', '祈福', '求嗣', '开光', '出行', '拆卸'],
  '丙': ['祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木'],
  '丁': ['祭祀', '祈福', '求嗣', '开光', '出行', '拆卸', '修造'],
  '戊': ['祭祀', '祈福', '求嗣', '开光', '出行', '解除', '安葬'],
  '己': ['祭祀', '祈福', '求嗣', '开光', '出行', '拆卸', '修造'],
  '庚': ['祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木'],
  '辛': ['嫁娶', '祭祀', '祈福', '求嗣', '开光', '出行', '拆卸'],
  '壬': ['祭祀', '祈福', '求嗣', '开光', '出行', '解除'],
  '癸': ['祭祀', '祈福', '求嗣', '开光', '出行', '拆卸', '修造'],
};

const JI_ACTIONS: Record<string, string[]> = {
  '子': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '丑': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '寅': ['嫁娶', '开市', '交易', '立券'],
  '卯': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '辰': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '巳': ['嫁娶', '开市', '交易', '立券'],
  '午': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '未': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '申': ['嫁娶', '开市', '交易', '立券'],
  '酉': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '戌': ['嫁娶', '开市', '交易', '立券', '纳财'],
  '亥': ['嫁娶', '开市', '交易', '立券'],
};

export function getYiActions(gan: string): string[] {
  return YI_ACTIONS[gan] || ['祭祀', '祈福', '求嗣'];
}

export function getJiActions(zhi: string): string[] {
  return JI_ACTIONS[zhi] || ['嫁娶', '开市'];
}

export interface DailyInfo {
  date: string;
  yearGan: string;
  yearZhi: string;
  monthGan: string;
  monthZhi: string;
  dayGan: string;
  dayZhi: string;
  dayGanZhi: string;
  yearWuxing: string;
  monthWuxing: string;
  dayWuxing: string;
  solarTerm: string;
  season: string;
  seasonElement: string;
  yi: string[];
  ji: string[];
  healthTips: string;
  recommendedFoods: string[];
  avoidFoods: string[];
  recommendedAcupoints: string[];
}

export function getDailyInfo(date: Date = new Date()): DailyInfo {
  const dayGan = getDayGan(date);
  const dayZhi = getDayZhi(date);
  const yearGan = getYearGan(date);
  const yearZhi = getYearZhi(date);
  const monthGan = getMonthGan(date);
  const monthZhi = DIZHI[date.getMonth()];
  
  const solarTerm = getCurrentSolarTerm(date);
  
  return {
    date: date.toISOString().split('T')[0],
    yearGan,
    yearZhi,
    monthGan,
    monthZhi,
    dayGan,
    dayZhi,
    dayGanZhi: `${dayGan}${dayZhi}`,
    yearWuxing: GAN_WUXING[yearGan] || '',
    monthWuxing: GAN_WUXING[monthGan] || '',
    dayWuxing: GAN_WUXING[dayGan] || '',
    solarTerm: solarTerm.name,
    season: solarTerm.season,
    seasonElement: solarTerm.element,
    yi: getYiActions(dayGan).slice(0, 4),
    ji: getJiActions(dayZhi).slice(0, 3),
    healthTips: solarTerm.health,
    recommendedFoods: solarTerm.foods,
    avoidFoods: solarTerm.avoid,
    recommendedAcupoints: solarTerm.acupoints,
  };
}

export async function getWeather(city: string = '北京'): Promise<{
  success: boolean;
  temperature?: string;
  weather?: string;
  humidity?: string;
  wind?: string;
  city?: string;
}> {
  try {
    const apiUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('天气API响应失败');
    }
    const data = await response.json();
    const current = data.current_condition?.[0];
    if (current) {
      return {
        success: true,
        temperature: current.temp_C,
        weather: current.weatherDesc?.[0]?.value || '',
        humidity: current.humidity,
        wind: current.winddir16Point + ' ' + current.windspeedKmph + 'km/h',
        city: data.nearest_area?.[0]?.areaName?.[0]?.value || city,
      };
    }
  } catch (e) {
    console.warn('获取天气失败:', e);
  }
  
  return {
    success: false,
  };
}