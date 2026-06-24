import { Router } from 'express';
import { z } from 'zod';
import { calcBazi } from '../engines/bazi.js';
import { BaziRecordDAO } from '../db/dao.js';

export const baziRouter = Router();

const baziSchema = z.object({
  userId: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  gender: z.enum(['male', 'female']),
  isLunar: z.boolean().optional(),
});

baziRouter.post('/', async (req, res) => {
  const parse = baziSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误', errors: parse.error.errors });
  }
  try {
    const result = calcBazi(parse.data);
    
    if (parse.data.userId) {
      await BaziRecordDAO.create({
        userId: parse.data.userId,
        yearGan: result.year.gan,
        yearZhi: result.year.zhi,
        monthGan: result.month.gan,
        monthZhi: result.month.zhi,
        dayGan: result.day.gan,
        dayZhi: result.day.zhi,
        hourGan: result.hour.gan,
        hourZhi: result.hour.zhi,
        dayMaster: result.dayMaster,
        dayMasterWuxing: result.dayMasterWuxing,
        wuxing: JSON.stringify(result.wuxing),
        shishen: JSON.stringify(result.shishen),
        daYun: JSON.stringify(result.daYun),
      });
    }
    
    res.json({ code: 0, data: result });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '八字计算失败' });
  }
});
