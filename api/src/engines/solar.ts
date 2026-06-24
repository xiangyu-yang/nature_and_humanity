// 节气历法引擎

export interface SolarTerm {
  name: string;
  month: number;
  season: '春' | '夏' | '秋' | '冬';
  element: '木' | '火' | '土' | '金' | '水';
  body: string;
  organs: string[];
  principle: string;
  foods: string[];
  avoid: string[];
  acupoints: string[];
  health: string;
}

export const SOLAR_TERMS: SolarTerm[] = [
  { name: '小寒', month: 1, season: '冬', element: '水', body: '肾', organs: ['肾', '膀胱'], principle: '温肾固本，养精蓄锐', foods: ['黑芝麻', '核桃', '羊肉', '板栗'], avoid: ['生冷寒凉'], acupoints: ['关元', '命门', '涌泉'], health: '注意保暖背部与腰部，避免寒邪侵袭' },
  { name: '大寒', month: 1, season: '冬', element: '水', body: '肾', organs: ['肾', '膀胱'], principle: '防寒保暖，藏精固本', foods: ['红枣', '桂圆', '当归', '生姜'], avoid: ['冰凉饮食'], acupoints: ['足三里', '神阙'], health: '一年中最冷时段，宜早睡晚起' },
  { name: '立春', month: 2, season: '春', element: '木', body: '肝', organs: ['肝', '胆'], principle: '疏肝理气，养肝明目', foods: ['春笋', '菠菜', '韭菜', '香菜'], avoid: ['油腻酸涩'], acupoints: ['太冲', '期门', '肝俞'], health: '顺应生发之气，避免生气郁怒' },
  { name: '雨水', month: 2, season: '春', element: '木', body: '肝', organs: ['肝', '脾'], principle: '健脾祛湿，疏肝养胃', foods: ['山药', '薏米', '红枣', '蜂蜜'], avoid: ['寒凉生冷'], acupoints: ['足三里', '阴陵泉'], health: '雨水渐多，湿气渐起，注意脾胃' },
  { name: '惊蛰', month: 3, season: '春', element: '木', body: '肝', organs: ['肝', '肺'], principle: '养肝清肺，升发阳气', foods: ['梨', '银耳', '百合', '春笋'], avoid: ['辛辣动火'], acupoints: ['太冲', '合谷'], health: '春雷始鸣，蛰虫惊醒，宜舒展筋骨' },
  { name: '春分', month: 3, season: '春', element: '木', body: '肝', organs: ['肝', '胆'], principle: '平衡阴阳，疏肝和胃', foods: ['时令蔬菜', '豆制品', '芝麻'], avoid: ['大寒大热'], acupoints: ['期门', '太冲'], health: '昼夜等分，宜调和阴阳' },
  { name: '清明', month: 4, season: '春', element: '木', body: '肝', organs: ['肝', '心'], principle: '清肝明目，养心安神', foods: ['荠菜', '菊花', '枸杞', '桑葚'], avoid: ['发物', '辛辣'], acupoints: ['太冲', '神门'], health: '天气清朗，扫墓踏青，舒缓情志' },
  { name: '谷雨', month: 4, season: '春', element: '土', body: '脾胃', organs: ['脾', '胃'], principle: '健脾祛湿，养血安神', foods: ['薏米', '冬瓜', '赤小豆', '香椿'], avoid: ['油腻厚味'], acupoints: ['足三里', '阴陵泉', '丰隆'], health: '雨生百谷，湿气重，健脾最重要' },
  { name: '立夏', month: 5, season: '夏', element: '火', body: '心', organs: ['心', '小肠'], principle: '养心安神，清心泻火', foods: ['莲子', '百合', '苦瓜', '绿豆'], avoid: ['大热大补'], acupoints: ['神门', '内关', '少府'], health: '夏季开始，养心是关键' },
  { name: '小满', month: 5, season: '夏', element: '火', body: '心', organs: ['心', '脾'], principle: '清心祛暑，健脾化湿', foods: ['苦菜', '绿豆', '薏米', '黄瓜'], avoid: ['肥甘厚味'], acupoints: ['曲泽', '内关'], health: '小满者，物至于此小得盈满' },
  { name: '芒种', month: 6, season: '夏', element: '火', body: '心', organs: ['心', '脾'], principle: '清心防暑，健脾祛湿', foods: ['薏米', '冬瓜', '绿豆', '莲子'], avoid: ['生冷油腻'], acupoints: ['阴陵泉', '丰隆'], health: '湿热交蒸，注意防暑' },
  { name: '夏至', month: 6, season: '夏', element: '火', body: '心', organs: ['心', '肾'], principle: '清心养肾，养阴生津', foods: ['绿豆', '莲子', '百合', '西瓜'], avoid: ['辛热助火'], acupoints: ['涌泉', '太溪', '神门'], health: '阳气最盛，宜静养避暑' },
  { name: '小暑', month: 7, season: '夏', element: '土', body: '脾胃', organs: ['脾', '胃'], principle: '健脾化湿，养阴清热', foods: ['薏米', '绿豆', '莲藕', '西瓜'], avoid: ['冰冻冷饮'], acupoints: ['足三里', '中脘'], health: '暑气上升，注意饮食卫生' },
  { name: '大暑', month: 7, season: '夏', element: '土', body: '脾胃', organs: ['脾', '心'], principle: '清暑益气，养心安神', foods: ['绿豆汤', '莲子', '冬瓜', '苦瓜'], avoid: ['烈日下劳作'], acupoints: ['神门', '内关'], health: '一年中最热，宜避暑养心' },
  { name: '立秋', month: 8, season: '秋', element: '金', body: '肺', organs: ['肺', '大肠'], principle: '养肺润燥，滋阴清热', foods: ['雪梨', '银耳', '百合', '蜂蜜'], avoid: ['辛辣燥热'], acupoints: ['肺俞', '太渊', '合谷'], health: '秋气始收，宜润肺防燥' },
  { name: '处暑', month: 8, season: '秋', element: '金', body: '肺', organs: ['肺', '脾'], principle: '润肺健脾，养阴生津', foods: ['银耳', '莲子', '雪梨', '百合'], avoid: ['辛辣油腻'], acupoints: ['肺俞', '足三里'], health: '暑气将止，秋意渐起' },
  { name: '白露', month: 9, season: '秋', element: '金', body: '肺', organs: ['肺', '肾'], principle: '养肺固肾，润燥生津', foods: ['龙眼', '红枣', '莲子', '银耳'], avoid: ['生冷瓜果'], acupoints: ['太溪', '肺俞', '足三里'], health: '白露秋分夜，一夜冷一夜' },
  { name: '秋分', month: 9, season: '秋', element: '金', body: '肺', organs: ['肺', '大肠'], principle: '润肺养阴，平衡阴阳', foods: ['雪梨', '蜂蜜', '银耳', '芝麻'], avoid: ['辛热上火'], acupoints: ['肺俞', '合谷'], health: '昼夜等分，宜调和肺气' },
  { name: '寒露', month: 10, season: '秋', element: '金', body: '肺', organs: ['肺', '肾'], principle: '养阴润肺，金水相生', foods: ['山药', '莲子', '百合', '芝麻'], avoid: ['辛辣', '寒凉'], acupoints: ['太溪', '肺俞'], health: '露水更冷，注意添衣' },
  { name: '霜降', month: 10, season: '秋', element: '土', body: '脾胃', organs: ['脾', '胃'], principle: '健脾养胃，润燥养肺', foods: ['山药', '大枣', '栗子', '南瓜'], avoid: ['生冷寒凉'], acupoints: ['足三里', '中脘'], health: '初霜出现，进补佳时' },
  { name: '立冬', month: 11, season: '冬', element: '水', body: '肾', organs: ['肾', '膀胱'], principle: '温肾助阳，封藏为本', foods: ['羊肉', '韭菜', '核桃', '桂圆'], avoid: ['生冷寒凉'], acupoints: ['关元', '命门', '涌泉'], health: '冬藏开始，进补养肾' },
  { name: '小雪', month: 11, season: '冬', element: '水', body: '肾', organs: ['肾', '心'], principle: '温肾养心，藏精安神', foods: ['黑芝麻', '核桃', '羊肉', '当归'], avoid: ['生冷', '辛辣'], acupoints: ['神门', '涌泉'], health: '气温下降，注意保暖' },
  { name: '大雪', month: 12, season: '冬', element: '水', body: '肾', organs: ['肾', '心'], principle: '温阳散寒，养肾防寒', foods: ['羊肉', '生姜', '红枣', '桂圆'], avoid: ['冰凉食物'], acupoints: ['关元', '命门'], health: '大雪封藏，进补强身' },
  { name: '冬至', month: 12, season: '冬', element: '水', body: '肾', organs: ['肾', '心'], principle: '温阳补肾，养阴固本', foods: ['饺子', '羊肉', '汤圆', '坚果'], avoid: ['生冷寒凉'], acupoints: ['关元', '气海', '足三里'], health: '一阳初生，最宜进补' },
];

// 获取当前节气
export function getCurrentSolarTerm(date: Date = new Date()): SolarTerm {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // 简化的节气判断（基于近似日期）
  const boundaries: { name: string; m: number; d: number }[] = [
    { name: '小寒', m: 1, d: 5 }, { name: '大寒', m: 1, d: 20 },
    { name: '立春', m: 2, d: 4 }, { name: '雨水', m: 2, d: 19 },
    { name: '惊蛰', m: 3, d: 5 }, { name: '春分', m: 3, d: 20 },
    { name: '清明', m: 4, d: 5 }, { name: '谷雨', m: 4, d: 20 },
    { name: '立夏', m: 5, d: 5 }, { name: '小满', m: 5, d: 21 },
    { name: '芒种', m: 6, d: 6 }, { name: '夏至', m: 6, d: 21 },
    { name: '小暑', m: 7, d: 7 }, { name: '大暑', m: 7, d: 23 },
    { name: '立秋', m: 8, d: 7 }, { name: '处暑', m: 8, d: 23 },
    { name: '白露', m: 9, d: 7 }, { name: '秋分', m: 9, d: 23 },
    { name: '寒露', m: 10, d: 8 }, { name: '霜降', m: 10, d: 23 },
    { name: '立冬', m: 11, d: 7 }, { name: '小雪', m: 11, d: 22 },
    { name: '大雪', m: 12, d: 7 }, { name: '冬至', m: 12, d: 22 },
  ];
  let current = '小寒';
  for (let i = boundaries.length - 1; i >= 0; i--) {
    const b = boundaries[i];
    if (month > b.m || (month === b.m && day >= b.d)) {
      current = b.name;
      break;
    }
  }
  return SOLAR_TERMS.find(s => s.name === current) || SOLAR_TERMS[0];
}
