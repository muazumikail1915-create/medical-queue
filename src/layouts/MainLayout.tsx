import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { ToastContainer } from '../components/ui/ToastContainer';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuthStore();

  const getPortalLink = () => {
    switch (role) {
      case 'patient': return '/patient';
      case 'receptionist': return '/reception';
      case 'doctor': return '/doctor';
      case 'admin': return '/admin';
      default: return '/patient';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200 font-sans transition-colors">
      <Header title="Public Portal" />

      {/* Top Navbar Links for Public Pages */}
      <nav className="bg-white/80 dark:bg-[#09090b]/80 border-b border-slate-200 dark:border-[#27272a] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
              Home
            </Link>
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
              About Hospital
            </Link>
            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={getPortalLink()}>
                <Button size="sm" variant="primary">
                  Go to {role.toUpperCase()} Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};
