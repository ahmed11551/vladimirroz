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

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Отзывы</h1>
      <div style={{ marginBottom: 24 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напишите отзыв..."
          style={{
            width: '100%',
            minHeight: 100,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #ddd',
            fontSize: 14,
            resize: 'vertical',
          }}
        />
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              style={{
                padding: 4,
                background: rating >= r ? '#ffc107' : '#eee',
                border: 'none',
                borderRadius: 4,
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
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              border: 'none',
              borderRadius: 8,
              cursor: sending ? 'wait' : 'pointer',
            }}
          >
            Отправить
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 16,
              background: 'var(--tg-theme-secondary-bg-color)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>{r.first_name || r.username || 'Аноним'}</strong>
              <span style={{ color: '#ffc107' }}>{'★'.repeat(r.rating)}</span>
            </div>
            <p style={{ fontSize: 14 }}>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
