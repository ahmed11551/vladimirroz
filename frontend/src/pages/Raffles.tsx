import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';

type Raffle = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  price_per_slot: number;
  total_slots: number;
  status: string;
  paid_slots: number;
};

export function Raffles() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ raffles: Raffle[] }>('/raffles')
      .then((r) => setRaffles(r.raffles))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24 }}>Розыгрыши</h1>
        <Link
          to="/cabinet"
          style={{
            padding: '8px 16px',
            background: 'var(--tg-theme-secondary-bg-color)',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'inherit',
            fontSize: 14,
          }}
        >
          Мой кабинет
        </Link>
      </div>

      {raffles.length === 0 ? (
        <p style={{ color: 'var(--tg-theme-hint-color)', textAlign: 'center', padding: 40 }}>
          Нет активных розыгрышей
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {raffles.map((r) => (
            <Link
              key={r.id}
              to={`/raffles/${r.id}`}
              style={{
                display: 'block',
                padding: 16,
                background: 'var(--tg-theme-secondary-bg-color)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {r.image_url && (
                <img
                  src={r.image_url}
                  alt=""
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                />
              )}
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', marginBottom: 8 }}>{r.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>{(r.price_per_slot / 100).toFixed(0)} ₽ / номер</span>
                <span>
                  {r.paid_slots} / {r.total_slots}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
