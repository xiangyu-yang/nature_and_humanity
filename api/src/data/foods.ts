// 食疗数据库

export interface FoodItem {
  id: string;
  name: string;
  nature: string; // 性
  flavor: string; // 味
  meridian: string; // 归经
  effect: string;
  suitable: string[]; // 适合体质
  avoid: string[]; // 禁忌
  season?: string;
  recipes?: { name: string; ingredients: string[]; steps: string }[];
}

export const FOODS: FoodItem[] = [
  // === 适合气虚质 ===
  { id: 'huangqi', name: '黄芪', nature: '微温', flavor: '甘', meridian: '脾、肺', effect: '补气升阳，固表止汗', suitable: ['气虚质', '阳虚质'], avoid: ['阴虚火旺', '湿热质'] },
  { id: 'shanyao', name: '山药', nature: '平', flavor: '甘', meridian: '脾、肺、肾', effect: '补脾养肺，益肾涩精', suitable: ['气虚质', '阴虚质', '平和质'], avoid: ['湿盛中满'] },
  { id: 'dazao', name: '大枣', nature: '温', flavor: '甘', meridian: '脾、胃', effect: '补中益气，养血安神', suitable: ['气虚质', '血瘀质'], avoid: ['湿热质', '痰湿质'] },
  { id: 'jirou', name: '鸡肉', nature: '温', flavor: '甘', meridian: '脾、胃', effect: '温中益气，补精填髓', suitable: ['气虚质', '阳虚质', '平和质'], avoid: ['肝阳上亢'] },

  // === 适合阳虚质 ===
  { id: 'shengjiang', name: '生姜', nature: '微温', flavor: '辛', meridian: '肺、脾、胃', effect: '温中散寒，回阳通脉', suitable: ['阳虚质', '气虚质'], avoid: ['阴虚火旺', '孕妇'] },
  { id: 'yangrou', name: '羊肉', nature: '温', flavor: '甘', meridian: '脾、肾', effect: '温中暖肾，益气补虚', suitable: ['阳虚质', '气虚质'], avoid: ['湿热质', '阴虚质', '痰湿质'] },
  { id: 'jiucai', name: '韭菜', nature: '温', flavor: '辛', meridian: '肝、肾', effect: '温中开胃，行气活血', suitable: ['阳虚质', '气郁质'], avoid: ['阴虚火旺', '孕妇'] },
  { id: 'hetao', name: '核桃', nature: '温', flavor: '甘', meridian: '肾、肺', effect: '补肾温肺，润肠通便', suitable: ['阳虚质', '气虚质'], avoid: ['痰热咳嗽'] },
  { id: 'rougui', name: '肉桂', nature: '大热', flavor: '辛、甘', meridian: '肾、脾、心、肝', effect: '补火助阳，散寒止痛', suitable: ['阳虚质'], avoid: ['阴虚火旺', '孕妇', '出血'] },
  { id: 'guiyuan', name: '桂圆', nature: '温', flavor: '甘', meridian: '心、脾', effect: '补益心脾，养血安神', suitable: ['气虚质', '血瘀质'], avoid: ['阴虚火旺', '湿热质'] },

  // === 适合阴虚质 ===
  { id: 'yiner', name: '银耳', nature: '平', flavor: '甘、淡', meridian: '肺、胃、肾', effect: '滋阴润肺，养胃生津', suitable: ['阴虚质', '平和质'], avoid: ['风寒咳嗽'] },
  { id: 'baihe', name: '百合', nature: '微寒', flavor: '甘', meridian: '心、肺', effect: '养阴润肺，清心安神', suitable: ['阴虚质', '气郁质'], avoid: ['风寒咳嗽'] },
  { id: 'maidong', name: '麦冬', nature: '微寒', flavor: '甘、微苦', meridian: '心、肺、胃', effect: '养阴生津，润肺清心', suitable: ['阴虚质'], avoid: ['脾胃虚寒'] },
  { id: 'li', name: '梨', nature: '凉', flavor: '甘、微酸', meridian: '肺、胃', effect: '生津润燥，清热化痰', suitable: ['阴虚质', '湿热质'], avoid: ['脾胃虚寒', '阳虚质'] },
  { id: 'yajiao', name: '鸭肉', nature: '凉', flavor: '甘', meridian: '脾、胃、肺、肾', effect: '养胃滋阴，清虚热', suitable: ['阴虚质'], avoid: ['脾胃虚寒', '阳虚质'] },

  // === 适合痰湿质 / 湿热质 ===
  { id: 'yimi', name: '薏米', nature: '凉', flavor: '甘、淡', meridian: '脾、胃、肺', effect: '利水渗湿，健脾止泻', suitable: ['痰湿质', '湿热质'], avoid: ['孕妇', '阴虚质'] },
  { id: 'donggua', name: '冬瓜', nature: '凉', flavor: '甘、淡', meridian: '肺、大肠、膀胱', effect: '利尿清热，化痰生津', suitable: ['痰湿质', '湿热质', '阴虚质'], avoid: ['阳虚质'] },
  { id: 'lvdou', name: '绿豆', nature: '寒', flavor: '甘', meridian: '心、胃', effect: '清热解毒，消暑利水', suitable: ['湿热质', '阴虚质'], avoid: ['阳虚质', '脾胃虚寒'] },
  { id: 'kugua', name: '苦瓜', nature: '寒', flavor: '苦', meridian: '心、脾、胃', effect: '清热解暑，明目解毒', suitable: ['湿热质', '阴虚质'], avoid: ['阳虚质', '脾胃虚寒'] },
  { id: 'bai luobo', name: '白萝卜', nature: '凉', flavor: '辛、甘', meridian: '肺、脾、胃', effect: '消食化痰，顺气宽中', suitable: ['痰湿质', '气郁质', '湿热质'], avoid: ['气虚质', '阳虚质'] },
  { id: 'chixiaodou', name: '赤小豆', nature: '平', flavor: '甘、酸', meridian: '心、小肠', effect: '利水消肿，解毒排脓', suitable: ['痰湿质', '湿热质'], avoid: ['阴虚质'] },
  { id: 'fuling', name: '茯苓', nature: '平', flavor: '甘、淡', meridian: '心、肺、脾、肾', effect: '利水渗湿，健脾安神', suitable: ['痰湿质', '气虚质', '湿热质'], avoid: ['阴虚火旺'] },

  // === 适合血瘀质 ===
  { id: 'shanzha', name: '山楂', nature: '微温', flavor: '酸、甘', meridian: '脾、胃、肝', effect: '消食化积，活血散瘀', suitable: ['血瘀质', '气郁质'], avoid: ['脾胃虚寒', '孕妇'] },
  { id: 'honghua', name: '红花', nature: '温', flavor: '辛', meridian: '心、肝', effect: '活血通经，散瘀止痛', suitable: ['血瘀质'], avoid: ['孕妇', '月经过多', '出血'] },
  { id: 'mu er', name: '黑木耳', nature: '平', flavor: '甘', meridian: '胃、大肠', effect: '补气养血，润肺止血', suitable: ['血瘀质', '阴虚质', '平和质'], avoid: ['孕妇慎用'] },
  { id: 'yangcong', name: '洋葱', nature: '温', flavor: '辛、甘', meridian: '肝、脾、胃、肺', effect: '理气和胃，散寒解毒', suitable: ['气郁质', '血瘀质', '阳虚质'], avoid: ['阴虚火旺'] },
  { id: 'hongtang', name: '红糖', nature: '温', flavor: '甘', meridian: '脾、胃、肝', effect: '补中缓急，活血化瘀', suitable: ['血瘀质', '阳虚质'], avoid: ['阴虚火旺', '糖尿病'] },

  // === 适合气郁质 ===
  { id: 'chenpi', name: '陈皮', nature: '温', flavor: '辛、苦', meridian: '脾、肺', effect: '理气健脾，燥湿化痰', suitable: ['气郁质', '痰湿质'], avoid: ['阴虚火旺'] },
  { id: 'meiguihua', name: '玫瑰花', nature: '温', flavor: '甘、微苦', meridian: '肝、脾', effect: '行气解郁，活血止痛', suitable: ['气郁质', '血瘀质'], avoid: ['阴虚火旺'] },
  { id: 'foshou', name: '佛手', nature: '温', flavor: '辛、苦', meridian: '肝、脾、胃、肺', effect: '疏肝理气，和胃止痛', suitable: ['气郁质'], avoid: ['阴虚火旺'] },
  { id: 'ganju', name: '柑橘', nature: '凉', flavor: '甘、酸', meridian: '肺、胃', effect: '生津止渴，理气健胃', suitable: ['气郁质', '阴虚质'], avoid: ['风寒咳嗽'] },

  // === 节气食疗 ===
  { id: 'qingshuang', name: '春笋', nature: '寒', flavor: '甘', meridian: '胃、大肠', effect: '清热化痰，益气和胃', suitable: ['湿热质', '痰湿质'], avoid: ['脾胃虚寒', '过敏'], season: '春' },
  { id: 'jicai', name: '荠菜', nature: '凉', flavor: '甘、淡', meridian: '肝、脾', effect: '清热利湿，凉血止血', suitable: ['湿热质', '阴虚质'], avoid: ['阳虚质'], season: '春' },
  { id: 'xiangchun', name: '香椿', nature: '凉', flavor: '苦、涩', meridian: '肝、胃、肾', effect: '清热解毒，健胃理气', suitable: ['湿热质'], avoid: ['阴虚火旺'], season: '春' },
  { id: 'lianzi', name: '莲子', nature: '平', flavor: '甘、涩', meridian: '心、脾、肾', effect: '补脾止泻，益肾涩精，养心安神', suitable: ['气虚质', '阴虚质', '平和质'], avoid: ['湿热质'], season: '夏' },
  { id: 'heizhima', name: '黑芝麻', nature: '平', flavor: '甘', meridian: '肝、肾、大肠', effect: '补肝肾，益精血，润肠燥', suitable: ['阴虚质', '阳虚质', '血瘀质'], avoid: ['脾虚便溏'] },
  { id: 'juhua', name: '菊花', nature: '微寒', flavor: '甘、苦', meridian: '肺、肝', effect: '散风清热，平肝明目', suitable: ['湿热质', '阴虚质', '气郁质'], avoid: ['阳虚质'], season: '秋' },
  { id: 'baihe', name: '百合', nature: '微寒', flavor: '甘', meridian: '心、肺', effect: '养阴润肺，清心安神', suitable: ['阴虚质', '气郁质'], avoid: ['风寒咳嗽'], season: '秋' },
  { id: 'lizi', name: '栗子', nature: '温', flavor: '甘', meridian: '脾、胃、肾', effect: '养胃健脾，补肾强筋', suitable: ['阳虚质', '气虚质'], avoid: ['湿热质'], season: '冬' },
  { id: 'mihoutao', name: '猕猴桃', nature: '寒', flavor: '酸、甘', meridian: '肾、胃', effect: '解热止渴，和胃降逆', suitable: ['阴虚质', '湿热质'], avoid: ['阳虚质', '脾胃虚寒'] },
  { id: 'xiaomi', name: '小米', nature: '凉', flavor: '甘、咸', meridian: '脾、胃、肾', effect: '健脾和胃，补益虚损', suitable: ['气虚质', '平和质', '阴虚质'], avoid: ['湿热质'] },
  { id: 'nangua', name: '南瓜', nature: '温', flavor: '甘', meridian: '脾、胃', effect: '补中益气，消炎止痛', suitable: ['气虚质', '阳虚质'], avoid: ['湿热质'] },
];

// 食疗方案生成
export function getFoodRecommendByConstitution(constitution: string): FoodItem[] {
  return FOODS.filter(f => f.suitable.includes(constitution as any)).slice(0, 12);
}

export function getFoodBySeason(season: string): FoodItem[] {
  return FOODS.filter(f => f.season === season).slice(0, 6);
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOODS.find(f => f.id === id);
}
