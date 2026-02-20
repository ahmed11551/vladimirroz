import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/assortment', label: 'Ассортимент', icon: '📦' },
  { to: '/reviews', label: 'Отзывы', icon: '⭐' },
  { to: '/delivery', label: 'Доставка', icon: '🚚' },
  { to: '/raffles', label: 'Розыгрыши', icon: '🎁' },
];

export function Nav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'var(--tg-theme-bg-color)',
        borderTop: '1px solid #eee',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            flex: 1,
            padding: '10px 8px',
            textAlign: 'center' as const,
            textDecoration: 'none',
            color: isActive ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
            fontSize: 11,
          })}
        >
          <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
