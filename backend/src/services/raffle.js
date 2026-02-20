import { store } from '../db/store.js';

export async function selectRaffleWinner(raffleId) {
  const raffle = store.raffles.findById(raffleId);
  if (!raffle || raffle.status !== 'active') return null;

  const paidSlots = store.slots.findPaidByRaffle(raffleId);
  if (paidSlots.length < raffle.total_slots) return null;

  const randomIndex = Math.floor(Math.random() * paidSlots.length);
  const winner = paidSlots[randomIndex];
  const winnerUser = store.users.findById(winner.user_id);

  await store.raffles.update(raffleId, {
    status: 'completed',
    winner_telegram_id: winnerUser.telegram_id,
    winner_slot: winner.slot_number,
    completed_at: new Date().toISOString(),
  });
  await store.user_wins.add(winner.user_id, raffleId, winner.slot_number);

  return { winner: winnerUser, slot: winner.slot_number };
}
