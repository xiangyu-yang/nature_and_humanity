import { Router } from 'express';
import { z } from 'zod';
import { CONSTITUTION_INFO } from '../engines/constitution.js';
import { getCurrentSolarTerm } from '../engines/solar.js';

export const wellnessRouter = Router();

const wellnessSchema = z.object({
  constitution: z.string().optional(),
  dayMasterWuxing: z.string().optional(),
});

wellnessRouter.post('/', (req, res) => {
  const parse = wellnessSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ code: 400, message: '参数错误' });
  const { constitution, dayMasterWuxing } = parse.data;
  const term = getCurrentSolarTerm();

  // 起居建议
  const daily = getDailyAdvice(constitution, term);
  // 运动建议
  const sport = getSportAdvice(constitution);
  // 情志建议
  const emotion = getEmotionAdvice(constitution);
  // 节气建议
  const seasonal = getSeasonalAdvice(term);

  res.json({ code: 0, data: { daily, sport, emotion, seasonal, term } });
});

function getDailyAdvice(constitution: string | undefined, term: any) {
  const baseAdvice = [
    { title: '早睡早起', desc: '顺应日出而作日落而息，子时（23:00-1:00）前入睡最养阴', icon: '🌙', priority: 'high' },
    { title: '晨起喝温水', desc: '温阳通络，唤醒五脏六腑，建议300-500ml', icon: '💧', priority: 'high' },
    { title: '午时小憩', desc: '11:00-13:00 短暂闭目养神15-30分钟，养心护肝', icon: '☯', priority: 'medium' },
  ];
  const constitutionSpecific: Record<string, { title: string; desc: string; icon: string; priority: string }[]> = {
    气虚质: [
      { title: '避免过劳', desc: '减少剧烈运动和过度劳累，宜劳逸结合', icon: '⚖', priority: 'high' },
      { title: '保暖避风', desc: '气虚易感风寒，注意颈部腰部保暖', icon: '🧣', priority: 'high' },
    ],
    阳虚质: [
      { title: '早睡晚起', desc: '冬季阳气收藏，宜早睡晚起以待阳光', icon: '❄', priority: 'high' },
      { title: '艾灸关元', desc: '每日艾灸关元、命门10-15分钟温阳', icon: '🔥', priority: 'high' },
    ],
    阴虚质: [
      { title: '避免熬夜', desc: '子时不睡易耗阴液，建议23:00前入睡', icon: '🌙', priority: 'high' },
      { title: '保持环境湿润', desc: '室内可放置加湿器，避免燥热伤阴', icon: '💧', priority: 'medium' },
    ],
    痰湿质: [
      { title: '饮食清淡', desc: '少油少糖，多吃薏米、冬瓜等利湿食物', icon: '🥗', priority: 'high' },
      { title: '远离潮湿', desc: '避免长期处于潮湿环境，保持居室干燥', icon: '☀', priority: 'medium' },
    ],
    湿热质: [
      { title: '戒酒少辣', desc: '酒与辛辣加重湿热，应严格控制', icon: '🌶', priority: 'high' },
      { title: '多饮清茶', desc: '菊花茶、荷叶茶清热利湿', icon: '🍵', priority: 'medium' },
    ],
    血瘀质: [
      { title: '动则生阳', desc: '每日运动30分钟以上，促进气血运行', icon: '🏃', priority: 'high' },
      { title: '睡前泡脚', desc: '用温水或艾叶水泡脚20分钟，活血化瘀', icon: '🛁', priority: 'high' },
    ],
    气郁质: [
      { title: '远离郁怒', desc: '保持心情舒畅，避免长期情绪压抑', icon: '🌸', priority: 'high' },
      { title: '多听角音', desc: '角音疏肝，可多听宫商角徵羽之角调音乐', icon: '🎵', priority: 'medium' },
    ],
    特禀质: [
      { title: '避过敏原', desc: '远离花粉、尘螨等已知过敏原', icon: '🌿', priority: 'high' },
      { title: '饮食清淡', desc: '少吃海鲜发物，避免过敏加重', icon: '🥬', priority: 'high' },
    ],
    平和质: [
      { title: '顺时养生', desc: '顺应四时，起居有常，饮食有节', icon: '🌿', priority: 'medium' },
    ],
  };

  return {
    items: [
      ...baseAdvice,
      ...(constitutionSpecific[constitution || '平和质'] || []),
    ],
  };
}

function getSportAdvice(constitution: string | undefined) {
  const defaultSport = {
    type: '八段锦 / 太极 / 慢跑',
    intensity: '中等强度，微微出汗',
    frequency: '每周 3-5 次',
    duration: '每次 30-60 分钟',
    bestTime: '晨起（7-9点）或傍晚（17-19点）',
    note: '运动前后注意拉伸，避免大汗淋漓',
  };
  const sportByConstitution: Record<string, any> = {
    气虚质: { type: '散步、慢跑、太极', intensity: '轻中强度', frequency: '每周 3-4 次', duration: '每次 30-45 分钟', bestTime: '上午 9-11 点', note: '避免剧烈运动和大汗出' },
    阳虚质: { type: '动则生阳类：跑步、跳绳、爬山', intensity: '中等偏高强度', frequency: '每周 4-5 次', duration: '每次 30-60 分钟', bestTime: '上午阳光下', note: '阳虚需多动以助阳' },
    阴虚质: { type: '游泳、瑜伽、太极', intensity: '中低强度', frequency: '每周 3-4 次', duration: '每次 30-45 分钟', bestTime: '傍晚 17-19 点', note: '避免大汗出伤阴' },
    痰湿质: { type: '长时间有氧：慢跑、游泳、爬山', intensity: '中高强度', frequency: '每周 5 次以上', duration: '每次 45-60 分钟', bestTime: '下午 14-17 点', note: '出汗有助于化湿' },
    湿热质: { type: '高强度有氧：跑步、球类', intensity: '高强度', frequency: '每周 5 次', duration: '每次 45-60 分钟', bestTime: '上午或傍晚', note: '出汗清热，忌长期待在湿热环境' },
    血瘀质: { type: '促进气血运行：舞蹈、跑步、瑜伽', intensity: '中等强度', frequency: '每周 4-5 次', duration: '每次 30-60 分钟', bestTime: '下午 14-17 点', note: '坚持运动是关键' },
    气郁质: { type: '户外有氧：跑步、爬山、游泳', intensity: '中等偏高', frequency: '每周 4-5 次', duration: '每次 45-60 分钟', bestTime: '上午阳光充足时', note: '户外运动疏解郁结' },
    特禀质: { type: '温和运动：散步、太极、瑜伽', intensity: '轻中强度', frequency: '每周 3-4 次', duration: '每次 30-45 分钟', bestTime: '上午 9-11 点', note: '注意环境，避免过敏原' },
  };
  return sportByConstitution[constitution || '平和质'] || defaultSport;
}

function getEmotionAdvice(constitution: string | undefined) {
  const emotionMap: Record<string, any> = {
    气虚质: { principle: '思虑伤脾，避免过度思虑', method: ['冥想打坐', '读书静心', '与亲友交流'], tip: '气虚者宜少思多行，行动强于思虑' },
    阳虚质: { principle: '心阳不足，易生忧郁', method: ['晒太阳', '多聚会', '听欢快音乐'], tip: '阳虚者宜广交好友，激发活力' },
    阴虚质: { principle: '阴虚火旺，易烦躁', method: ['静坐冥想', '书法绘画', '听羽音'], tip: '阴虚者宜静养，避免急躁发怒' },
    痰湿质: { principle: '痰蒙心窍，易倦怠', method: ['运动出汗', '社交活动', '听角音音乐'], tip: '痰湿者宜动不宜静' },
    湿热质: { principle: '湿热扰心，易烦躁', method: ['运动发泄', '山林静坐', '听商音'], tip: '湿热者宜疏导情绪，发汗解郁' },
    血瘀质: { principle: '气滞血瘀，易生郁怒', method: ['旅游放松', '运动疏解', '玫瑰花茶'], tip: '血瘀者宜行气活血' },
    气郁质: { principle: '肝气郁结，易抑郁', method: ['户外散步', '集体活动', '听角音音乐'], tip: '气郁者宜疏肝解郁，多与朋友倾诉' },
    特禀质: { principle: '禀赋特异，易紧张', method: ['规律作息', '冥想放松', '环境舒适'], tip: '特禀者宜稳守心神，避免压力' },
    平和质: { principle: '阴阳协调', method: ['任何适宜活动', '保持乐观', '与人为善'], tip: '平和质者宜保持现状' },
  };
  return emotionMap[constitution || '平和质'] || emotionMap['平和质'];
}

function getSeasonalAdvice(term: any) {
  return {
    term: term.name,
    season: term.season,
    principle: term.principle,
    body: term.body,
    organs: term.organs,
    foods: term.foods,
    avoid: term.avoid,
    acupoints: term.acupoints,
    health: term.health,
  };
}
