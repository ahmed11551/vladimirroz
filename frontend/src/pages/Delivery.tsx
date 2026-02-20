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
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Доставка</h1>
      <div
        style={{
          padding: 16,
          background: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: 12,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
        }}
      >
        {content || 'Информация о доставке загружается...'}
      </div>
    </div>
  );
}
