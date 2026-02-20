import { Outlet } from 'react-router-dom';
import { Nav } from './Nav';

export function Layout() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
      <Nav />
    </div>
  );
}
