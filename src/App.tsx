import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientLHRPage } from './pages/patient/PatientLHRPage';
import { BookAppointmentPage } from './pages/patient/BookAppointmentPage';
import { LiveQueueStatusPage } from './pages/patient/LiveQueueStatusPage';
import { UpcomingAppointmentsPage } from './pages/patient/UpcomingAppointmentsPage';
import { AppointmentHistoryPage } from './pages/patient/AppointmentHistoryPage';
import { PatientNotificationsPage } from './pages/patient/PatientNotificationsPage';
import { PatientProfilePage } from './pages/patient/PatientProfilePage';

// Receptionist Pages
import { ReceptionDashboard } from './pages/receptionist/ReceptionDashboard';
import { QueueManagementPage } from './pages/receptionist/QueueManagementPage';
import { WalkInRegistrationPage } from './pages/receptionist/WalkInRegistrationPage';
import { ReceptionAppointmentsPage } from './pages/receptionist/ReceptionAppointmentsPage';
import { ReceptionPatientsPage } from './pages/receptionist/ReceptionPatientsPage';
import { ReceptionDoctorsPage } from './pages/receptionist/ReceptionDoctorsPage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorLHRPage } from './pages/doctor/DoctorLHRPage';
import { DoctorQueuePage } from './pages/doctor/DoctorQueuePage';
import { DoctorSchedulePage } from './pages/doctor/DoctorSchedulePage';
import { DoctorPatientDetailsPage } from './pages/doctor/DoctorPatientDetailsPage';
import { DoctorProfilePage } from './pages/doctor/DoctorProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLHRAuditPage } from './pages/admin/AdminLHRAuditPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminPatientsPage } from './pages/admin/AdminPatientsPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminUserManagementPage } from './pages/admin/AdminUserManagementPage';

// Global Components
import { ToastContainer } from './components/ui/ToastContainer';
import { useThemeStore } from './store/useThemeStore';
import { socketService } from './services/socketService';

export const App: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply dark class to root document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Start background live queue simulation socket
    socketService.startSimulation();
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
        <Routes>
          {/* Public Web Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Patient Portal */}
          <Route element={<DashboardLayout requiredRole="patient" />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/lhr" element={<PatientLHRPage />} />
            <Route path="/patient/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/patient/queue-status" element={<LiveQueueStatusPage />} />
            <Route path="/patient/upcoming-appointments" element={<UpcomingAppointmentsPage />} />
            <Route path="/patient/history" element={<AppointmentHistoryPage />} />
            <Route path="/patient/notifications" element={<PatientNotificationsPage />} />
            <Route path="/patient/profile" element={<PatientProfilePage />} />
          </Route>

          {/* Receptionist Portal */}
          <Route element={<DashboardLayout requiredRole="receptionist" />}>
            <Route path="/reception" element={<ReceptionDashboard />} />
            <Route path="/reception/queue" element={<QueueManagementPage />} />
            <Route path="/reception/walkin-register" element={<WalkInRegistrationPage />} />
            <Route path="/reception/appointments" element={<ReceptionAppointmentsPage />} />
            <Route path="/reception/patients" element={<ReceptionPatientsPage />} />
            <Route path="/reception/doctors" element={<ReceptionDoctorsPage />} />
          </Route>

          {/* Doctor Portal */}
          <Route element={<DashboardLayout requiredRole="doctor" />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/lhr" element={<DoctorLHRPage />} />
            <Route path="/doctor/queue" element={<DoctorQueuePage />} />
            <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
            <Route path="/doctor/patient" element={<DoctorPatientDetailsPage />} />
            <Route path="/doctor/patient/:id" element={<DoctorPatientDetailsPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>

          {/* Administrator Portal */}
          <Route element={<DashboardLayout requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lhr-audit" element={<AdminLHRAuditPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
            <Route path="/admin/patients" element={<AdminPatientsPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global Toast Notification System */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;

