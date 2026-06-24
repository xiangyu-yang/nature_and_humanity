import { Router } from 'express';
import { z } from 'zod';
import { getDailyFortune } from '../engines/fortune.js';

export const fortuneRouter = Router();

const querySchema = z.object({
  userId: z.string().optional(),
  date: z.string().optional(),
});

fortuneRouter.get('/today', (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }
  const date = parse.data.date ? new Date(parse.data.date) : new Date();
  const fortune = getDailyFortune(date, parse.data.userId);
  res.json({ code: 0, data: fortune });
});
