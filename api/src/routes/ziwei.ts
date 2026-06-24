import { Router } from 'express';
import { z } from 'zod';
import { calcZiwei } from '../engines/ziwei.js';

export const ziweiRouter = Router();

const ziweiSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  gender: z.enum(['male', 'female']),
  isLunar: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
});

ziweiRouter.post('/', (req, res) => {
  const parse = ziweiSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }
  try {
    const data = {
      ...parse.data,
      isLunar: parse.data.isLunar ? true : false,
    };
    const result = calcZiwei(data);
    res.json({ code: 0, data: result });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '紫微计算失败' });
  }
});
