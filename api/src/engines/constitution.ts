// 中医九种体质辨识引擎

export type ConstitutionType =
  | '平和质'
  | '气虚质'
  | '阳虚质'
  | '阴虚质'
  | '痰湿质'
  | '湿热质'
  | '血瘀质'
  | '气郁质'
  | '特禀质';

export interface ConstitutionTrait {
  type: ConstitutionType;
  element: string;
  color: string;
  features: string;
  tendency: string;
  advice: string[];
  food: string[];
  avoid: string[];
  acupoints: string[];
  sport: string;
}

export const CONSTITUTION_INFO: Record<ConstitutionType, ConstitutionTrait> = {
  平和质: {
    type: '平和质',
    element: '土',
    color: '#D4A84B',
    features: '体形匀称健壮，面色润泽，精力充沛，睡眠良好，饮食正常，二便通畅。',
    tendency: '不易生病，对环境适应力强。',
    advice: ['保持规律作息', '饮食有节', '适当运动', '调畅情志'],
    food: ['五谷杂粮', '时令蔬菜', '适量水果', '优质蛋白'],
    avoid: ['过度进补', '偏食挑食'],
    acupoints: ['足三里', '气海', '关元'],
    sport: '八段锦、太极、慢跑等温和运动',
  },
  气虚质: {
    type: '气虚质',
    element: '土',
    color: '#A8902F',
    features: '容易疲乏，说话声音低弱，易感冒，食欲不振，易出汗。',
    tendency: '易患感冒、内脏下垂、慢性疲劳综合征。',
    advice: ['补气健脾', '避免过劳', '注意保暖', '规律作息'],
    food: ['山药', '黄芪', '大枣', '鸡肉', '粳米', '莲子'],
    avoid: ['生冷食物', '油腻厚味', '难消化食物'],
    acupoints: ['足三里', '气海', '关元', '百会'],
    sport: '散步、慢跑、太极等柔缓运动',
  },
  阳虚质: {
    type: '阳虚质',
    element: '水',
    color: '#3A6E7C',
    features: '怕冷，手脚冰凉，喜热饮，精神不振，大便溏薄。',
    tendency: '易患寒证、关节痛、痛经、阳痿。',
    advice: ['温阳散寒', '注意保暖', '艾灸调理', '多晒太阳'],
    food: ['生姜', '羊肉', '韭菜', '核桃', '桂圆', '肉桂'],
    avoid: ['冰冷食物', '寒性水果', '绿豆', '苦瓜'],
    acupoints: ['关元', '命门', '神阙', '足三里'],
    sport: '动则生阳：跑步、跳绳、爬楼梯',
  },
  阴虚质: {
    type: '阴虚质',
    element: '火',
    color: '#C8553D',
    features: '手足心热，口燥咽干，喜冷饮，大便干燥。',
    tendency: '易患干燥综合征、失眠、便秘、更年期综合征。',
    advice: ['滋阴润燥', '避免熬夜', '保持心情平和', '避免高温环境'],
    food: ['银耳', '百合', '麦冬', '梨', '蜂蜜', '鸭肉'],
    avoid: ['辛辣食物', '煎炸烧烤', '温热助阳食物'],
    acupoints: ['三阴交', '太溪', '照海', '涌泉'],
    sport: '避免大汗出：游泳、瑜伽、太极',
  },
  痰湿质: {
    type: '痰湿质',
    element: '土',
    color: '#967724',
    features: '体形肥胖，腹部松软，面部油多，痰多汗粘。',
    tendency: '易患高血脂、糖尿病、冠心病、痛风。',
    advice: ['化痰祛湿', '控制饮食', '加强运动', '远离潮湿环境'],
    food: ['薏米', '冬瓜', '荷叶', '白萝卜', '赤小豆', '茯苓'],
    avoid: ['甜食', '油炸食物', '肥肉', '冷饮'],
    acupoints: ['丰隆', '中脘', '足三里', '阴陵泉'],
    sport: '长时间有氧运动：慢跑、游泳、爬山',
  },
  湿热质: {
    type: '湿热质',
    element: '火',
    color: '#A6412C',
    features: '面油有痤疮，口苦口干，舌苔黄腻，身重困倦。',
    tendency: '易患痤疮、湿疹、黄疸、泌尿系感染。',
    advice: ['清热利湿', '清淡饮食', '戒烟限酒', '保持干燥'],
    food: ['绿豆', '薏米', '苦瓜', '冬瓜', '菊花', '荷叶'],
    avoid: ['辛辣油腻', '烟酒', '火锅', '烧烤'],
    acupoints: ['曲池', '阴陵泉', '丰隆', '合谷'],
    sport: '高强度运动以出汗清热',
  },
  血瘀质: {
    type: '血瘀质',
    element: '金',
    color: '#745C1A',
    features: '面色晦暗，易瘀斑，肤色暗沉，唇色紫暗。',
    tendency: '易患心脑血管疾病、肿瘤、痛经、月经不调。',
    advice: ['活血化瘀', '多运动', '保持心情舒畅', '注意保暖'],
    food: ['山楂', '红花', '玫瑰花', '黑木耳', '洋葱', '红糖'],
    avoid: ['生冷食物', '寒性食物', '收敛酸涩食物'],
    acupoints: ['血海', '膈俞', '三阴交', '合谷'],
    sport: '促进气血运行：舞蹈、跑步、瑜伽',
  },
  气郁质: {
    type: '气郁质',
    element: '木',
    color: '#5A8E4A',
    features: '情绪低落，敏感多虑，胸闷叹气，咽部异物感。',
    tendency: '易患抑郁症、失眠、乳腺增生、甲状腺疾病。',
    advice: ['疏肝理气', '调畅情志', '多与人交流', '多听音乐'],
    food: ['陈皮', '玫瑰花', '佛手', '柑橘', '洋葱', '萝卜'],
    avoid: ['收敛酸涩食物', '生冷食物', '咖啡因'],
    acupoints: ['太冲', '期门', '膻中', '内关'],
    sport: '户外运动：跑步、爬山、游泳',
  },
  特禀质: {
    type: '特禀质',
    element: '金',
    color: '#C9B87A',
    features: '易过敏，对气候、药物、食物过敏，皮肤瘙痒。',
    tendency: '易患过敏性鼻炎、哮喘、湿疹、荨麻疹。',
    advice: ['益气固表', '避免接触过敏原', '饮食清淡', '注意保暖'],
    food: ['黄芪', '山药', '大枣', '灵芝', '蜂蜜'],
    avoid: ['海鲜', '辛辣', '发物', '已知过敏食物'],
    acupoints: ['曲池', '血海', '足三里', '肺俞'],
    sport: '温和运动：散步、太极、瑜伽',
  },
};

// 60道标准化体质辨识题目（每个体质7-8题）
// 简化版本，每个体质 7 道题
export interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
  type: ConstitutionType;
}

export const QUESTIONS: Question[] = [
  // 平和质
  { id: 1, text: '您精力充沛吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '平和质' },
  { id: 2, text: '您容易疲乏吗？', options: [{ value: 5, label: '没有' }, { value: 4, label: '很少' }, { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是' }], type: '平和质' },
  { id: 3, text: '您说话声音低弱吗？', options: [{ value: 5, label: '没有' }, { value: 4, label: '很少' }, { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是' }], type: '平和质' },
  { id: 4, text: '您感到闷闷不乐、情绪低落吗？', options: [{ value: 5, label: '没有' }, { value: 4, label: '很少' }, { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是' }], type: '平和质' },
  { id: 5, text: '您比一般人耐受不了寒冷吗？', options: [{ value: 5, label: '没有' }, { value: 4, label: '很少' }, { value: 3, label: '有时' }, { value: 2, label: '经常' }, { value: 1, label: '总是' }], type: '平和质' },
  { id: 6, text: '您能适应外界自然环境变化吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '平和质' },
  { id: 7, text: '您睡眠良好吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '平和质' },

  // 气虚质
  { id: 8, text: '您容易疲乏吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 9, text: '您容易气短（呼吸短促）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 10, text: '您容易心慌吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 11, text: '您容易头晕或站起来眩晕吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 12, text: '您比别人容易感冒吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 13, text: '您喜欢安静、懒得说话吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },
  { id: 14, text: '您说话声音低弱吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气虚质' },

  // 阳虚质
  { id: 15, text: '您手脚发凉吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 16, text: '您胃脘部、背部或腰膝部怕冷吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 17, text: '您感到怕冷、衣服比别人穿得多吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 18, text: '您比一般人耐受不了寒冷吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 19, text: '您比别人容易患感冒吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 20, text: '您吃（喝）凉的东西会感到不舒服或怕吃（喝）凉的吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },
  { id: 21, text: '您受凉或吃（喝）凉的东西后，容易腹泻吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阳虚质' },

  // 阴虚质
  { id: 22, text: '您感到手脚心发热吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 23, text: '您感觉身体、脸上发热吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 24, text: '您皮肤或口唇干吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 25, text: '您口唇的颜色比一般人红吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 26, text: '您容易便秘或大便干燥吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 27, text: '您面部两颧潮红或偏红吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },
  { id: 28, text: '您感到眼睛干涩吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '阴虚质' },

  // 痰湿质
  { id: 29, text: '您感到胸闷或腹部胀满吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 30, text: '您感到身体沉重不轻松或不爽快吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 31, text: '您腹部肥满松软吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 32, text: '您有额部油脂分泌过多的现象吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 33, text: '您上眼睑比别人肿（上眼睑有轻微隆起）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 34, text: '您嘴里有黏黏的感觉吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },
  { id: 35, text: '您平时痰多，特别是感到咽喉部总有痰堵着吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '痰湿质' },

  // 湿热质
  { id: 36, text: '您面部或鼻部有油腻感或者油亮发光吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 37, text: '您容易生痤疮或疮疖吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 38, text: '您感到口苦或嘴里有异味吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 39, text: '您大便黏滞不爽、有解不尽的感觉吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 40, text: '您小便时尿道有发热感、尿色浓（深）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 41, text: '您带下色黄（白带颜色发黄）吗？（限女性回答）', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },
  { id: 42, text: '您的阴囊部位潮湿吗？（限男性回答）', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '湿热质' },

  // 血瘀质
  { id: 43, text: '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 44, text: '您两颧部有细微红丝吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 45, text: '您身体上有哪里疼痛吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 46, text: '您面色晦暗或容易出现褐斑吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 47, text: '您容易有黑眼圈吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 48, text: '您容易忘事（健忘）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },
  { id: 49, text: '您口唇颜色偏暗吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '血瘀质' },

  // 气郁质
  { id: 50, text: '您感到闷闷不乐、情绪低落吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 51, text: '您容易精神紧张、焦虑不安吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 52, text: '您多愁善感、感情脆弱吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 53, text: '您容易感到害怕或受到惊吓吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 54, text: '您胁肋部或乳房胀痛吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 55, text: '您无缘无故叹气吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },
  { id: 56, text: '您咽喉部有异物感，且吐之不出、咽之不下吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '气郁质' },

  // 特禀质
  { id: 57, text: '您没有感冒时也会打喷嚏吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 58, text: '您没有感冒时也会鼻塞、流鼻涕吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 59, text: '您有因季节变化、温度变化或异味等原因而咳喘的现象吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 60, text: '您容易过敏（药物、食物、气味、花粉、季节交替时、气候变化时）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 61, text: '您的皮肤容易起荨麻疹（风团、风疹块、风疙瘩）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 62, text: '您的皮肤因过敏出现过紫癜（紫红色瘀点、瘀斑）吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
  { id: 63, text: '您的皮肤一抓就红，并出现抓痕吗？', options: [{ value: 1, label: '没有' }, { value: 2, label: '很少' }, { value: 3, label: '有时' }, { value: 4, label: '经常' }, { value: 5, label: '总是' }], type: '特禀质' },
];

// 计算体质得分
export function evaluateConstitution(answers: Record<number, number>) {
  const scores: Record<ConstitutionType, number> = {
    平和质: 0, 气虚质: 0, 阳虚质: 0, 阴虚质: 0,
    痰湿质: 0, 湿热质: 0, 血瘀质: 0, 气郁质: 0, 特禀质: 0,
  };
  const counts: Record<ConstitutionType, number> = { ...scores };
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === 'number') {
      scores[q.type] += v;
      counts[q.type] += 1;
    }
  }
  // 计算转化分
  const transformed: Record<ConstitutionType, number> = { ...scores };
  for (const k of Object.keys(scores) as ConstitutionType[]) {
    if (counts[k] > 0) {
      transformed[k] = Math.round(((scores[k] - counts[k]) / (counts[k] * 4)) * 100);
    }
  }
  // 平和质≥60 其它均<40 判定为平和质
  // 其它体质≥40 判定为该体质倾向
  const sorted = (Object.entries(transformed) as [ConstitutionType, number][])
    .sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  const isPinghe = transformed['平和质'] >= 60 && sorted.slice(1).every(([_, v]) => v < 40);

  return {
    scores: transformed,
    rawScores: scores,
    primaryType: isPinghe ? '平和质' : primary,
    secondaryType: isPinghe ? null : (transformed[secondary] >= 30 ? secondary : null),
    isPinghe,
    ranking: sorted.map(([type, score]) => ({ type, score })),
  };
}
