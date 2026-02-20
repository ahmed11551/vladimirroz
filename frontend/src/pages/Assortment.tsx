import { useEffect, useState } from 'react';
import { apiGet } from '../api/client';

type Product = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
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

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Ассортимент</h1>
      <p style={{ color: 'var(--tg-theme-hint-color)', marginBottom: 24 }}>
        Товары, которые участвуют в розыгрышах
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 16,
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: 12,
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt=""
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
              />
            )}
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>{p.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>{p.description}</p>
            {p.price != null && (
              <p style={{ marginTop: 8, fontWeight: 'bold' }}>{(p.price / 100).toFixed(0)} ₽</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
