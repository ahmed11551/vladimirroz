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
    { id: 1, slug: 'assortment', title: 'Ассортимент', content: 'Продукты для розыгрышей: колбаса, сыр, хлеб, молоко и другие товары первой необходимости.', sort_order: 1 },
    { id: 2, slug: 'reviews', title: 'Отзывы', content: 'Отзывы наших победителей и участников.', sort_order: 2 },
    { id: 3, slug: 'delivery', title: 'Доставка', content: 'Доставка по всей России. Способы: почта России, СДЭК, курьер. Сроки: 3-7 дней. Бесплатная доставка при заказе от 1000₽.', sort_order: 3 },
    { id: 4, slug: 'raffles', title: 'Розыгрыши', content: 'Активные розыгрыши продуктов.', sort_order: 4 },
  ],
  products: [
    { id: 1, title: 'Колбаса докторская', description: 'Натуральная варёная колбаса высшего сорта, 400 г', emoji: '🌭', price: 35000, sort_order: 1 },
    { id: 2, title: 'Сыр Российский', description: 'Полутвёрдый сыр 45%, 200 г', emoji: '🧀', price: 28000, sort_order: 2 },
    { id: 3, title: 'Хлеб белый', description: 'Свежий пшеничный хлеб, 400 г', emoji: '🍞', price: 5500, sort_order: 3 },
    { id: 4, title: 'Молоко 3.2%', description: 'Ультрапастеризованное, 1 л', emoji: '🥛', price: 9500, sort_order: 4 },
    { id: 5, title: 'Масло сливочное', description: '82.5%, 200 г', emoji: '🧈', price: 18000, sort_order: 5 },
    { id: 6, title: 'Яйца куриные', description: 'С1, 10 шт.', emoji: '🥚', price: 12000, sort_order: 6 },
    { id: 7, title: 'Чай чёрный', description: 'Листовой, 100 г', emoji: '🫖', price: 15000, sort_order: 7 },
    { id: 8, title: 'Кофе молотый', description: 'Арабика, 250 г', emoji: '☕', price: 35000, sort_order: 8 },
    { id: 9, title: 'Сахар', description: 'Песок, 1 кг', emoji: '🍚', price: 6500, sort_order: 9 },
    { id: 10, title: 'Макароны', description: 'Спагетти, 400 г', emoji: '🍝', price: 5500, sort_order: 10 },
  ],
  raffles: [
    { id: 1, title: 'Колбаса докторская', description: 'Натуральная варёная колбаса 400 г. 15 номеров по 50₽', emoji: '🌭', price_per_slot: 5000, total_slots: 15, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 2, title: 'Сыр Российский', description: 'Полутвёрдый сыр 200 г. 12 номеров по 70₽', emoji: '🧀', price_per_slot: 7000, total_slots: 12, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 3, title: 'Хлеб белый', description: 'Свежий пшеничный хлеб 400 г. 20 номеров по 25₽', emoji: '🍞', price_per_slot: 2500, total_slots: 20, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 4, title: 'Молоко 3.2%', description: 'Ультрапастеризованное 1 л. 10 номеров по 30₽', emoji: '🥛', price_per_slot: 3000, total_slots: 10, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 5, title: 'Масло сливочное', description: '82.5% жирности 200 г. 8 номеров по 60₽', emoji: '🧈', price_per_slot: 6000, total_slots: 8, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 6, title: 'Яйца куриные', description: 'С1, 10 штук. 10 номеров по 40₽', emoji: '🥚', price_per_slot: 4000, total_slots: 10, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 7, title: 'Чай чёрный', description: 'Листовой чай 100 г. 12 номеров по 50₽', emoji: '🫖', price_per_slot: 5000, total_slots: 12, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 8, title: 'Кофе молотый', description: 'Арабика 250 г. 6 номеров по 100₽', emoji: '☕', price_per_slot: 10000, total_slots: 6, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 9, title: 'Набор продуктов', description: 'Колбаса + сыр + хлеб. 5 номеров по 150₽', emoji: '🛒', price_per_slot: 15000, total_slots: 5, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 10, title: 'Макароны', description: 'Спагетти 400 г. 25 номеров по 20₽', emoji: '🍝', price_per_slot: 2000, total_slots: 25, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
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
  // Обновить моковые данные если мало розыгрышей
  if (!db.data.raffles?.length || db.data.raffles.length < 5) {
    db.data.raffles = defaultData.raffles;
    db.data.products = defaultData.products;
  }
  await db.write();
}
