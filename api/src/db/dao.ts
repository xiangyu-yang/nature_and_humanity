import { db } from './sqlite';
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthPlace?: string;
  isLunar?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BaziRecord {
  id: string;
  userId: string;
  yearGan: string;
  yearZhi: string;
  monthGan: string;
  monthZhi: string;
  dayGan: string;
  dayZhi: string;
  hourGan: string;
  hourZhi: string;
  dayMaster: string;
  dayMasterWuxing: string;
  wuxing: string;
  shishen: string;
  daYun: string;
  createdAt: string;
}

export interface ConstitutionResult {
  id: string;
  userId: string;
  constitution: string;
  scores: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  gender: 'male' | 'female';
  relation: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  type: string;
  itemId: string;
  createdAt: string;
}

export const UserDAO = {
  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    await db.run(`
      INSERT INTO users (id, username, password, name, gender, birthYear, birthMonth, birthDay, birthHour, birthPlace, isLunar, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.username,
      data.password,
      data.name,
      data.gender,
      data.birthYear,
      data.birthMonth,
      data.birthDay,
      data.birthHour,
      data.birthPlace || null,
      data.isLunar || 0,
      createdAt
    ]);
    return { ...data, id, createdAt };
  },

  findById: async (id: string): Promise<User | undefined> => {
    const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    return row as User | undefined;
  },

  findByUsername: async (username: string): Promise<User | undefined> => {
    const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    return row as User | undefined;
  },

  update: async (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> => {
    const updatedAt = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.username !== undefined) { fields.push('username = ?'); values.push(data.username); }
    if (data.password !== undefined) { fields.push('password = ?'); values.push(data.password); }
    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
    if (data.birthYear !== undefined) { fields.push('birthYear = ?'); values.push(data.birthYear); }
    if (data.birthMonth !== undefined) { fields.push('birthMonth = ?'); values.push(data.birthMonth); }
    if (data.birthDay !== undefined) { fields.push('birthDay = ?'); values.push(data.birthDay); }
    if (data.birthHour !== undefined) { fields.push('birthHour = ?'); values.push(data.birthHour); }
    if (data.birthPlace !== undefined) { fields.push('birthPlace = ?'); values.push(data.birthPlace); }
    if (data.isLunar !== undefined) { fields.push('isLunar = ?'); values.push(data.isLunar); }
    fields.push('updatedAt = ?');
    values.push(updatedAt);
    values.push(id);

    if (fields.length === 0) return UserDAO.findById(id);

    await db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return UserDAO.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  },

  getAll: async (): Promise<User[]> => {
    const rows = await db.all('SELECT * FROM users ORDER BY createdAt DESC');
    return rows as User[];
  }
};

export const BaziRecordDAO = {
  create: async (data: Omit<BaziRecord, 'id' | 'createdAt'>): Promise<BaziRecord> => {
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    await db.run(`
      INSERT INTO bazi_records (id, userId, yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi, dayMaster, dayMasterWuxing, wuxing, shishen, daYun, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.userId,
      data.yearGan,
      data.yearZhi,
      data.monthGan,
      data.monthZhi,
      data.dayGan,
      data.dayZhi,
      data.hourGan,
      data.hourZhi,
      data.dayMaster,
      data.dayMasterWuxing,
      data.wuxing,
      data.shishen,
      data.daYun,
      createdAt
    ]);
    return { ...data, id, createdAt };
  },

  findById: async (id: string): Promise<BaziRecord | undefined> => {
    const row = await db.get('SELECT * FROM bazi_records WHERE id = ?', [id]);
    return row as BaziRecord | undefined;
  },

  findByUserId: async (userId: string): Promise<BaziRecord | undefined> => {
    const row = await db.get('SELECT * FROM bazi_records WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
    return row as BaziRecord | undefined;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.run('DELETE FROM bazi_records WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

export const ConstitutionResultDAO = {
  create: async (data: Omit<ConstitutionResult, 'id' | 'createdAt'>): Promise<ConstitutionResult> => {
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    await db.run(`
      INSERT INTO constitution_results (id, userId, constitution, scores, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [id, data.userId, data.constitution, data.scores, createdAt]);
    return { ...data, id, createdAt };
  },

  findById: async (id: string): Promise<ConstitutionResult | undefined> => {
    const row = await db.get('SELECT * FROM constitution_results WHERE id = ?', [id]);
    return row as ConstitutionResult | undefined;
  },

  findByUserId: async (userId: string): Promise<ConstitutionResult | undefined> => {
    const row = await db.get('SELECT * FROM constitution_results WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
    return row as ConstitutionResult | undefined;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.run('DELETE FROM constitution_results WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

export const FamilyMemberDAO = {
  create: async (data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> => {
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    await db.run(`
      INSERT INTO family_members (id, userId, name, gender, relation, birthYear, birthMonth, birthDay, birthHour, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.userId,
      data.name,
      data.gender,
      data.relation,
      data.birthYear,
      data.birthMonth,
      data.birthDay,
      data.birthHour,
      createdAt
    ]);
    return { ...data, id, createdAt };
  },

  findById: async (id: string): Promise<FamilyMember | undefined> => {
    const row = await db.get('SELECT * FROM family_members WHERE id = ?', [id]);
    return row as FamilyMember | undefined;
  },

  findByUserId: async (userId: string): Promise<FamilyMember[]> => {
    const rows = await db.all('SELECT * FROM family_members WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows as FamilyMember[];
  },

  update: async (id: string, data: Partial<Omit<FamilyMember, 'id' | 'createdAt'>>): Promise<FamilyMember | undefined> => {
    const updatedAt = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
    if (data.relation !== undefined) { fields.push('relation = ?'); values.push(data.relation); }
    if (data.birthYear !== undefined) { fields.push('birthYear = ?'); values.push(data.birthYear); }
    if (data.birthMonth !== undefined) { fields.push('birthMonth = ?'); values.push(data.birthMonth); }
    if (data.birthDay !== undefined) { fields.push('birthDay = ?'); values.push(data.birthDay); }
    if (data.birthHour !== undefined) { fields.push('birthHour = ?'); values.push(data.birthHour); }
    fields.push('updatedAt = ?');
    values.push(updatedAt);
    values.push(id);

    if (fields.length === 0) return FamilyMemberDAO.findById(id);

    await db.run(`UPDATE family_members SET ${fields.join(', ')} WHERE id = ?`, values);
    return FamilyMemberDAO.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.run('DELETE FROM family_members WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

export const FavoriteDAO = {
  create: async (data: Omit<Favorite, 'id' | 'createdAt'>): Promise<Favorite> => {
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    await db.run(`
      INSERT INTO favorites (id, userId, type, itemId, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `, [id, data.userId, data.type, data.itemId, createdAt]);
    return { ...data, id, createdAt };
  },

  findById: async (id: string): Promise<Favorite | undefined> => {
    const row = await db.get('SELECT * FROM favorites WHERE id = ?', [id]);
    return row as Favorite | undefined;
  },

  findByUserId: async (userId: string): Promise<Favorite[]> => {
    const rows = await db.all('SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    return rows as Favorite[];
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.run('DELETE FROM favorites WHERE id = ?', [id]);
    return result.changes > 0;
  }
};
