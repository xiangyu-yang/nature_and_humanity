import { Router } from 'express';
import { z } from 'zod';
import { FOODS, getFoodRecommendByConstitution, getFoodBySeason, getFoodById } from '../data/foods.js';
import { getCurrentSolarTerm } from '../engines/solar.js';

export const foodRouter = Router();

foodRouter.get('/', (req, res) => {
  const { search, season, constitution } = req.query as Record<string, string>;
  let list = [...FOODS];
  if (constitution) {
    list = list.filter(f => f.suitable.includes(constitution as any));
  }
  if (season) {
    list = list.filter(f => f.season === season);
  }
  if (search) {
    const kw = search.toLowerCase();
    list = list.filter(f =>
      f.name.includes(search) ||
      f.effect.includes(search) ||
      f.meridian.includes(search) ||
      f.flavor.includes(search)
    );
  }
  res.json({ code: 0, data: list });
});

foodRouter.get('/recommend', (req, res) => {
  const { constitution } = req.query as { constitution?: string };
  if (constitution) {
    res.json({ code: 0, data: getFoodRecommendByConstitution(constitution) });
  } else {
    const term = getCurrentSolarTerm();
    const season = term.season;
    res.json({ code: 0, data: { seasonal: getFoodBySeason(season), term } });
  }
});

foodRouter.get('/seasonal', (_req, res) => {
  const term = getCurrentSolarTerm();
  res.json({ code: 0, data: { term, foods: getFoodBySeason(term.season) } });
});

foodRouter.get('/:id', (req, res) => {
  const item = getFoodById(req.params.id);
  if (!item) return res.status(404).json({ code: 404, message: '食材不存在' });
  res.json({ code: 0, data: item });
});
