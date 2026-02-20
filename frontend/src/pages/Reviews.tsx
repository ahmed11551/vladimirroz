import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

type Review = {
  id: number;
  content: string;
  rating: number;
  first_name: string | null;
  username: string | null;
  created_at: string;
};

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  const load = () => {
    apiGet<{ reviews: Review[] }>('/sections/reviews/list')
      .then((r) => setReviews(r.reviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      await apiPost('/user/reviews', { content: content.trim(), rating });
      setContent('');
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка отзывов...</span>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Отзывы</h1>
        <p className="page-subtitle">Что говорят наши победители</p>
      </header>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Оставить отзыв</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Поделитесь впечатлениями..."
          style={{
            width: '100%',
            minHeight: 100,
            padding: 14,
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e5e7eb',
            fontSize: 15,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>Оценка:</span>
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              style={{
                padding: 6,
                background: rating >= r ? '#fbbf24' : '#f3f4f6',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ★
            </button>
          ))}
          <button
            onClick={submit}
            disabled={sending || !content.trim()}
            className="btn btn--primary"
            style={{ marginLeft: 'auto', width: 'auto', padding: '10px 20px' }}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>⭐</p>
            <p style={{ color: 'var(--tg-theme-hint-color)' }}>Пока нет отзывов. Будьте первым!</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <strong style={{ fontSize: 15 }}>{r.first_name || r.username || 'Аноним'}</strong>
                <span style={{ color: '#fbbf24', fontSize: 14 }}>{'★'.repeat(r.rating)}</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6 }}>{r.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
