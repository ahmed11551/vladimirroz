/**
 * Инициализация Telegram Web App
 */
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        initData: string;
        initDataUnsafe: { user?: { id: number; first_name?: string; username?: string } };
      };
    };
  }
}

export function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();
  tg.setHeaderColor('#059669');
  tg.setBackgroundColor('#f8f9fa');
}
