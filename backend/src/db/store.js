/**
 * Обёртка над lowdb для удобного доступа к данным
 */
import { db } from './index.js';

function nextId(collection) {
  const items = db.data[collection] || [];
  const max = items.reduce((m, x) => Math.max(m, x.id || 0), 0);
  return max + 1;
}

export const store = {
  users: {
    findByTelegramId: (tid) => db.data.users.find((u) => u.telegram_id === tid),
    create: async (user) => {
      const id = nextId('users');
      const row = { id, ...user, role: 'user', created_at: new Date().toISOString() };
      db.data.users.push(row);
      await db.write();
      return row;
    },
    getOrCreate: async (tgUser) => {
      let u = store.users.findByTelegramId(tgUser.id);
      if (!u) {
        u = await store.users.create({
          telegram_id: tgUser.id,
          username: tgUser.username,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
        });
      }
      return u;
    },
    findById: (id) => db.data.users.find((u) => u.id === id),
    updateRole: async (id, role) => {
      const u = db.data.users.find((x) => x.id === id);
      if (u) u.role = role;
      await db.write();
    },
  },

  raffles: {
    findActive: () => db.data.raffles.filter((r) => r.status === 'active'),
    findById: (id) => db.data.raffles.find((r) => r.id === Number(id)),
    findAll: () => db.data.raffles,
    create: async (data) => {
      const id = nextId('raffles');
      const row = { id, ...data, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null, created_at: new Date().toISOString() };
      db.data.raffles.push(row);
      await db.write();
      return row;
    },
    update: async (id, data) => {
      const r = db.data.raffles.find((x) => x.id === Number(id));
      if (r) Object.assign(r, data);
      await db.write();
    },
  },

  slots: {
    findByRaffle: (raffleId) => db.data.raffle_slots.filter((s) => s.raffle_id === Number(raffleId)),
    findPaidByRaffle: (raffleId) => db.data.raffle_slots.filter((s) => s.raffle_id === Number(raffleId) && s.payment_status === 'paid'),
    findByUser: (userId) => db.data.raffle_slots.filter((s) => s.user_id === userId && s.payment_status === 'paid'),
    reserve: async (raffleId, slotNumbers, userId, paymentId) => {
      for (const num of slotNumbers) {
        const existing = db.data.raffle_slots.find((s) => s.raffle_id === raffleId && s.slot_number === num);
        if (existing) {
          existing.user_id = userId;
          existing.payment_status = 'pending';
          existing.payment_id = paymentId;
        } else {
          db.data.raffle_slots.push({
            raffle_id: raffleId,
            slot_number: num,
            user_id: userId,
            payment_status: 'pending',
            payment_id: paymentId,
          });
        }
      }
      await db.write();
    },
    setPaid: async (raffleId, slotNumbers) => {
      for (const num of slotNumbers) {
        const s = db.data.raffle_slots.find((x) => x.raffle_id === raffleId && x.slot_number === num);
        if (s) {
          s.payment_status = 'paid';
          s.paid_at = new Date().toISOString();
        }
      }
      await db.write();
    },
  },

  payments: {
    create: async (userId, raffleId, slotNumbers, amount) => {
      const id = nextId('payments');
      const row = { id, user_id: userId, raffle_id: raffleId, slot_numbers: JSON.stringify(slotNumbers), amount, status: 'pending', created_at: new Date().toISOString() };
      db.data.payments.push(row);
      await db.write();
      return row;
    },
    findById: (id) => db.data.payments.find((p) => p.id === Number(id)),
    setCompleted: async (id) => {
      const p = db.data.payments.find((x) => x.id === Number(id));
      if (p) {
        p.status = 'completed';
        p.completed_at = new Date().toISOString();
      }
      await db.write();
    },
  },

  user_wins: {
    add: async (userId, raffleId, slotNumber) => {
      db.data.user_wins.push({ user_id: userId, raffle_id: raffleId, slot_number: slotNumber, created_at: new Date().toISOString() });
      await db.write();
    },
    findByUser: (userId) => db.data.user_wins.filter((w) => w.user_id === userId),
  },

  sections: {
    findAll: () => db.data.sections,
    findBySlug: (slug) => db.data.sections.find((s) => s.slug === slug),
    update: async (id, data) => {
      const s = db.data.sections.find((x) => x.id === Number(id));
      if (s) Object.assign(s, data);
      await db.write();
    },
  },

  products: {
    findAll: () => db.data.products,
    create: async (data) => {
      const id = nextId('products');
      db.data.products.push({ id, ...data });
      await db.write();
      return id;
    },
    update: async (id, data) => {
      const p = db.data.products.find((x) => x.id === Number(id));
      if (p) Object.assign(p, data);
      await db.write();
    },
    delete: async (id) => {
      db.data.products = db.data.products.filter((x) => x.id !== Number(id));
      await db.write();
    },
  },

  reviews: {
    findApproved: () => db.data.reviews.filter((r) => r.is_approved).map((r) => {
      const u = db.data.users.find((x) => x.id === r.user_id);
      return { ...r, first_name: u?.first_name, username: u?.username };
    }),
    findAll: () => db.data.reviews.map((r) => {
      const u = db.data.users.find((x) => x.id === r.user_id);
      return { ...r, first_name: u?.first_name, username: u?.username };
    }),
    create: async (userId, content, rating) => {
      const id = nextId('reviews');
      db.data.reviews.push({ id, user_id: userId, content, rating: rating || 5, is_approved: 0 });
      await db.write();
      return id;
    },
    approve: async (id) => {
      const r = db.data.reviews.find((x) => x.id === Number(id));
      if (r) r.is_approved = 1;
      await db.write();
    },
    delete: async (id) => {
      db.data.reviews = db.data.reviews.filter((x) => x.id !== Number(id));
      await db.write();
    },
  },
};
