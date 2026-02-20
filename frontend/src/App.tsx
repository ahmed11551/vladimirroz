import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Assortment } from './pages/Assortment';
import { Reviews } from './pages/Reviews';
import { Delivery } from './pages/Delivery';
import { Raffles } from './pages/Raffles';
import { RaffleDetail } from './pages/RaffleDetail';
import { Cabinet } from './pages/Cabinet';
import { Admin } from './pages/Admin';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Raffles />} />
          <Route path="assortment" element={<Assortment />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="raffles" element={<Raffles />} />
          <Route path="raffles/:id" element={<RaffleDetail />} />
          <Route path="cabinet" element={<Cabinet />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
