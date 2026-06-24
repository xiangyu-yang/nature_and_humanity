import { Router } from 'express';
import { UserDAO, BaziRecordDAO, ConstitutionResultDAO, FamilyMemberDAO, FavoriteDAO } from '../db/dao.js';

export const profileRouter = Router();

profileRouter.get('/:userId', async (req, res) => {
  const user = await UserDAO.findById(req.params.userId);
  if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
  
  const { password, ...userWithoutPassword } = user;
  
  const bazi = await BaziRecordDAO.findByUserId(req.params.userId);
  const constitutionRecord = await ConstitutionResultDAO.findByUserId(req.params.userId);
  
  let constitution = null;
  if (constitutionRecord) {
    try {
      const scores = JSON.parse(constitutionRecord.scores);
      constitution = {
        id: constitutionRecord.id,
        userId: constitutionRecord.userId,
        primaryType: constitutionRecord.constitution,
        secondaryType: null,
        scores,
        rawScores: scores,
        isPinghe: constitutionRecord.constitution === '平和质',
        ranking: Object.entries(scores).map(([type, score]) => ({ type, score })).sort((a, b) => b.score - a.score),
        createdAt: constitutionRecord.createdAt,
      };
    } catch {
      constitution = {
        id: constitutionRecord.id,
        userId: constitutionRecord.userId,
        primaryType: constitutionRecord.constitution,
        secondaryType: null,
        scores: {},
        rawScores: {},
        isPinghe: constitutionRecord.constitution === '平和质',
        ranking: [],
        createdAt: constitutionRecord.createdAt,
      };
    }
  }
  
  const family = await FamilyMemberDAO.findByUserId(req.params.userId);
  const favorites = await FavoriteDAO.findByUserId(req.params.userId);
  
  res.json({
    code: 0,
    data: {
      user: userWithoutPassword,
      bazi,
      constitution,
      family,
      favorites,
      settings: { notification: true, privacy: { publicProfile: false } },
    },
  });
});
