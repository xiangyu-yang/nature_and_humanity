import { Router } from 'express';
import { z } from 'zod';
import { calcBazi } from '../engines/bazi.js';
import { calcZiwei } from '../engines/ziwei.js';
import { CONSTITUTION_INFO } from '../engines/constitution.js';
import { crossAnalysis, fiveElementsBalance, healthRiskPrediction } from '../ai/crossAnalysis.js';

export const reportRouter = Router();

const reportSchema = z.object({
  birth: z.object({
    year: z.number().int(),
    month: z.number().int(),
    day: z.number().int(),
    hour: z.number().int(),
    gender: z.enum(['male', 'female']),
    isLunar: z.union([z.boolean(), z.number().int().min(0).max(1)]).optional(),
  }),
  constitution: z.enum(['平和质', '气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质']).optional(),
});

reportRouter.post('/', (req, res) => {
  const parse = reportSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }
  try {
    const birthData = {
      ...parse.data.birth,
      isLunar: parse.data.birth.isLunar ? true : false,
    };
    const bazi = calcBazi(birthData);
    const ziwei = calcZiwei(birthData);
    const cross = crossAnalysis(bazi, ziwei, parse.data.constitution);
    const balance = fiveElementsBalance(bazi);
    const health = healthRiskPrediction(bazi, parse.data.constitution);

    const constitutionInfo = parse.data.constitution
      ? CONSTITUTION_INFO[parse.data.constitution]
      : null;

    res.json({
      code: 0,
      data: {
        bazi,
        ziwei,
        constitution: constitutionInfo,
        cross,
        balance,
        health,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '报告生成失败' });
  }
});
