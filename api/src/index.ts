import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { healthRouter } from './routes/health.js';
import { userRouter } from './routes/user.js';
import { baziRouter } from './routes/bazi.js';
import { ziweiRouter } from './routes/ziwei.js';
import { constitutionRouter } from './routes/constitution.js';
import { reportRouter } from './routes/report.js';
import { fortuneRouter } from './routes/fortune.js';
import { foodRouter } from './routes/food.js';
import { acupointRouter } from './routes/acupoint.js';
import { familyRouter } from './routes/family.js';
import { profileRouter } from './routes/profile.js';
import { wellnessRouter } from './routes/wellness.js';
import { initDatabase } from './db/sqlite.js';
import fs from 'fs';

async function startServer() {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }

  initDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 4000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.use('/api/health', healthRouter);
  app.use('/api/users', userRouter);
  app.use('/api/bazi', baziRouter);
  app.use('/api/ziwei', ziweiRouter);
  app.use('/api/constitution', constitutionRouter);
  app.use('/api/report', reportRouter);
  app.use('/api/fortune', fortuneRouter);
  app.use('/api/food', foodRouter);
  app.use('/api/acupoints', acupointRouter);
  app.use('/api/family', familyRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/wellness', wellnessRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[api error]', err);
    res.status(500).json({ code: 500, message: err.message || '服务器异常' });
  });

  app.listen(PORT, () => {
    console.log(`五行中医智能体 API 已启动 → http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
