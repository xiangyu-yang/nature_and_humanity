// AI 分析引擎 - 三维交叉、五行平衡、健康风险

import type { BaziResult } from '../engines/bazi.js';
import type { ZiweiResult } from '../engines/ziwei.js';
import type { ConstitutionType } from '../engines/constitution.js';
import { CONSTITUTION_INFO } from '../engines/constitution.js';
import { GAN_WUXING, ZHI_WUXING, WUXING_LIST } from '../engines/baziConstants.js';
import { getCurrentSolarTerm } from '../engines/solar.js';

export interface CrossAnalysisResult {
  overallPattern: string;
  constitutionWuxing: string;
  baziWuxing: string;
  ziweiTheme: string;
  alignment: {
    aligned: string[];
    conflict: string[];
    supplement: string[];
  };
  keyRisks: { area: string; risk: string; severity: 'low' | 'medium' | 'high' }[];
  coreRecommendation: string;
}

export interface FiveElementsBalanceResult {
  overallScore: number;
  balance: Record<string, number>;
  diagnosis: string;
  supplements: { element: string; methods: string[] }[];
  cautions: { element: string; reason: string }[];
}

export interface HealthRiskResult {
  risks: {
    organ: string;
    element: string;
    riskLevel: number;
    reasons: string[];
    prevention: string[];
  }[];
  overallHealth: string;
  seasonalAdvice: string;
}

export function crossAnalysis(
  bazi: BaziResult | null,
  ziwei: ZiweiResult | null,
  constitution: ConstitutionType | null,
): CrossAnalysisResult {
  const aligned: string[] = [];
  const conflict: string[] = [];
  const supplement: string[] = [];

  // 体质五行 vs 八字五行
  let constitutionWuxing = '';
  let baziWuxing = '';
  if (constitution) {
    constitutionWuxing = CONSTITUTION_INFO[constitution].element;
  }
  if (bazi) {
    baziWuxing = bazi.dayMasterWuxing;
  }

  if (constitution && bazi) {
    if (constitutionWuxing === baziWuxing) {
      aligned.push(`体质五行（${constitutionWuxing}）与八字日主五行（${baziWuxing}）一致，特征明显`);
    } else {
      // 生克关系分析
      const shengKe = getShengKe(baziWuxing, constitutionWuxing);
      if (shengKe === '生') aligned.push(`八字日主生助体质（${baziWuxing}生${constitutionWuxing}），后天养先天`);
      else if (shengKe === '克') conflict.push(`八字日主与体质相克（${baziWuxing}克${constitutionWuxing}），需调和`);
      else supplement.push(`八字日主与体质互补（${constitutionWuxing}生${baziWuxing}），相得益彰`);
    }
  }

  // 八字五行强弱与体质的关系
  if (bazi) {
    for (const el of WUXING_LIST) {
      if (bazi.wuxingMissing.includes(el)) {
        if (constitution && CONSTITUTION_INFO[constitution].element === el) {
          conflict.push(`八字缺${el}，而您恰为${el}类体质，需后天补益`);
        } else {
          supplement.push(`八字缺${el}，生活起居中可适当补${el}`);
        }
      }
    }
  }

  // 紫微主题
  let ziweiTheme = '';
  if (ziwei && ziwei.lifePalace.majorStars.length > 0) {
    const star = ziwei.lifePalace.majorStars[0];
    ziweiTheme = `紫微命宫坐${star.name}，主${star.trait}`;
  }

  // 综合模式
  const overallPattern = generateOverallPattern(bazi, ziwei, constitution);

  // 关键风险
  const keyRisks = generateKeyRisks(bazi, constitution);

  // 核心建议
  const coreRecommendation = generateCoreRecommendation(bazi, constitution, aligned, conflict, supplement);

  return {
    overallPattern,
    constitutionWuxing,
    baziWuxing,
    ziweiTheme,
    alignment: { aligned, conflict, supplement },
    keyRisks,
    coreRecommendation,
  };
}

function getShengKe(a: string, b: string): '生' | '克' | '泄' | '耗' | '比和' | '未知' {
  // 木生火 火生土 土生金 金生水 水生木
  // 木克土 土克水 水克火 火克金 金克木
  const shengCycle = ['木', '火', '土', '金', '水'];
  const keCycle = ['木', '土', '水', '火', '金'];
  if (!shengCycle.includes(a) || !shengCycle.includes(b)) return '未知';
  if (a === b) return '比和';
  const aIdx = shengCycle.indexOf(a);
  const bIdx = shengCycle.indexOf(b);
  if (shengCycle[(aIdx + 1) % 5] === b) return '生';
  if (keCycle[(aIdx + 1) % 5] === b) return '克';
  if (shengCycle[(bIdx + 1) % 5] === a) return '泄';
  if (keCycle[(bIdx + 1) % 5] === a) return '耗';
  return '未知';
}

function generateOverallPattern(bazi: BaziResult | null, ziwei: ZiweiResult | null, constitution: ConstitutionType | null): string {
  const parts: string[] = [];
  if (bazi) {
    parts.push(`八字${bazi.dayMaster}日主，${bazi.summary}`);
  }
  if (ziwei) {
    parts.push(`紫微${ziwei.wuxingJuJu}，${ziwei.summary}`);
  }
  if (constitution) {
    parts.push(`中医体质为${constitution}，${CONSTITUTION_INFO[constitution].features}`);
  }
  return parts.join('。');
}

function generateKeyRisks(bazi: BaziResult | null, constitution: ConstitutionType | null) {
  const risks: { area: string; risk: string; severity: 'low' | 'medium' | 'high' }[] = [];
  if (constitution) {
    const info = CONSTITUTION_INFO[constitution];
    if (constitution === '阳虚质' || constitution === '气虚质') {
      risks.push({ area: '呼吸系统', risk: '免疫力偏弱，易感冒', severity: 'medium' });
    }
    if (constitution === '阴虚质') {
      risks.push({ area: '心脑血管', risk: '阴虚火旺，睡眠质量需关注', severity: 'medium' });
    }
    if (constitution === '痰湿质' || constitution === '湿热质') {
      risks.push({ area: '代谢系统', risk: '代谢偏缓，需关注血脂血糖', severity: 'high' });
    }
    if (constitution === '血瘀质') {
      risks.push({ area: '心脑血管', risk: '血液粘稠度可能偏高', severity: 'high' });
    }
    if (constitution === '气郁质') {
      risks.push({ area: '情志', risk: '情志不舒，易生郁结', severity: 'medium' });
    }
  }
  if (bazi) {
    for (const el of bazi.wuxingMissing) {
      risks.push({ area: `${el}行相关脏腑`, risk: `五行缺${el}，对应脏腑功能需关注`, severity: 'low' });
    }
  }
  return risks;
}

function generateCoreRecommendation(
  bazi: BaziResult | null,
  constitution: ConstitutionType | null,
  aligned: string[],
  conflict: string[],
  supplement: string[],
): string {
  if (constitution && bazi) {
    const cw = CONSTITUTION_INFO[constitution].element;
    const bw = bazi.dayMasterWuxing;
    if (cw === bw) {
      return `您的体质与八字日主同属${cw}，特征鲜明但易失衡。建议顺应${cw}行规律：${CONSTITUTION_INFO[constitution].advice.join('、')}。`;
    }
    return `您的八字日主为${bw}，体质属${cw}，需两者兼顾：先天${bw}，后天${cw}。${CONSTITUTION_INFO[constitution].advice.join('；')}。`;
  }
  if (constitution) {
    return `建议以体质调养为主：${CONSTITUTION_INFO[constitution].advice.join('；')}。`;
  }
  if (bazi) {
    return `建议结合八字五行：${bazi.summary}`;
  }
  return '请完善生辰信息和体质测评，获取个性化建议。';
}

export function fiveElementsBalance(bazi: BaziResult): FiveElementsBalanceResult {
  const { wuxingPercent, wuxingMissing, wuxingStrong } = bazi;
  // 计算平衡度得分（标准差越小越平衡）
  const vals = WUXING_LIST.map(k => wuxingPercent[k]);
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length;
  const std = Math.sqrt(variance);
  const overallScore = Math.max(0, Math.round(100 - std * 2));

  const balance: Record<string, number> = {};
  for (const k of WUXING_LIST) balance[k] = wuxingPercent[k];

  // 诊断
  let diagnosis = '';
  if (overallScore >= 80) {
    diagnosis = '五行相对平衡，气运和顺。';
  } else if (overallScore >= 60) {
    diagnosis = '五行略有偏颇，生活中适当调节即可。';
  } else if (overallScore >= 40) {
    diagnosis = '五行失衡明显，需系统调养。';
  } else {
    diagnosis = '五行严重失衡，建议专业调理。';
  }

  // 补益方案
  const supplements: { element: string; methods: string[] }[] = [];
  for (const el of wuxingMissing) {
    const methods = getElementSupplementMethods(el);
    supplements.push({ element: el, methods });
  }

  // 警示
  const cautions: { element: string; reason: string }[] = [];
  for (const el of wuxingStrong) {
    cautions.push({ element: el, reason: `${el}行过旺，需疏泄，避免再补` });
  }

  return { overallScore, balance, diagnosis, supplements, cautions };
}

function getElementSupplementMethods(element: string): string[] {
  const map: Record<string, string[]> = {
    木: ['多吃绿色蔬菜（菠菜、青菜）', '多到东方木旺之地散步', '穿青绿色衣物', '听角音（羽调）音乐', '按揉太冲穴'],
    火: ['多吃红色食物（红枣、樱桃）', '多晒太阳', '穿红色衣物', '保持心情开朗', '按揉内关穴'],
    土: ['多吃黄色食物（小米、南瓜）', '居中央稳定之所', '穿黄色衣物', '规律饮食', '按揉足三里'],
    金: ['多吃白色食物（白萝卜、银耳）', '居住西方干燥环境', '穿白色衣物', '呼吸清新空气', '按揉肺俞穴'],
    水: ['多吃黑色食物（黑豆、黑芝麻）', '居住北方临水之地', '穿黑色衣物', '多喝水', '按揉涌泉穴'],
  };
  return map[element] || [];
}

export function healthRiskPrediction(
  bazi: BaziResult | null,
  constitution: ConstitutionType | null,
): HealthRiskResult {
  const risks: HealthRiskResult['risks'] = [];
  const organRisk: Record<string, number> = {
    肝: 0, 心: 0, 脾: 0, 肺: 0, 肾: 0,
  };

  // 从八字推断
  if (bazi) {
    for (const el of bazi.wuxingMissing) {
      const organ = elementToOrgan(el);
      if (organ) organRisk[organ] += 30;
    }
    for (const el of bazi.wuxingStrong) {
      const organ = elementToOrgan(el);
      if (organ) organRisk[organ] += 20; // 过旺也会失衡
    }
  }

  // 从体质推断
  if (constitution) {
    const map: Record<ConstitutionType, string[]> = {
      平和质: [],
      气虚质: ['脾', '肺'],
      阳虚质: ['肾', '脾'],
      阴虚质: ['肾', '心', '肺'],
      痰湿质: ['脾', '肺'],
      湿热质: ['肝', '脾'],
      血瘀质: ['心', '肝'],
      气郁质: ['肝'],
      特禀质: ['肺', '脾'],
    };
    const organs = map[constitution] || [];
    for (const o of organs) {
      organRisk[o] = (organRisk[o] || 0) + 40;
    }
  }

  const organElementMap: Record<string, string> = {
    肝: '木', 心: '火', 脾: '土', 肺: '金', 肾: '水',
  };

  for (const [organ, risk] of Object.entries(organRisk)) {
    if (risk > 0) {
      risks.push({
        organ,
        element: organElementMap[organ],
        riskLevel: Math.min(100, risk),
        reasons: getOrganRiskReasons(organ, bazi, constitution),
        prevention: getOrganPrevention(organ),
      });
    }
  }

  risks.sort((a, b) => b.riskLevel - a.riskLevel);

  // 节气养生
  const term = getCurrentSolarTerm();
  const seasonalAdvice = `${term.name} · ${term.principle}。养${term.body}为主：${term.foods.join('、')}。`;

  const overallHealth = risks.length > 0
    ? `综合评估：${risks.slice(0, 2).map(r => `${r.organ}（${r.riskLevel}%）`).join('、')} 需重点关注。`
    : '综合评估：身体状态良好，继续保持。';

  return { risks, overallHealth, seasonalAdvice };
}

function elementToOrgan(element: string): string | null {
  return { 木: '肝', 火: '心', 土: '脾', 金: '肺', 水: '肾' }[element] || null;
}

function getOrganRiskReasons(organ: string, bazi: BaziResult | null, constitution: ConstitutionType | null): string[] {
  const reasons: string[] = [];
  if (bazi) {
    const element = { 肝: '木', 心: '火', 脾: '土', 肺: '金', 肾: '水' }[organ];
    if (bazi.wuxingMissing.includes(element)) reasons.push(`八字五行缺${element}，${organ}失养`);
    if (bazi.wuxingStrong.includes(element)) reasons.push(`八字五行${element}过旺，${organ}负担过重`);
  }
  if (constitution) {
    const map: Record<ConstitutionType, string[]> = {
      平和质: [],
      气虚质: ['气虚体质，脾肺功能偏弱'],
      阳虚质: ['阳虚体质，肾阳不足'],
      阴虚质: ['阴虚体质，${organ}阴液不足'],
      痰湿质: ['痰湿困脾，运化失司'],
      湿热质: ['湿热内蕴，影响${organ}'],
      血瘀质: ['血行不畅，瘀阻经络'],
      气郁质: ['肝气郁结，气机不畅'],
      特禀质: ['禀赋不足，${organ}卫外功能弱'],
    };
    if (map[constitution]?.length) {
      reasons.push(...map[constitution].map(r => r.replace('${organ}', organ)));
    }
  }
  return reasons;
}

function getOrganPrevention(organ: string): string[] {
  return {
    肝: ['保持心情舒畅', '避免熬夜', '少吃辛辣油腻', '按揉太冲穴'],
    心: ['保证睡眠', '避免过度劳累', '清淡饮食', '按揉内关穴'],
    脾: ['规律饮食', '忌生冷', '多食山药薏米', '按揉足三里'],
    肺: ['注意呼吸新鲜空气', '避免受凉', '多食白色食物', '按揉肺俞穴'],
    肾: ['节制房事', '避免过劳', '多食黑色食物', '按揉涌泉穴'],
  }[organ] || [];
}
