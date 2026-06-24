import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: '五行中医智能体 API',
    time: new Date().toISOString(),
    version: '1.0.0',
  });
});
