/**
 * Настройка Telegram бота @Rozygvlad_bot
 * Устанавливает кнопку меню с Mini App
 * 
 * Запуск: MINI_APP_URL=https://your-app.vercel.app BOT_TOKEN=xxx node backend/scripts/setup-bot.js
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://vladimirroz.vercel.app';

async function setMenuButton() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      menu_button: {
        type: 'web_app',
        text: '🎁 Открыть розыгрыши',
        web_app: { url: MINI_APP_URL },
      },
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
  console.log('✅ Меню бота настроено:', MINI_APP_URL);
}

async function setBotDescription() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setMyDescription`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: 'Розыгрыши продуктов! Колбаса, сыр, хлеб и многое другое. Выбери номер, оплати и участвуй в розыгрыше! 🎁',
    }),
  });
  const data = await res.json();
  if (data.ok) console.log('✅ Описание бота обновлено');
}

async function main() {
  if (!BOT_TOKEN) {
    console.error('Укажите BOT_TOKEN: BOT_TOKEN=xxx node backend/scripts/setup-bot.js');
    process.exit(1);
  }
  try {
    await setMenuButton();
    await setBotDescription();
    console.log('\nГотово! Открой @Rozygvlad_bot и нажми кнопку меню (слева внизу).');
  } catch (e) {
    console.error('Ошибка:', e.message);
    process.exit(1);
  }
}

main();
