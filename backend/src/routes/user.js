import { Router } from 'express';
import { store } from '../db/store.js';

async function getUser(req) {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!initData) return null;
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return null;
    const tgUser = JSON.parse(userStr);
    return store.users.findByTelegramId(tgUser.id) || await store.users.getOrCreate(tgUser);
  } catch {
    return null;
  }
}

export const userRouter = Router();

userRouter.get('/wins', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const wins = store.user_wins.findByUser(user.id).map((w) => {
    const r = store.raffles.findById(w.raffle_id);
    return { ...w, raffle_title: r?.title, image_url: r?.image_url };
  });
  res.json({ wins });
});

userRouter.get('/slots', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const slots = store.slots.findByUser(user.id).map((s) => {
    const r = store.raffles.findById(s.raffle_id);
    return { ...s, title: r?.title, price_per_slot: r?.price_per_slot, raffle_status: r?.status };
  });
  res.json({ slots });
});

userRouter.post('/reviews', async (req, res) => {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { content, rating } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });

  const id = await store.reviews.create(user.id, content, rating);
  res.json({ id });
});
