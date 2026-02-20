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
  users: [
    { id: 1, telegram_id: 111111, username: 'winner1', first_name: 'Анна', last_name: null, role: 'user' },
    { id: 2, telegram_id: 222222, username: 'winner2', first_name: 'Михаил', last_name: null, role: 'user' },
    { id: 3, telegram_id: 333333, username: 'user3', first_name: 'Елена', last_name: null, role: 'user' },
    { id: 4, telegram_id: 444444, username: 'user4', first_name: 'Дмитрий', last_name: null, role: 'user' },
    { id: 5, telegram_id: 555555, username: 'user5', first_name: 'Ольга', last_name: null, role: 'user' },
  ],
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
    { id: 11, title: 'Сметана 20%', description: 'Классическая, 400 г', emoji: '🥄', price: 8500, sort_order: 11 },
    { id: 12, title: 'Творог', description: '5% жирности, 200 г', emoji: '🧁', price: 12000, sort_order: 12 },
    { id: 13, title: 'Кефир', description: '2.5%, 500 мл', emoji: '🥛', price: 6500, sort_order: 13 },
    { id: 14, title: 'Сосиски', description: 'Молочные, 400 г', emoji: '🌭', price: 18000, sort_order: 14 },
    { id: 15, title: 'Крупа гречневая', description: 'Ядрица, 450 г', emoji: '🌾', price: 7500, sort_order: 15 },
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
    { id: 11, title: 'Сметана 20%', description: 'Классическая, 400 г. 15 номеров по 50₽', emoji: '🥄', price_per_slot: 5000, total_slots: 15, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 12, title: 'Творог', description: '5% жирности 200 г. 10 номеров по 60₽', emoji: '🧁', price_per_slot: 6000, total_slots: 10, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 13, title: 'Сосиски молочные', description: '400 г. 12 номеров по 70₽', emoji: '🌭', price_per_slot: 7000, total_slots: 12, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 14, title: 'Гречка', description: 'Ядрица 450 г. 20 номеров по 35₽', emoji: '🌾', price_per_slot: 3500, total_slots: 20, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
    { id: 15, title: 'Большой набор', description: 'Молоко + хлеб + яйца + масло. 3 номера по 200₽', emoji: '🎁', price_per_slot: 20000, total_slots: 3, status: 'active', winner_telegram_id: null, winner_slot: null, completed_at: null },
  ],
  raffle_slots: [
    { raffle_id: 1, slot_number: 3, user_id: 1, payment_status: 'paid', paid_at: '2025-02-20T10:00:00.000Z' },
    { raffle_id: 1, slot_number: 7, user_id: 2, payment_status: 'paid', paid_at: '2025-02-20T11:30:00.000Z' },
    { raffle_id: 1, slot_number: 12, user_id: 3, payment_status: 'paid', paid_at: '2025-02-20T14:00:00.000Z' },
    { raffle_id: 2, slot_number: 1, user_id: 4, payment_status: 'paid', paid_at: '2025-02-20T09:00:00.000Z' },
    { raffle_id: 2, slot_number: 5, user_id: 5, payment_status: 'paid', paid_at: '2025-02-20T12:00:00.000Z' },
    { raffle_id: 3, slot_number: 2, user_id: 1, payment_status: 'paid', paid_at: '2025-02-20T15:00:00.000Z' },
    { raffle_id: 3, slot_number: 8, user_id: 2, payment_status: 'paid', paid_at: '2025-02-20T16:00:00.000Z' },
    { raffle_id: 4, slot_number: 4, user_id: 3, payment_status: 'paid', paid_at: '2025-02-20T08:00:00.000Z' },
  ],
  user_wins: [],
  payments: [],
  reviews: [
    { id: 1, user_id: 1, content: 'Выиграла колбасу! Всё пришло быстро, качество отличное. Рекомендую!', rating: 5, is_approved: 1 },
    { id: 2, user_id: 2, content: 'Участвовал в розыгрыше сыра — повезло! Очень доволен, буду участвовать ещё.', rating: 5, is_approved: 1 },
    { id: 3, user_id: 3, content: 'Первый раз попробовала — выиграла хлеб. Простая и честная система.', rating: 4, is_approved: 1 },
    { id: 4, user_id: 4, content: 'Доставка за 3 дня. Товар свежий. Спасибо!', rating: 5, is_approved: 1 },
    { id: 5, user_id: 5, content: 'Купил 5 номеров на кофе — не повезло, но зато попробую ещё на молоке)', rating: 4, is_approved: 1 },
  ],
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
  // Обновить моковые данные MVP (15 розыгрышей, отзывы, слоты)
  if (!db.data.raffles?.length || db.data.raffles.length < 12) {
    db.data.raffles = defaultData.raffles;
    db.data.products = defaultData.products;
    db.data.raffle_slots = defaultData.raffle_slots;
    if (!db.data.reviews?.length) db.data.reviews = defaultData.reviews;
    if (!db.data.users?.length) db.data.users = defaultData.users;
  }
  await db.write();
}
