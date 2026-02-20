import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost } from '../api/client';

type Slot = {
  slot_number: number;
  user_id: number | null;
  payment_status: string;
  username: string | null;
  first_name: string | null;
};

type Raffle = {
  id: number;
  title: string;
  description: string;
  emoji?: string;
  price_per_slot: number;
  total_slots: number;
  status: string;
  winner_slot: number | null;
  paid_slots: number;
};

export function RaffleDetail() {
  const { id } = useParams();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    apiGet<{ raffle: Raffle; slots: Slot[] }>(`/raffles/${id}`)
      .then((r) => {
        setRaffle(r.raffle);
        setSlots(r.slots);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const toggleSlot = (n: number) => {
    const slot = slots.find((s) => s.slot_number === n);
    if (slot?.payment_status === 'paid') return;
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  };

  const handlePay = async () => {
    if (selected.length === 0) {
      setError('Выберите хотя бы один номер');
      return;
    }
    setPaying(true);
    setError('');
    try {
      const res = await apiPost<{ paymentUrl: string }>('/payments/reserve', {
        raffleId: Number(id),
        slotNumbers: selected,
      });
      if (res.paymentUrl) {
        window.open(res.paymentUrl, '_blank');
        setSelected([]);
        setTimeout(load, 2000);
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally {
      setPaying(false);
    }
  };

  if (loading || !raffle) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Загрузка...</span>
      </div>
    );
  }

  const isCompleted = raffle.status === 'completed';

  return (
    <div>
      <Link to="/raffles" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--tg-theme-hint-color)', textDecoration: 'none', fontSize: 14 }}>
        ← Назад к розыгрышам
      </Link>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              minWidth: 80,
              background: 'var(--accent-light)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            {raffle.emoji || '🎁'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{raffle.title}</h1>
            <p style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)', lineHeight: 1.5 }}>{raffle.description}</p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>
                {(raffle.price_per_slot / 100).toFixed(0)} ₽
              </span>
              <span style={{ fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>за номер</span>
            </div>
          </div>
        </div>

        {isCompleted && raffle.winner_slot != null && (
          <div
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#047857' }}>Розыгрыш завершён!</div>
            <div style={{ marginTop: 8, fontSize: 16 }}>Победитель: номер <strong>{raffle.winner_slot}</strong></div>
          </div>
        )}
      </div>

      {!isCompleted && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Выберите номера</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 10,
              marginBottom: 24,
            }}
          >
            {Array.from({ length: raffle.total_slots }, (_, i) => i + 1).map((n) => {
              const slot = slots.find((s) => s.slot_number === n);
              const isPaid = slot?.payment_status === 'paid';
              const isSel = selected.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => toggleSlot(n)}
                  disabled={isPaid}
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    border: isSel ? '2px solid var(--accent)' : '1px solid #e5e7eb',
                    background: isPaid ? '#f3f4f6' : isSel ? 'var(--accent-light)' : 'white',
                    color: isPaid ? '#9ca3af' : 'inherit',
                    cursor: isPaid ? 'not-allowed' : 'pointer',
                    fontWeight: isSel ? 700 : 500,
                    fontSize: 15,
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
                <span>Выбрано номеров:</span>
                <strong>{selected.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15 }}>
                <span>Сумма:</span>
                <strong style={{ color: 'var(--accent)', fontSize: 18 }}>
                  {((selected.length * raffle.price_per_slot) / 100).toFixed(0)} ₽
                </strong>
              </div>
              {error && (
                <p style={{ color: '#dc2626', marginBottom: 12, fontSize: 14 }}>{error}</p>
              )}
              <button
                onClick={handlePay}
                disabled={paying}
                className="btn btn--primary"
              >
                {paying ? 'Ожидание...' : '💳 Оплатить через Сбер'}
              </button>
              <p style={{ fontSize: 12, color: 'var(--tg-theme-hint-color)', marginTop: 12, textAlign: 'center' }}>
                Номера запишутся только после подтверждения оплаты
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
