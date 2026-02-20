import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';

type Win = {
  id: number;
  raffle_title: string;
  slot_number: number;
  image_url: string | null;
  created_at: string;
};

type Slot = {
  raffle_id: number;
  slot_number: number;
  title: string;
  raffle_status: string;
};

export function Cabinet() {
  const [wins, setWins] = useState<Win[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<{ wins: Win[] }>('/user/wins'),
      apiGet<{ slots: Slot[] }>('/user/slots'),
    ])
      .then(([w, s]) => {
        setWins(w.wins);
        setSlots(s.slots);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Личный кабинет</h1>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Мои выигрыши</h2>
      {wins.length === 0 ? (
        <p style={{ color: 'var(--tg-theme-hint-color)', marginBottom: 24 }}>Пока нет выигрышей</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {wins.map((w) => (
            <div
              key={w.id}
              style={{
                padding: 16,
                background: '#e8f5e9',
                borderRadius: 12,
                border: '1px solid #a5d6a7',
              }}
            >
              <h3 style={{ color: '#2e7d32' }}>🎉 {w.raffle_title}</h3>
              <p>Выигрышный номер: {w.slot_number}</p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Мои номера</h2>
      {slots.length === 0 ? (
        <p style={{ color: 'var(--tg-theme-hint-color)' }}>Нет купленных номеров</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slots.map((s) => (
            <Link
              key={`${s.raffle_id}-${s.slot_number}`}
              to={`/raffles/${s.raffle_id}`}
              style={{
                display: 'block',
                padding: 16,
                background: 'var(--tg-theme-secondary-bg-color)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <strong>{s.title}</strong> — номер {s.slot_number}
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/admin"
        style={{
          display: 'block',
          marginTop: 24,
          padding: 12,
          textAlign: 'center',
          background: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: 8,
          color: 'inherit',
          textDecoration: 'none',
          fontSize: 14,
        }}
      >
        Админ-панель
      </Link>
    </div>
  );
}
