import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');
mkdirSync(dataDir, { recursive: true });
const file = join(dataDir, 'db.json');

const defaultData = {
  users: [],
  sections: [
    { id: 1, slug: 'assortment', title: 'Ассортимент', content: 'Наш ассортимент товаров для розыгрышей.', sort_order: 1 },
    { id: 2, slug: 'reviews', title: 'Отзывы', content: 'Отзывы наших победителей.', sort_order: 2 },
    { id: 3, slug: 'delivery', title: 'Доставка', content: 'Доставка по всей России.', sort_order: 3 },
    { id: 4, slug: 'raffles', title: 'Розыгрыши', content: 'Активные розыгрыши.', sort_order: 4 },
  ],
  products: [
    { id: 1, title: 'Пример товара 1', description: 'Описание', price: 5000, sort_order: 1 },
    { id: 2, title: 'Пример товара 2', description: 'Ещё товар', price: 3000, sort_order: 2 },
  ],
  raffles: [
    { id: 1, title: 'Демо розыгрыш', description: '10 номеров по 100₽', price_per_slot: 10000, total_slots: 10, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
  ],
  raffle_slots: [],
  user_wins: [],
  payments: [],
  reviews: [],
};

const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= defaultData;
  if (!db.data.raffle_slots) db.data.raffle_slots = [];
  if (!db.data.user_wins) db.data.user_wins = [];
  if (!db.data.payments) db.data.payments = [];
  if (!db.data.reviews) db.data.reviews = [];
  await db.write();
}
