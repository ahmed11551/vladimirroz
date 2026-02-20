import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

type Product = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  emoji?: string;
  price: number | null;
};

export function Assortment() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ products: Product[] }>('/sections/assortment/products')
      .then((r) => setProducts(r.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка ассортимента...</span>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Ассортимент</h1>
        <p className="page-subtitle">Продукты, которые участвуют в розыгрышах</p>
      </header>

      <div style={{ display: 'grid', gap: 16 }}>
        {products.map((p) => (
          <div key={p.id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 56,
                height: 56,
                minWidth: 56,
                background: 'var(--accent-light)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              {p.emoji || '📦'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', lineHeight: 1.5 }}>{p.description}</p>
              {p.price != null && (
                <p style={{ marginTop: 12, fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>
                  {(p.price / 100).toFixed(0)} ₽
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
