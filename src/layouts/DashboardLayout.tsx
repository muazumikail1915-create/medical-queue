import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';

export interface DashboardLayoutProps {
  requiredRole?: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ requiredRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useAuthStore();

  const activeRole = requiredRole || role;

  const roleTitles: Record<UserRole, string> = {
    patient: 'Patient Care Portal',
    receptionist: 'Reception & Desk Management',
    doctor: 'Doctor Consultation Workspace',
    admin: 'Hospital Command & Analytics Center',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200 font-sans transition-colors">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={roleTitles[activeRole]} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:pl-64 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      <div className="lg:pl-64">
        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
};
