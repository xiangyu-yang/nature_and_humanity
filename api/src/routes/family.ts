import { Router } from 'express';
import { z } from 'zod';
import { FamilyMemberDAO } from '../db/dao.js';

export const familyRouter = Router();

const familySchema = z.object({
  userId: z.string(),
  name: z.string().min(1).max(20),
  relation: z.string(),
  gender: z.enum(['male', 'female']),
  birthYear: z.number().int().min(1900).max(2100),
  birthMonth: z.number().int().min(1).max(12),
  birthDay: z.number().int().min(1).max(31),
  birthHour: z.number().int().min(0).max(23).optional(),
});

familyRouter.get('/', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ code: 400, message: '缺少 userId' });
  const list = await FamilyMemberDAO.findByUserId(userId);
  res.json({ code: 0, data: list });
});

familyRouter.post('/', async (req, res) => {
  const parse = familySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误', errors: parse.error.errors });
  }
  const member = await FamilyMemberDAO.create({
    userId: parse.data.userId,
    name: parse.data.name,
    relation: parse.data.relation,
    gender: parse.data.gender,
    birthYear: parse.data.birthYear,
    birthMonth: parse.data.birthMonth,
    birthDay: parse.data.birthDay,
    birthHour: parse.data.birthHour || 12,
  });
  res.json({ code: 0, data: member });
});

familyRouter.put('/:id', async (req, res) => {
  const parse = familySchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ code: 400, message: '参数错误' });
  const member = await FamilyMemberDAO.findById(req.params.id);
  if (!member) return res.status(404).json({ code: 404, message: '家庭成员不存在' });
  const updated = await FamilyMemberDAO.update(req.params.id, parse.data);
  if (updated) {
    res.json({ code: 0, data: updated });
  } else {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
});

familyRouter.delete('/:id', async (req, res) => {
  const success = await FamilyMemberDAO.delete(req.params.id);
  if (success) {
    res.json({ code: 0, data: { success: true } });
  } else {
    return res.status(404).json({ code: 404, message: '家庭成员不存在' });
  }
});
