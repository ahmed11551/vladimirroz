import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api/client';

type Raffle = {
  id: number;
  title: string;
  status: string;
  total_slots: number;
};

export function Admin() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ user: { role: string } }>('/auth/me')
      .then((r) => setUser(r.user))
      .catch(() => setUser(null));

    apiGet<{ raffles: Raffle[] }>('/admin/raffles')
      .then((r) => setRaffles(r.raffles))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user || !['admin', 'moderator'].includes(user.role)) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>Доступ запрещён</p>
        <Link to="/" style={{ color: 'var(--tg-theme-link-color)', marginTop: 16, display: 'block' }}>
          На главную
        </Link>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Панель администратора</h1>
      <p style={{ color: 'var(--tg-theme-hint-color)', marginBottom: 24 }}>
        Роль: {user.role}
      </p>

      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Розыгрыши</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {raffles.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: 8,
            }}
          >
            <div>
              <strong>{r.title}</strong>
              <span style={{ marginLeft: 8, color: 'var(--tg-theme-hint-color)' }}>{r.status}</span>
            </div>
            <Link to={`/raffles/${r.id}`} style={{ color: 'var(--tg-theme-link-color)', fontSize: 14 }}>
              Открыть
            </Link>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>
        Полное управление (создание, редактирование) — через API /admin/raffles. Можно добавить форму в приложение.
      </p>
    </div>
  );
}
