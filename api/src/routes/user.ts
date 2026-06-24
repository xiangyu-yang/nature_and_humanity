import { Router } from 'express';
import { z } from 'zod';
import { UserDAO } from '../db/dao.js';

export const userRouter = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(32),
  name: z.string().min(1).max(20),
  gender: z.enum(['male', 'female']),
  birthYear: z.number().int().min(1900).max(2100),
  birthMonth: z.number().int().min(1).max(12),
  birthDay: z.number().int().min(1).max(31),
  birthHour: z.number().int().min(0).max(23),
  birthPlace: z.string().optional(),
  isLunar: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

userRouter.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误', errors: parse.error.errors });
  }

  const existingUser = await UserDAO.findByUsername(parse.data.username);
  if (existingUser) {
    return res.status(400).json({ code: 400, message: '用户名已存在' });
  }

  try {
    const user = await UserDAO.create({
      ...parse.data,
      isLunar: parse.data.isLunar ? 1 : 0,
    });
    const { password, ...userWithoutPassword } = user;
    res.json({ code: 0, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ code: 500, message: '注册失败' });
  }
});

userRouter.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }

  const user = await UserDAO.findByUsername(parse.data.username);
  if (!user) {
    return res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }

  if (user.password !== parse.data.password) {
    return res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json({ code: 0, data: userWithoutPassword });
});

userRouter.get('/:id', async (req, res) => {
  const user = await UserDAO.findById(req.params.id);
  if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
  const { password, ...userWithoutPassword } = user;
  res.json({ code: 0, data: userWithoutPassword });
});

userRouter.put('/:id', async (req, res) => {
  const parse = registerSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }

  const existingUser = await UserDAO.findById(req.params.id);
  if (!existingUser) return res.status(404).json({ code: 404, message: '用户不存在' });

  if (parse.data.username && parse.data.username !== existingUser.username) {
    const userWithSameUsername = await UserDAO.findByUsername(parse.data.username);
    if (userWithSameUsername) {
      return res.status(400).json({ code: 400, message: '用户名已存在' });
    }
  }

  const updated = await UserDAO.update(req.params.id, {
    ...parse.data,
    isLunar: parse.data.isLunar !== undefined ? (parse.data.isLunar ? 1 : 0) : undefined,
  });
  
  if (updated) {
    const { password, ...userWithoutPassword } = updated;
    res.json({ code: 0, data: userWithoutPassword });
  } else {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
});

userRouter.delete('/:id', async (req, res) => {
  const success = await UserDAO.delete(req.params.id);
  if (success) {
    res.json({ code: 0, message: '删除成功' });
  } else {
    res.status(404).json({ code: 404, message: '用户不存在' });
  }
});

userRouter.get('/', async (req, res) => {
  const users = (await UserDAO.getAll()).map(({ password, ...user }) => user);
  res.json({ code: 0, data: users });
});
