import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
