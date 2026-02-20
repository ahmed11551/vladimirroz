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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка кабинета...</span>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Личный кабинет</h1>
        <p className="page-subtitle">Ваши выигрыши и номера</p>
      </header>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          🏆 Мои выигрыши
        </h2>
        {wins.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🎯</p>
            <p style={{ color: 'var(--tg-theme-hint-color)' }}>Пока нет выигрышей</p>
            <Link to="/raffles" style={{ display: 'inline-block', marginTop: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Участвовать в розыгрышах →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {wins.map((w) => (
              <div
                key={w.id}
                className="card"
                style={{
                  padding: 20,
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  border: '1px solid #6ee7b7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>🎉</span>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#047857' }}>{w.raffle_title}</h3>
                    <p style={{ fontSize: 14, color: '#065f46', marginTop: 4 }}>Выигрышный номер: <strong>{w.slot_number}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          🎫 Мои номера
        </h2>
        {slots.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>
            <p style={{ color: 'var(--tg-theme-hint-color)', textAlign: 'center' }}>Нет купленных номеров</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {slots.map((s) => (
              <Link
                key={`${s.raffle_id}-${s.slot_number}`}
                to={`/raffles/${s.raffle_id}`}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <strong style={{ fontSize: 15 }}>{s.title}</strong>
                <span className="badge">№ {s.slot_number}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Link
        to="/admin"
        className="card"
        style={{
          display: 'block',
          padding: 16,
          textAlign: 'center',
          color: 'var(--tg-theme-hint-color)',
          textDecoration: 'none',
          fontSize: 14,
        }}
      >
        Админ-панель
      </Link>
    </div>
  );
}
