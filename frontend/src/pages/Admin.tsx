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
      <div className="card" style={{ padding: 48, textAlign: 'center' }}>
        <p style={{ fontSize: 18, marginBottom: 16 }}>Доступ запрещён</p>
        <Link to="/" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
          На главную
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Панель администратора</h1>
        <p className="page-subtitle">Роль: {user.role}</p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Розыгрыши</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {raffles.map((r) => (
            <div key={r.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: 15 }}>{r.title}</strong>
                <span className="badge" style={{ marginLeft: 8, background: r.status === 'active' ? 'var(--accent-light)' : '#f3f4f6', color: r.status === 'active' ? 'var(--accent-dark)' : '#6b7280' }}>
                  {r.status}
                </span>
              </div>
              <Link to={`/raffles/${r.id}`} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                Открыть →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <p style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>
        Полное управление — через API /admin/raffles
      </p>
    </div>
  );
}
