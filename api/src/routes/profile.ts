import { Router } from 'express';
import { UserDAO, BaziRecordDAO, ConstitutionResultDAO, FamilyMemberDAO, FavoriteDAO } from '../db/dao.js';

export const profileRouter = Router();

profileRouter.get('/:userId', async (req, res) => {
  const user = await UserDAO.findById(req.params.userId);
  if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
  
  const { password, ...userWithoutPassword } = user;
  
  const bazi = await BaziRecordDAO.findByUserId(req.params.userId);
  const constitution = await ConstitutionResultDAO.findByUserId(req.params.userId);
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
