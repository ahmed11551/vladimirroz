import { Router } from 'express';
import { store } from '../db/store.js';

export const authRouter = Router();

authRouter.post('/me', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!initData) return res.status(401).json({ error: 'No init data' });

  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return res.status(401).json({ error: 'No user in init data' });

    const tgUser = JSON.parse(userStr);
    const user = await store.users.getOrCreate(tgUser);
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Auth failed' });
  }
});
