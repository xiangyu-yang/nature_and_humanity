// API 客户端
const API_BASE = '/api';

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || (data && data.code && data.code !== 0)) {
    throw new ApiError(data?.code || res.status, data?.message || res.statusText);
  }
  return data as T;
}

export const api = {
  // 健康
  health: () => request<{ code: number; data: { status: string; service: string; time: string; version: string } }>('/health'),

  // 用户
  createUser: (data: UserInput) => request<{ code: number; data: User }>('/users', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id: string) => request<{ code: number; data: User }>(`/users/${id}`),
  updateUser: (id: string, data: Partial<UserInput>) => request<{ code: number; data: User }>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // 八字
  calcBazi: (userId: string, data: BaziInput) => request<{ code: number; data: BaziResult }>('/bazi', { method: 'POST', body: JSON.stringify({ userId, ...data }) }),

  // 紫微
  calcZiwei: (data: BaziInput) => request<{ code: number; data: ZiweiResult }>('/ziwei', { method: 'POST', body: JSON.stringify(data) }),

  // 体质
  getConstitutionQuestions: () => request<{ code: number; data: Question[] }>('/constitution/questions'),
  evaluateConstitution: (userId: string, answers: Record<string, number>) =>
    request<{ code: number; data: ConstitutionResult }>('/constitution/evaluate', { method: 'POST', body: JSON.stringify({ userId, answers }) }),
  getConstitutionTypes: () => request<{ code: number; data: ConstitutionTypeInfo[] }>('/constitution/types'),

  // 报告
  generateReport: (data: { birth: BaziInput; constitution: string | null }) =>
    request<{ code: number; data: ReportResult }>('/report', { method: 'POST', body: JSON.stringify(data) }),

  // 运势
  getTodayFortune: (userId?: string) => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request<{ code: number; data: DailyFortune }>(`/fortune/today${qs}`);
  },

  // 食疗
  getFoods: (params?: { search?: string; season?: string; constitution?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<{ code: number; data: FoodItem[] }>(`/food${qs}`);
  },
  getFoodRecommend: (constitution?: string) => {
    const qs = constitution ? `?constitution=${encodeURIComponent(constitution)}` : '';
    return request<{ code: number; data: { seasonal: FoodItem[]; term: any } | FoodItem[] }>(`/food/recommend${qs}`);
  },

  // 穴位
  getAcupoints: (params?: { category?: string; search?: string }) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<{ code: number; data: Acupoint[]; categories: Record<string, string> }>(`/acupoints${qs}`);
  },
  getAcupoint: (id: string) => request<{ code: number; data: Acupoint }>(`/acupoints/${id}`),

  // 养生
  getWellness: (data: { constitution?: string; dayMasterWuxing?: string }) =>
    request<{ code: number; data: WellnessResult }>('/wellness', { method: 'POST', body: JSON.stringify(data) }),

  // 家庭
  getFamily: (userId: string) => request<{ code: number; data: FamilyMember[] }>(`/family?userId=${userId}`),
  addFamilyMember: (data: Omit<FamilyMember, 'id' | 'createdAt'>) =>
    request<{ code: number; data: FamilyMember }>('/family', { method: 'POST', body: JSON.stringify(data) }),
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) =>
    request<{ code: number; data: FamilyMember }>(`/family/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFamilyMember: (id: string) =>
    request<{ code: number; data: { success: boolean } }>(`/family/${id}`, { method: 'DELETE' }),

  // 我的信息
  getProfile: (userId: string) => request<{ code: number; data: ProfileData }>(`/profile/${userId}`),
};

export const apiClient = api;

// === Types ===
export interface UserInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthPlace?: string;
  isLunar?: boolean | number;
}

export interface User extends UserInput {
  id: string;
  createdAt: string;
}

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

export interface ZiweiResult {
  input: BaziInput;
  mingGong: number;
  shenGong: number;
  wuxingJuJu: string;
  juNumber: number;
  lifePalace: ZiweiGong;
  bodyPalace: ZiweiGong;
  palaces: ZiweiGong[];
  summary: string;
}

export interface ZiweiGong {
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

export interface Question {
  id: number;
  text: string;
  options: { value: number; label: string }[];
  type: string;
}

export interface ConstitutionResult {
  scores: Record<string, number>;
  rawScores: Record<string, number>;
  primaryType: string;
  secondaryType: string | null;
  isPinghe: boolean;
  ranking: { type: string; score: number }[];
}

export interface ConstitutionTypeInfo {
  type: string;
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

export interface ReportResult {
  bazi: BaziResult;
  ziwei: ZiweiResult;
  constitution: ConstitutionTypeInfo | null;
  cross: {
    overallPattern: string;
    constitutionWuxing: string;
    baziWuxing: string;
    ziweiTheme: string;
    alignment: { aligned: string[]; conflict: string[]; supplement: string[] };
    keyRisks: { area: string; risk: string; severity: string }[];
    coreRecommendation: string;
  };
  balance: {
    overallScore: number;
    balance: Record<string, number>;
    diagnosis: string;
    supplements: { element: string; methods: string[] }[];
    cautions: { element: string; reason: string }[];
  };
  health: {
    risks: { organ: string; element: string; riskLevel: number; reasons: string[]; prevention: string[] }[];
    overallHealth: string;
    seasonalAdvice: string;
  };
  generatedAt: string;
}

export interface DailyFortune {
  date: string;
  dayPillar: { gan: string; zhi: string; wuxing: string };
  overall: number;
  love: number;
  career: number;
  wealth: number;
  health: number;
  lucky: { color: string; colorHex: string; number: number[]; direction: string; time: string };
  yi: string[];
  ji: string[];
  description: string;
  advice: string;
  mantra: string;
  wuxing: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nature: string;
  flavor: string;
  meridian: string;
  effect: string;
  suitable: string[];
  avoid: string[];
  season?: string;
}

export interface Acupoint {
  id: string;
  name: string;
  pinyin: string;
  code: string;
  meridian: string;
  category: 'head' | 'body' | 'limbs';
  location: string;
  effect: string[];
  indications: string[];
  method: string;
  duration: string;
  caution?: string;
}

export interface WellnessResult {
  daily: { items: { title: string; desc: string; icon: string; priority: string }[] };
  sport: any;
  emotion: any;
  seasonal: any;
  term: any;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relation: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  constitution?: string;
  healthNote?: string;
  avatar?: string;
  createdAt?: string;
}

export interface ProfileData {
  user: User;
  bazi: any;
  constitution: any;
  family: FamilyMember[];
  favorites: any[];
  settings: any;
}
