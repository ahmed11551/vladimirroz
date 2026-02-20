import { Router } from 'express';
import { store } from '../db/store.js';

export const rafflesRouter = Router();

rafflesRouter.get('/', (req, res) => {
  const raffles = store.raffles.findActive().map((r) => {
    const paid = store.slots.findPaidByRaffle(r.id).length;
    return { ...r, paid_slots: paid };
  });
  res.json({ raffles });
});

rafflesRouter.get('/:id', (req, res) => {
  const raffle = store.raffles.findById(req.params.id);
  if (!raffle) return res.status(404).json({ error: 'Not found' });

  const slots = store.slots.findByRaffle(raffle.id).map((s) => {
    const u = store.users.findById(s.user_id);
    return { ...s, username: u?.username, first_name: u?.first_name };
  });
  const paid_slots = slots.filter((s) => s.payment_status === 'paid').length;

  res.json({ raffle: { ...raffle, paid_slots }, slots });
});
