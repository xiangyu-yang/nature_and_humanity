// 穴位数据库 - 常用108穴位精选

export interface Acupoint {
  id: string;
  name: string;
  pinyin: string;
  code: string; // 穴位代码 如 LI4
  meridian: string; // 所属经络
  category: 'head' | 'body' | 'limbs';
  location: string;
  effect: string[];
  indications: string[];
  method: string; // 按摩手法
  duration: string; // 时长
  caution?: string;
}

export const ACUPOINTS: Acupoint[] = [
  // 头部
  { id: 'yintang', name: '印堂', pinyin: 'yìn táng', code: 'EX-HN3', meridian: '经外奇穴', category: 'head',
    location: '两眉头连线的中点',
    effect: ['清头目', '安神定惊', '疏风清热'],
    indications: ['头痛', '眩晕', '失眠', '鼻炎', '目赤肿痛'],
    method: '用拇指或食指指腹按揉，力度由轻渐重',
    duration: '每次3-5分钟，每日2-3次',
    caution: '皮肤破损处禁用' },

  { id: 'baihui', name: '百会', pinyin: 'bǎi huì', code: 'GV20', meridian: '督脉', category: 'head',
    location: '头顶正中线与两耳尖连线的交点处',
    effect: ['升阳举陷', '醒脑开窍', '安神定志'],
    indications: ['头痛', '眩晕', '失眠', '健忘', '脱肛', '高血压'],
    method: '用掌心或指端按揉，亦可艾灸',
    duration: '每次3-5分钟',
    caution: '高血压患者慎用力按' },

  { id: 'taiyang', name: '太阳', pinyin: 'tài yáng', code: 'EX-HN5', meridian: '经外奇穴', category: 'head',
    location: '眉梢与目外眦之间，向后约一横指的凹陷处',
    effect: ['清肝明目', '通络止痛'],
    indications: ['头痛', '目赤肿痛', '面瘫', '感冒'],
    method: '用拇指或食指按揉，或上下推',
    duration: '每次3-5分钟',
    caution: '力度适中，不宜过重' },

  { id: 'fengchi', name: '风池', pinyin: 'fēng chí', code: 'GB20', meridian: '足少阳胆经', category: 'head',
    location: '项部，枕骨之下，胸锁乳突肌与斜方肌上端之间的凹陷处',
    effect: ['平肝熄风', '通利官窍'],
    indications: ['头痛', '眩晕', '感冒', '颈项强痛', '高血压'],
    method: '用拇指和食指相对捏拿',
    duration: '每次3-5分钟' },

  // 躯干
  { id: 'dazhui', name: '大椎', pinyin: 'dà zhuī', code: 'GV14', meridian: '督脉', category: 'body',
    location: '后正中线上，第七颈椎棘突下凹陷中',
    effect: ['清热泻火', '振奋阳气'],
    indications: ['感冒', '发热', '项强', '咳嗽', '哮喘'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟，艾灸10-15分钟' },

  { id: 'feishu', name: '肺俞', pinyin: 'fèi shū', code: 'BL13', meridian: '足太阳膀胱经', category: 'body',
    location: '背部，第3胸椎棘突下，旁开1.5寸',
    effect: ['调理肺气', '止咳平喘'],
    indications: ['咳嗽', '哮喘', '鼻塞', '感冒'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟' },

  { id: 'ganshu', name: '肝俞', pinyin: 'gān shū', code: 'BL18', meridian: '足太阳膀胱经', category: 'body',
    location: '背部，第9胸椎棘突下，旁开1.5寸',
    effect: ['疏肝理气', '清肝明目'],
    indications: ['胁痛', '目赤', '头晕', '月经不调'],
    method: '按揉',
    duration: '每次3-5分钟' },

  { id: 'mingmen', name: '命门', pinyin: 'mìng mén', code: 'GV4', meridian: '督脉', category: 'body',
    location: '腰部，后正中线上，第2腰椎棘突下凹陷中',
    effect: ['温肾壮阳', '强腰固本'],
    indications: ['腰痛', '阳痿', '遗精', '月经不调', '五更泻'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟，艾灸10-15分钟' },

  { id: 'shenque', name: '神阙', pinyin: 'shén què', code: 'CV8', meridian: '任脉', category: 'body',
    location: '腹中部，脐中央',
    effect: ['温阳救逆', '健脾和胃'],
    indications: ['腹痛', '泄泻', '虚脱', '水肿'],
    method: '艾灸为主',
    duration: '艾灸10-20分钟',
    caution: '此穴禁针' },

  { id: 'zhongwan', name: '中脘', pinyin: 'zhōng wǎn', code: 'CV12', meridian: '任脉', category: 'body',
    location: '上腹部，前正中线上，脐上4寸',
    effect: ['健脾和胃', '理气化湿'],
    indications: ['胃痛', '腹胀', '呕吐', '泄泻', '消化不良'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟' },

  { id: 'guanyuan', name: '关元', pinyin: 'guān yuán', code: 'CV4', meridian: '任脉', category: 'body',
    location: '下腹部，前正中线上，脐下3寸',
    effect: ['培元固本', '温肾壮阳'],
    indications: ['遗尿', '阳痿', '月经不调', '虚劳', '泄泻'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟' },

  { id: 'qihai', name: '气海', pinyin: 'qì hǎi', code: 'CV6', meridian: '任脉', category: 'body',
    location: '下腹部，前正中线上，脐下1.5寸',
    effect: ['益气助阳', '调理气机'],
    indications: ['气虚', '腹痛', '泄泻', '月经不调', '虚脱'],
    method: '按揉或艾灸',
    duration: '每次3-5分钟' },

  { id: 'danzhong', name: '膻中', pinyin: 'dàn zhōng', code: 'CV17', meridian: '任脉', category: 'body',
    location: '胸部，前正中线上，平第4肋间，两乳头连线的中点',
    effect: ['宽胸理气', '宁心安神'],
    indications: ['胸闷', '心悸', '咳嗽', '气喘', '乳少'],
    method: '按揉',
    duration: '每次3-5分钟' },

  // 四肢
  { id: 'hegu', name: '合谷', pinyin: 'hé gǔ', code: 'LI4', meridian: '手阳明大肠经', category: 'limbs',
    location: '手背，第1、2掌骨间，第2掌骨桡侧中点处',
    effect: ['疏风解表', '通络止痛'],
    indications: ['头痛', '牙痛', '面瘫', '感冒', '咽喉肿痛', '便秘'],
    method: '用拇指按揉对侧合谷',
    duration: '每次3-5分钟',
    caution: '孕妇禁用' },

  { id: 'neiguan', name: '内关', pinyin: 'nèi guān', code: 'PC6', meridian: '手厥阴心包经', category: 'limbs',
    location: '前臂掌侧，腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间',
    effect: ['宁心安神', '理气止痛'],
    indications: ['心悸', '胸闷', '胃痛', '呕吐', '失眠', '晕车'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },

  { id: 'shenmen', name: '神门', pinyin: 'shén mén', code: 'HT7', meridian: '手少阴心经', category: 'limbs',
    location: '腕部，腕掌侧横纹尺侧端，尺侧腕屈肌腱的桡侧凹陷处',
    effect: ['宁心安神', '通经活络'],
    indications: ['失眠', '心悸', '健忘', '焦虑'],
    method: '用拇指按揉',
    duration: '每次3-5分钟，睡前按揉效果尤佳' },

  { id: 'zusanli', name: '足三里', pinyin: 'zú sān lǐ', code: 'ST36', meridian: '足阳明胃经', category: 'limbs',
    location: '小腿外侧，犊鼻下3寸，胫骨前嵴外1横指处',
    effect: ['健脾和胃', '扶正培元', '通经活络'],
    indications: ['胃痛', '腹胀', '泄泻', '便秘', '虚劳', '保健要穴'],
    method: '用拇指按揉或艾灸',
    duration: '每次3-5分钟，每日2-3次' },

  { id: 'sanyinjiao', name: '三阴交', pinyin: 'sān yīn jiāo', code: 'SP6', meridian: '足太阴脾经', category: 'limbs',
    location: '小腿内侧，内踝尖上3寸，胫骨内侧缘后际',
    effect: ['健脾益血', '调肝补肾'],
    indications: ['月经不调', '失眠', '带下', '阳痿', '遗精', '湿疹'],
    method: '用拇指按揉',
    duration: '每次3-5分钟',
    caution: '孕妇禁用' },

  { id: 'taixi', name: '太溪', pinyin: 'tài xī', code: 'KI3', meridian: '足少阴肾经', category: 'limbs',
    location: '足内侧，内踝后方，内踝尖与跟腱之间的凹陷处',
    effect: ['滋阴益肾', '壮阳强腰'],
    indications: ['腰膝酸软', '头晕', '耳鸣', '阳痿', '月经不调'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },

  { id: 'taichong', name: '太冲', pinyin: 'tài chōng', code: 'LR3', meridian: '足厥阴肝经', category: 'limbs',
    location: '足背，第1、2跖骨间，跖骨底结合部前方凹陷中',
    effect: ['疏肝理气', '平肝潜阳'],
    indications: ['头痛', '眩晕', '胁痛', '月经不调', '高血压', '易怒'],
    method: '用拇指按揉',
    duration: '每次3-5分钟',
    caution: '孕妇慎用' },

  { id: 'yongquan', name: '涌泉', pinyin: 'yǒng quán', code: 'KI1', meridian: '足少阴肾经', category: 'limbs',
    location: '足底，屈足卷趾时足心最凹陷处',
    effect: ['滋阴降火', '醒脑开窍'],
    indications: ['失眠', '高血压', '头痛', '眩晕', '便秘'],
    method: '用手掌搓热按摩足底，或艾灸',
    duration: '每次3-5分钟，睡前按摩效果尤佳' },

  { id: 'fenglong', name: '丰隆', pinyin: 'fēng lóng', code: 'ST40', meridian: '足阳明胃经', category: 'limbs',
    location: '小腿外侧，外踝尖上8寸，胫骨前肌外缘',
    effect: ['化痰祛湿', '和胃降逆'],
    indications: ['痰多', '咳嗽', '眩晕', '肥胖', '痰湿体质'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },

  { id: 'yinlingquan', name: '阴陵泉', pinyin: 'yīn líng quán', code: 'SP9', meridian: '足太阴脾经', category: 'limbs',
    location: '小腿内侧，胫骨内侧髁后下方凹陷处',
    effect: ['健脾利湿', '通利小便'],
    indications: ['腹胀', '泄泻', '水肿', '小便不利', '带下'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },

  { id: 'qimen', name: '期门', pinyin: 'qī mén', code: 'LR14', meridian: '足厥阴肝经', category: 'body',
    location: '胸部，第6肋间隙，前正中线旁开4寸',
    effect: ['疏肝理气', '健脾和胃'],
    indications: ['胁痛', '胸闷', '胃痛', '月经不调'],
    method: '按揉',
    duration: '每次3-5分钟' },

  { id: 'quchi', name: '曲池', pinyin: 'qū chí', code: 'LI11', meridian: '手阳明大肠经', category: 'limbs',
    location: '肘部，屈肘成直角，肘横纹外侧端凹陷中',
    effect: ['清热泻火', '疏风解表'],
    indications: ['发热', '咽喉肿痛', '湿疹', '高血压', '手臂痹痛'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },

  { id: 'xuehai', name: '血海', pinyin: 'xuè hǎi', code: 'SP10', meridian: '足太阴脾经', category: 'limbs',
    location: '大腿内侧，髌底内侧端上2寸',
    effect: ['活血化瘀', '健脾化湿'],
    indications: ['月经不调', '湿疹', '荨麻疹', '血瘀'],
    method: '用拇指按揉',
    duration: '每次3-5分钟' },
];

export const ACUPOINT_CATEGORIES = {
  head: '头部穴位',
  body: '躯干穴位',
  limbs: '四肢穴位',
};

export function getAcupointById(id: string): Acupoint | undefined {
  return ACUPOINTS.find(a => a.id === id);
}

export function getAcupointsByCategory(cat: 'head' | 'body' | 'limbs'): Acupoint[] {
  return ACUPOINTS.filter(a => a.category === cat);
}

export function searchAcupoints(keyword: string): Acupoint[] {
  if (!keyword) return ACUPOINTS;
  const kw = keyword.toLowerCase();
  return ACUPOINTS.filter(a =>
    a.name.includes(keyword) ||
    a.pinyin.toLowerCase().includes(kw) ||
    a.code.toLowerCase().includes(kw) ||
    a.effect.some(e => e.includes(keyword)) ||
    a.indications.some(i => i.includes(keyword))
  );
}
