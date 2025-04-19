import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../lib/theme-provider';
import { PackageCheck, LogOut, LayoutDashboard } from 'lucide-react';
import ScrollToTopLink from './ScrollToTopLink';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      // Navigate to the appropriate dashboard based on user role
      if (user.role === 'Owner') {
        navigate('/dashboard/owner');
      } else if (user.role === 'Admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'Member') {
        navigate('/dashboard/member');
      } else if (user.role === 'viewer') {
        navigate('/dashboard/viewer');
      } else {
        // Default to admin dashboard if role is not specified
        navigate('/dashboard/admin');
      }
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <ScrollToTopLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <PackageCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">PackPal</span>
            </ScrollToTopLink>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <ScrollToTopLink
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/'
                ? 'text-primary'
                : 'text-foreground/80 hover:text-primary'
                }`}
            >
              Home
            </ScrollToTopLink>
            <button
              onClick={handleDashboardClick}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${location.pathname.startsWith('/dashboard')
                ? 'text-primary'
                : 'text-foreground/80 hover:text-primary'
                }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <ScrollToTopLink
              to="/about"
              className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/about'
                ? 'text-primary'
                : 'text-foreground/80 hover:text-primary'
                }`}
            >
              About
            </ScrollToTopLink>
            <ScrollToTopLink
              to="/contact"
              className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/contact'
                ? 'text-primary'
                : 'text-foreground/80 hover:text-primary'
                }`}
            >
              Contact Us
            </ScrollToTopLink>
            <ScrollToTopLink
              to="/chatbot"
              className={`text-sm font-medium transition-colors duration-200 ${location.pathname === '/chatbot'
                ? 'text-primary'
                : 'text-foreground/80 hover:text-primary'
                }`}
            >
              AI Assistant
            </ScrollToTopLink>
          </div>

          {/* Right side - Auth Buttons and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-foreground/80">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <ScrollToTopLink
                  to="/login"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  Login
                </ScrollToTopLink>
                <ScrollToTopLink
                  to="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Sign Up
                </ScrollToTopLink>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;