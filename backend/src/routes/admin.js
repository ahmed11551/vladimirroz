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

export const adminRouter = Router();

adminRouter.use(async (req, res, next) => {
  const user = await getUser(req);
  if (!user || !['admin', 'moderator'].includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  req.user = user;
  next();
});

adminRouter.get('/raffles', (_, res) => {
  res.json({ raffles: store.raffles.findAll() });
});

adminRouter.post('/raffles', async (req, res) => {
  const { title, description, image_url, price_per_slot, total_slots } = req.body;
  if (!title || !price_per_slot || !total_slots) return res.status(400).json({ error: 'Missing required fields' });
  const r = await store.raffles.create({ title, description, image_url, price_per_slot, total_slots });
  res.json({ id: r.id });
});

adminRouter.put('/raffles/:id', async (req, res) => {
  const { title, description, image_url, price_per_slot, total_slots, status } = req.body;
  await store.raffles.update(req.params.id, { title, description, image_url, price_per_slot, total_slots, status });
  res.json({ ok: true });
});

adminRouter.delete('/raffles/:id', async (req, res) => {
  await store.raffles.update(req.params.id, { status: 'cancelled' });
  res.json({ ok: true });
});

adminRouter.put('/sections/:id', async (req, res) => {
  const { title, content } = req.body;
  await store.sections.update(req.params.id, { title, content });
  res.json({ ok: true });
});

adminRouter.get('/products', (_, res) => {
  res.json({ products: store.products.findAll() });
});

adminRouter.post('/products', async (req, res) => {
  const { title, description, image_url, price } = req.body;
  const id = await store.products.create({ title, description, image_url, price });
  res.json({ id });
});

adminRouter.put('/products/:id', async (req, res) => {
  const { title, description, image_url, price } = req.body;
  await store.products.update(req.params.id, { title, description, image_url, price });
  res.json({ ok: true });
});

adminRouter.delete('/products/:id', async (req, res) => {
  await store.products.delete(req.params.id);
  res.json({ ok: true });
});

adminRouter.get('/reviews', (_, res) => {
  res.json({ reviews: store.reviews.findAll() });
});

adminRouter.put('/reviews/:id/approve', async (req, res) => {
  await store.reviews.approve(req.params.id);
  res.json({ ok: true });
});

adminRouter.delete('/reviews/:id', async (req, res) => {
  await store.reviews.delete(req.params.id);
  res.json({ ok: true });
});

adminRouter.put('/users/:id/role', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { role } = req.body;
  if (!['user', 'moderator', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  await store.users.updateRole(Number(req.params.id), role);
  res.json({ ok: true });
});
