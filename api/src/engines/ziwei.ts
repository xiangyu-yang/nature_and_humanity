// 紫微斗数计算引擎

const ZIWEI_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
  '七杀', '破军',
] as const;

const ZIWEI_MEANINGS: Record<string, { element: string; trait: string; body: string }> = {
  紫微: { element: '土', trait: '尊贵领导', body: '头面' },
  天机: { element: '木', trait: '智慧谋略', body: '肝胆' },
  太阳: { element: '火', trait: '光明博爱', body: '眼目' },
  武曲: { element: '金', trait: '财星果断', body: '肺肠' },
  天同: { element: '水', trait: '温顺福星', body: '脾胃' },
  廉贞: { element: '火', trait: '是非刚烈', body: '心肾' },
  天府: { element: '土', trait: '稳重富足', body: '腹胃' },
  太阴: { element: '水', trait: '财富柔顺', body: '肾脏' },
  贪狼: { element: '木水', trait: '欲望才艺', body: '肝' },
  巨门: { element: '水', trait: '口舌是非', body: '口舌' },
  天相: { element: '水', trait: '衣食助人', body: '肢体' },
  天梁: { element: '土', trait: '荫庇长辈', body: '脾' },
  七杀: { element: '金', trait: '将星武勇', body: '肺' },
  破军: { element: '水', trait: '改革开创', body: '肾' },
};

const GONG_NAMES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '奴仆', '官禄', '田宅', '福德', '父母',
] as const;

const GONG_MEANINGS: Record<string, string> = {
  命宫: '代表先天性格、命运主体',
  兄弟: '代表兄弟姊妹与平辈关系',
  夫妻: '代表婚姻、配偶与感情',
  子女: '代表子女、下属与创造力',
  财帛: '代表财富、收入与理财',
  疾厄: '代表健康、疾病与体质',
  迁移: '代表外出、迁移与社交',
  奴仆: '代表朋友、同事与下属',
  官禄: '代表事业、官运与学业',
  田宅: '代表家产、居住环境',
  福德: '代表精神、内心与福气',
  父母: '代表父母、长辈与遗传',
};

const SHEN_GONG = ['庙', '旺', '得', '利', '平', '陷'] as const;

export interface ZiweiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  isLunar?: boolean;
}

export interface Gong {
  index: number;
  name: string;
  meaning: string;
  isMingGong: boolean;
  isShenGong: boolean;
  earthlyBranch: string;
  heavenlyStem: string;
  majorStars: { name: string; element: string; trait: string; body: string; brightness: string }[];
  minorStars: string[];
  summary: string;
}

export interface ZiweiResult {
  input: ZiweiInput;
  mingGong: number;
  shenGong: number;
  wuxingJuJu: string;
  juNumber: number;
  lifePalace: Gong;
  bodyPalace: Gong;
  palaces: Gong[];
  summary: string;
}

// 计算局数（简化：基于年支）
function calculateJu(yearZhi: string, month: number, day: number, hour: number): { ju: number; wuxing: string } {
  // 简化算法：年支序号 + 月日时综合
  const zhiIdx = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(yearZhi);
  // 以紫微星所在宫位确定局数
  // 简化：从年支起正月，顺数至生月，再从生月起子时顺数至生时，得紫微星位置
  // 紫微星位置 = 局数
  const monthPosition = (zhiIdx + month - 1) % 12; // 从年支起正月
  // 从月支起子时
  const timePosition = (monthPosition + Math.floor((hour + 1) / 2)) % 12;
  // 紫微星从寅宫起（索引2），按固定序列旋转
  const ziweiPos = (2 + (zhiIdx + month + Math.floor(hour / 2))) % 12;
  const ju = ((ziweiPos + day) % 12) + 1; // 1-12局
  // 五行局：基于局数
  const wuxingMap = ['水二局', '木三局', '火六局', '土五局', '金四局'];
  const wuxingJuJu = wuxingMap[ju % 5];
  return { ju, wuxing: wuxingJuJu };
}

// 紫微星定位序列
const ZIWEI_SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function getZiweiPos(ju: number): number {
  // 紫微星起寅宫，按局数跳跃
  const startPos = 2; // 寅
  return (startPos + (ju - 1)) % 12;
}

// 其他主星连锁定位
function getStarPositions(ziweiPos: number) {
  const positions: Record<string, number> = {
    紫微: ziweiPos,
    天机: (ziweiPos - 1 + 12) % 12,
    空: (ziweiPos - 2 + 12) % 12,
    太阳: (ziweiPos - 3 + 12) % 12,
    武曲: (ziweiPos - 4 + 12) % 12,
    天同: (ziweiPos - 5 + 12) % 12,
    廉贞: (ziweiPos - 6 + 12) % 12,
  };
  // 天府与紫微对宫
  const tianfuPos = (4 - ziweiPos + 12) % 12; // 子丑对称
  positions['天府'] = tianfuPos;
  positions['太阴'] = (tianfuPos + 1) % 12;
  positions['贪狼'] = (tianfuPos + 2) % 12;
  positions['巨门'] = (tianfuPos + 3) % 12;
  positions['天相'] = (tianfuPos + 4) % 12;
  positions['天梁'] = (tianfuPos + 5) % 12;
  positions['七杀'] = (tianfuPos + 6) % 12;
  positions['破军'] = (tianfuPos + 7) % 12;
  return positions;
}

const ZHI_LIST = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const GAN_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

function getGongStem(gongIdx: number, yearStem: string): string {
  // 五虎遁起宫干
  const startMap: Record<string, number> = {
    甲: 0, 己: 0, 乙: 2, 庚: 2, 丙: 4, 辛: 4, 丁: 6, 壬: 6, 戊: 8, 癸: 8,
  };
  const start = startMap[yearStem];
  return GAN_LIST[(start + gongIdx) % 10];
}

function getBrightness(star: string, gongIdx: number): string {
  // 简化：基于固定规则
  const brightMap: Record<string, number[]> = {
    紫微: [0, 1, 2, 5, 6, 9, 10], // 庙旺宫位
    天机: [2, 3, 4, 5, 6, 7],
    太阳: [0, 1, 5, 6, 7, 8, 9], // 白天庙旺
    武曲: [2, 3, 4, 7, 8],
    天同: [0, 3, 5, 6, 8],
    廉贞: [1, 5, 6, 7],
    天府: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    太阴: [0, 1, 2, 6, 7, 8, 9, 10, 11], // 夜晚庙旺
    贪狼: [0, 1, 5, 6, 7],
    巨门: [0, 2, 6, 10],
    天相: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    天梁: [0, 1, 5, 6, 7, 10, 11],
    七杀: [0, 2, 5, 6, 7],
    破军: [0, 5, 6, 7, 10, 11],
  };
  const arr = brightMap[star] || [];
  if (arr.length === 0) return '平';
  if (arr.includes(gongIdx)) {
    if (gongIdx === 0 || gongIdx === 6) return '庙';
    return '旺';
  }
  if ([5, 7].includes(gongIdx)) return '得';
  if (gongIdx === 11) return '陷';
  return '利';
}

const MINOR_STARS_BY_POS: Record<number, string[]> = {
  0: ['文昌'],
  1: ['天钺'],
  2: ['左辅', '天魁'],
  3: ['天钺', '文曲'],
  4: ['禄存'],
  5: ['擎羊'],
  6: ['陀罗'],
  7: ['火星'],
  8: ['铃星'],
  9: ['地空'],
  10: ['地劫'],
  11: ['天刑'],
};

function generateGongSummary(name: string, stars: { name: string; element: string; trait: string }[]): string {
  if (stars.length === 0) {
    return `${name}无主星坐守，需借对宫星曜影响。`;
  }
  const starNames = stars.map(s => `${s.name}（${s.element} · ${s.trait}）`).join('、');
  return `${name}有${starNames}坐守，主${GONG_MEANINGS[name] || ''}。`;
}

export function calcZiwei(input: ZiweiInput): ZiweiResult {
  // 简化：使用阳历
  const yearZhi = ZHI_LIST[(input.year - 4) % 12];
  const { ju, wuxing } = calculateJu(yearZhi, input.month, input.day, input.hour);
  const ziweiPos = getZiweiPos(ju);
  const starPositions = getStarPositions(ziweiPos);
  const yearStem = GAN_LIST[(input.year - 4) % 10];

  // 命宫位置 = 从寅起正月，顺数到生月，再从该宫起子时逆数到生时
  let mingGong = (2 + input.month - 1) % 12;
  mingGong = (mingGong - Math.floor((input.hour + 1) / 2) + 12 * 2) % 12;
  // 身宫 = 从寅起正月，顺数到生月，再从该宫起子时顺数到生时
  let shenGong = (2 + input.month - 1) % 12;
  shenGong = (shenGong + Math.floor((input.hour + 1) / 2)) % 12;

  // 十二宫
  const palaces: Gong[] = [];
  for (let i = 0; i < 12; i++) {
    const gongIdx = (mingGong + i) % 12;
    const branch = ZHI_LIST[gongIdx];
    const stem = getGongStem(gongIdx, yearStem);
    const stars: { name: string; element: string; trait: string; body: string; brightness: string }[] = [];
    for (const [star, pos] of Object.entries(starPositions)) {
      if (pos === gongIdx && star !== '空') {
        const m = ZIWEI_MEANINGS[star];
        if (m) {
          stars.push({
            name: star,
            element: m.element,
            trait: m.trait,
            body: m.body,
            brightness: getBrightness(star, gongIdx),
          });
        }
      }
    }
    const minorStars = MINOR_STARS_BY_POS[gongIdx] || [];
    palaces.push({
      index: i,
      name: GONG_NAMES[i],
      meaning: GONG_MEANINGS[GONG_NAMES[i]] || '',
      isMingGong: gongIdx === mingGong,
      isShenGong: gongIdx === shenGong,
      earthlyBranch: branch,
      heavenlyStem: stem,
      majorStars: stars,
      minorStars,
      summary: generateGongSummary(GONG_NAMES[i], stars),
    });
  }

  const lifePalace = palaces[0];
  const bodyPalace = palaces[palaces.findIndex(p => p.isShenGong)];
  const summary = generateZiweiSummary(lifePalace, wuxing, ju);

  return {
    input,
    mingGong,
    shenGong,
    wuxingJuJu: wuxing,
    juNumber: ju,
    lifePalace,
    bodyPalace,
    palaces,
    summary,
  };
}

function generateZiweiSummary(mingGong: Gong, wuxing: string, ju: number): string {
  const stars = mingGong.majorStars.map(s => `${s.name}（${s.brightness}）`).join('、');
  const starDesc = stars || '无主星，借对宫星曜';
  return `命宫为${wuxing}第${ju}局，坐${mingGong.earthlyBranch}宫，${starDesc}。主人${mingGong.majorStars.length > 0 ? mingGong.majorStars[0].trait : '多才多艺'}，需后天修养方成大器`;
}
