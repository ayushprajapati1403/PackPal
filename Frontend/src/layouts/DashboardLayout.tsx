import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

// import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/sidebar';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const { user, loadUser } = useAuthStore();
  const navigate = useNavigate();


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const init = async () => {
      await loadUser();
      setLoading(false);
    };
    init();
  }, [loadUser]);



  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);



  return (
    <>
      <div className="min-h-screen bg-slate-50">

        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>


          <Outlet />
          <Footer />
        </div>
      </div>
    </>

  );
}