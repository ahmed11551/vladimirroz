import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/assortment', label: 'Ассортимент', icon: '🛒' },
  { to: '/reviews', label: 'Отзывы', icon: '⭐' },
  { to: '/delivery', label: 'Доставка', icon: '🚚' },
  { to: '/raffles', label: 'Розыгрыши', icon: '🎁' },
];

export function Nav() {
  return (
    <nav className="nav">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
