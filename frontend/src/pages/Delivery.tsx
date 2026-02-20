import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

export function Delivery() {
  const [content, setContent] = useState('');

  useEffect(() => {
    apiGet<{ section: { content: string } }>('/sections/delivery')
      .then((r) => setContent(r.section.content))
      .catch(console.error);
  }, []);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Доставка</h1>
        <p className="page-subtitle">Как и когда получите выигрыш</p>
      </header>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚚</div>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            fontSize: 15,
            color: 'var(--tg-theme-text-color)',
          }}
        >
          {content || 'Информация о доставке загружается...'}
        </div>
        <div style={{ marginTop: 24, padding: 16, background: 'var(--accent-light)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-dark)', marginBottom: 4 }}>Бесплатная доставка</p>
          <p style={{ fontSize: 13, color: 'var(--tg-theme-hint-color)' }}>При сумме заказа от 1000₽</p>
        </div>
      </div>
    </div>
  );
}
