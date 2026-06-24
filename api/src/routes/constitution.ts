import { Router } from 'express';
import { z } from 'zod';
import { QUESTIONS, evaluateConstitution, CONSTITUTION_INFO } from '../engines/constitution.js';
import { ConstitutionResultDAO } from '../db/dao.js';

export const constitutionRouter = Router();

constitutionRouter.get('/questions', (_req, res) => {
  res.json({ code: 0, data: QUESTIONS });
});

constitutionRouter.get('/types', (_req, res) => {
  res.json({ code: 0, data: Object.values(CONSTITUTION_INFO) });
});

constitutionRouter.get('/types/:type', (req, res) => {
  const info = CONSTITUTION_INFO[req.params.type as keyof typeof CONSTITUTION_INFO];
  if (!info) return res.status(404).json({ code: 404, message: '体质类型不存在' });
  res.json({ code: 0, data: info });
});

const evalSchema = z.object({
  userId: z.string().optional(),
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
});

constitutionRouter.post('/evaluate', async (req, res) => {
  const parse = evalSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ code: 400, message: '参数错误' });
  }
  const numericAnswers: Record<number, number> = {};
  for (const [k, v] of Object.entries(parse.data.answers)) {
    numericAnswers[Number(k)] = v;
  }
  const result = evaluateConstitution(numericAnswers);
  
  if (parse.data.userId) {
    await ConstitutionResultDAO.create({
      userId: parse.data.userId,
      constitution: result.primaryType,
      scores: JSON.stringify(result.scores),
    });
  }
  
  res.json({ code: 0, data: result });
});
