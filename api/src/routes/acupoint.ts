import { Router } from 'express';
import { ACUPOINTS, getAcupointById, getAcupointsByCategory, searchAcupoints, ACUPOINT_CATEGORIES } from '../data/acupoints.js';

export const acupointRouter = Router();

acupointRouter.get('/', (req, res) => {
  const { category, search } = req.query as Record<string, string>;
  let list = ACUPOINTS;
  if (category && ['head', 'body', 'limbs'].includes(category)) {
    list = getAcupointsByCategory(category as any);
  }
  if (search) {
    list = searchAcupoints(search);
  }
  res.json({ code: 0, data: list, categories: ACUPOINT_CATEGORIES });
});

acupointRouter.get('/categories', (_req, res) => {
  res.json({ code: 0, data: ACUPOINT_CATEGORIES });
});

acupointRouter.get('/:id', (req, res) => {
  const item = getAcupointById(req.params.id);
  if (!item) return res.status(404).json({ code: 404, message: '穴位不存在' });
  res.json({ code: 0, data: item });
});
