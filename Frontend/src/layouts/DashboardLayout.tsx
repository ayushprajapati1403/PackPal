import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageCheck,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart2,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user, logout, loadUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await loadUser();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user]);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/products', icon: PackageCheck, label: 'Products' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    // <div className="min-h-screen bg-slate-50">
    //   {/* Sidebar */}
    //   <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
    //     <div className="flex items-center justify-between p-4 border-b border-slate-700">
    //       <h1 className={`text-xl font-bold text-white ${!isSidebarOpen && 'hidden'}`}>Admin Pro</h1>
    //       <button
    //         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //         className="p-2 rounded-lg hover:bg-slate-700 text-white"
    //       >
    //         {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
    //       </button>
    //     </div>

    //     <nav className="p-4 space-y-1">
    //       {navItems.map((item) => {
    //         const Icon = item.icon;
    //         const isActive = location.pathname === item.path;
    //         return (
    //           <Link
    //             key={item.path}
    //             to={item.path}
    //             className={`flex items-center p-3 rounded-lg transition-all ${isActive
    //               ? 'bg-blue-500 text-white'
    //               : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    //               }`}
    //           >
    //             <Icon size={20} className="mr-3" />
    //             <span className={`${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
    //           </Link>
    //         );
    //       })}
    //     </nav>

    //     <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
    //       <button
    //         onClick={handleLogout}
    //         className="flex items-center w-full p-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
    //       >
    //         <LogOut size={20} className="mr-3" />
    //         <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
    //       </button>
    //     </div>
    //   </aside>

    //   {/* Main Content */}
    //   <div className={`${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
    //     <Outlet />
    //   </div>
    // </div>
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}