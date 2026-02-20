/**
 * Настройка Telegram бота @Rozygvlad_bot
 * Очищает старые ссылки и настраивает Mini App заново
 *
 * Запуск: BOT_TOKEN=xxx MINI_APP_URL=https://vladimirroz.vercel.app npm run bot:setup
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://vladimirroz.vercel.app';

async function api(method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function clearOldConfig() {
  console.log('Очистка старых настроек бота...');

  // Удалить webhook (если был)
  const wh = await api('deleteWebhook', { drop_pending_updates: true });
  if (wh.ok) console.log('  ✓ Webhook удалён');

  // Очистить команды
  const cmd = await api('deleteMyCommands', { scope: { type: 'default' } });
  if (cmd.ok) console.log('  ✓ Команды очищены');

  // Сбросить меню на default (убрать старые ссылки)
  const menu = await api('setChatMenuButton', { menu_button: { type: 'default' } });
  if (menu.ok) console.log('  ✓ Старое меню сброшено');
}

async function setMenuButton() {
  const data = await api('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🎁 Открыть розыгрыши',
      web_app: { url: MINI_APP_URL },
    },
  });
  if (!data.ok) throw new Error(data.description);
  console.log('✅ Меню настроено →', MINI_APP_URL);
}

async function setBotDescription() {
  const data = await api('setMyDescription', {
    description: 'Розыгрыши продуктов! 🎁 Колбаса, сыр, хлеб, молоко и многое другое. Выбери номер, оплати через Сбер и участвуй в розыгрыше. Честно и просто!',
  });
  if (data.ok) console.log('✅ Описание бота обновлено');
}

async function setShortDescription() {
  const data = await api('setMyShortDescription', {
    short_description: 'Розыгрыши продуктов по низким ценам',
  });
  if (data.ok) console.log('✅ Краткое описание обновлено');
}

async function main() {
  if (!BOT_TOKEN) {
    console.error('Укажите BOT_TOKEN: BOT_TOKEN=xxx npm run bot:setup');
    process.exit(1);
  }
  try {
    await clearOldConfig();
    console.log('');
    await setMenuButton();
    await setBotDescription();
    await setShortDescription();
    console.log('\nГотово! Открой @Rozygvlad_bot и нажми кнопку меню (слева внизу).');
  } catch (e) {
    console.error('Ошибка:', e.message);
    process.exit(1);
  }
}

main();
