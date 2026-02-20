/**
 * Сброс БД к моковым данным MVP
 * Запуск: node backend/scripts/reset-mock-data.js
 */
import { unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../data/db.json');

if (existsSync(dbPath)) {
  unlinkSync(dbPath);
  console.log('✅ db.json удалён. Перезапустите backend для загрузки моковых данных.');
} else {
  console.log('db.json не найден. Запустите backend — данные создадутся автоматически.');
}
