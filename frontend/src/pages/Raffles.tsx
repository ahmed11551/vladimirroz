import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';

type Raffle = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  emoji?: string;
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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка розыгрышей...</span>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Розыгрыши</h1>
          <p className="page-subtitle">Выберите продукт и участвуйте</p>
        </div>
        <Link to="/cabinet" className="btn btn--secondary" style={{ textDecoration: 'none', padding: '10px 18px', fontSize: 14 }}>
          👤 Мой кабинет
        </Link>
      </header>

      {raffles.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🎁</p>
          <p style={{ color: 'var(--tg-theme-hint-color)', fontSize: 16 }}>Нет активных розыгрышей</p>
          <p style={{ color: 'var(--tg-theme-hint-color)', fontSize: 14, marginTop: 8 }}>Скоро появятся новые!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {raffles.map((r) => {
            const progress = r.total_slots > 0 ? Math.round((r.paid_slots / r.total_slots) * 100) : 0;
            return (
              <Link
                key={r.id}
                to={`/raffles/${r.id}`}
                className="card"
                style={{
                  display: 'block',
                  padding: 0,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', padding: 20, gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      minWidth: 64,
                      background: 'var(--accent-light)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                    }}
                  >
                    {r.emoji || '🎁'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{r.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--tg-theme-hint-color)', marginBottom: 12, lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>
                        {(r.price_per_slot / 100).toFixed(0)} ₽
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--tg-theme-hint-color)' }}>
                        номер
                      </span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>Заполнено</span>
                        <span style={{ fontWeight: 600 }}>{r.paid_slots} / {r.total_slots}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--tg-theme-bg-color)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--accent)',
                            borderRadius: 3,
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
