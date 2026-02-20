import { Router } from 'express';
import { store } from '../db/store.js';
import { selectRaffleWinner } from '../services/raffle.js';

export const paymentsRouter = Router();

paymentsRouter.post('/reserve', async (req, res) => {
  const initData = req.headers['x-telegram-init-data'] || req.body?.initData;
  if (!initData) return res.status(401).json({ error: 'Unauthorized' });

  let user;
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return res.status(401).json({ error: 'Unauthorized' });
    const tgUser = JSON.parse(userStr);
    user = await store.users.getOrCreate(tgUser);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { raffleId, slotNumbers } = req.body;
  if (!raffleId || !Array.isArray(slotNumbers) || slotNumbers.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const raffle = store.raffles.findById(raffleId);
  if (!raffle || raffle.status !== 'active') return res.status(404).json({ error: 'Raffle not found' });

  const totalAmount = slotNumbers.length * raffle.price_per_slot;
  const paidSlots = store.slots.findPaidByRaffle(raffleId).map((s) => s.slot_number);
  const taken = slotNumbers.filter((n) => paidSlots.includes(n));
  if (taken.length > 0) {
    return res.status(400).json({ error: 'Some slots are already taken', taken });
  }

  const payment = await store.payments.create(user.id, raffleId, slotNumbers, totalAmount);
  await store.slots.reserve(raffleId, slotNumbers, user.id, payment.id);

  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  const paymentUrl = process.env.SBER_MERCHANT_ID
    ? `${process.env.SBER_API_URL}/${process.env.SBER_MERCHANT_ID}/payment?orderNumber=${payment.id}&amount=${totalAmount}`
    : `${baseUrl}/api/payments/simulate/${payment.id}`;

  res.json({
    paymentId: payment.id,
    amount: totalAmount,
    slotNumbers,
    paymentUrl,
    message: 'Оплатите для подтверждения номеров. Способы: СБП, карта Сбербанка.',
  });
});

paymentsRouter.post('/webhook/sber', async (req, res) => {
  const { orderNumber, status } = req.body;
  if (status !== '1' && status !== '2') return res.sendStatus(200);

  const payment = store.payments.findById(orderNumber);
  if (!payment || payment.status === 'completed') return res.sendStatus(200);

  const slotNumbers = JSON.parse(payment.slot_numbers);
  await store.slots.setPaid(payment.raffle_id, slotNumbers);
  await store.payments.setCompleted(payment.id);
  await selectRaffleWinner(payment.raffle_id);
  res.sendStatus(200);
});

paymentsRouter.get('/simulate/:paymentId', (req, res) => {
  const payment = store.payments.findById(req.params.paymentId);
  if (!payment) return res.status(404).send('Payment not found');

  if (payment.status === 'completed') {
    return res.send(`
      <html><body style="font-family:sans-serif;padding:40px;text-align:center">
        <h2>Оплата уже проведена</h2>
        <p>Номера записаны. Вернитесь в приложение.</p>
      </body></html>
    `);
  }

  res.send(`
    <html><body style="font-family:sans-serif;padding:40px;text-align:center;max-width:400px;margin:0 auto">
      <h2>Симуляция оплаты Сбер</h2>
      <p>Сумма: ${(payment.amount / 100).toFixed(2)} ₽</p>
      <p><small>В проде здесь будет редирект на Сбербанк</small></p>
      <form action="/api/payments/confirm-simulate/${payment.id}" method="POST">
        <button type="submit" style="padding:12px 24px;background:#21a038;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px">
          Подтвердить оплату (демо)
        </button>
      </form>
    </body></html>
  `);
});

paymentsRouter.post('/confirm-simulate/:paymentId', async (req, res) => {
  const payment = store.payments.findById(req.params.paymentId);
  if (!payment || payment.status === 'completed') {
    return res.redirect('/api/payments/simulate/' + req.params.paymentId);
  }

  const slotNumbers = JSON.parse(payment.slot_numbers);
  await store.slots.setPaid(payment.raffle_id, slotNumbers);
  await store.payments.setCompleted(payment.id);
  await selectRaffleWinner(payment.raffle_id);

  res.send(`
    <html><body style="font-family:sans-serif;padding:40px;text-align:center">
      <h2>Оплата успешна!</h2>
      <p>Номера записаны. Вернитесь в Telegram.</p>
    </body></html>
  `);
});
