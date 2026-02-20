import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading || !raffle) return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;

  const isCompleted = raffle.status === 'completed';

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>{raffle.title}</h1>
      <p style={{ color: 'var(--tg-theme-hint-color)', marginBottom: 16 }}>{raffle.description}</p>
      <p style={{ marginBottom: 16 }}>
        <strong>{(raffle.price_per_slot / 100).toFixed(0)} ₽</strong> за номер · Купить можно любое количество
      </p>

      {isCompleted && raffle.winner_slot != null && (
        <div
          style={{
            padding: 16,
            background: '#e8f5e9',
            borderRadius: 12,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2e7d32' }}>🎉 Розыгрыш завершён!</div>
          <div style={{ marginTop: 8 }}>Победитель: номер {raffle.winner_slot}</div>
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>Выберите номера</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8,
          marginBottom: 16,
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
                padding: 12,
                borderRadius: 8,
                border: isSel ? '2px solid var(--tg-theme-button-color)' : '1px solid #ddd',
                background: isPaid ? '#e0e0e0' : isSel ? 'rgba(36,129,204,0.1)' : '#fff',
                color: isPaid ? '#999' : 'inherit',
                cursor: isPaid ? 'not-allowed' : 'pointer',
                fontWeight: isSel ? 'bold' : 'normal',
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && !isCompleted && (
        <>
          <p style={{ marginBottom: 8 }}>
            Выбрано: {selected.length} · Сумма: {((selected.length * raffle.price_per_slot) / 100).toFixed(0)} ₽
          </p>
          {error && <p style={{ color: '#c62828', marginBottom: 8 }}>{error}</p>}
          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              width: '100%',
              padding: 14,
              background: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: paying ? 'wait' : 'pointer',
            }}
          >
            {paying ? 'Ожидание...' : 'Оплатить (Сбер)'}
          </button>
          <p style={{ fontSize: 12, color: 'var(--tg-theme-hint-color)', marginTop: 8 }}>
            Номера запишутся только после подтверждения оплаты
          </p>
        </>
      )}
    </div>
  );
}
