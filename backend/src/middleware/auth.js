/**
 * Middleware для проверки Telegram Web App initData
 * В продакшене нужно проверять подпись через bot token
 */
export const requireAuth = (req, res, next) => {
  const initData = req.headers['x-telegram-init-data'] || req.query.initData;
  if (!initData) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: В продакшене - crypto.createHmac('sha256', 'WebAppData').update(initData)
  // и сравнение с hash из initData
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (userStr) {
      req.telegramUser = JSON.parse(userStr);
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid init data' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
