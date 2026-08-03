import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QueueCard } from '../../components/cards/QueueCard';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { DoctorCard } from '../../components/cards/DoctorCard';
import { useAuthStore } from '../../store/useAuthStore';
import { useQueueStore } from '../../store/useQueueStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { mockDoctors } from '../../data/mockData';
import { Calendar, Clock, History, Bell, Plus, Activity, User, ShieldCheck, Heart } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getPatientActiveTicket } = useQueueStore();
  const { appointments, cancelAppointment, rescheduleAppointment } = useAppointmentStore();

  const activeTicket = user ? getPatientActiveTicket(user.id) || getPatientActiveTicket('pat-1') : undefined;
  const myAppointments = appointments.filter((a) => a.patientId === (user?.id || 'pat-1'));
  const upcomingApts = myAppointments.filter((a) => a.status === 'scheduled' || a.status === 'in-queue');

  return (
    <div className="space-y-6">
      {/* Patient Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="success" className="bg-white/20 text-white border-white/30 text-[10px]">
            MEDICAL RECORD #MRN-90821
          </Badge>
          <h1 className="text-2xl font-black tracking-tight">Good Day, {user?.name || 'Alexander'}!</h1>
          <p className="text-xs text-emerald-100">
            You have {upcomingApts.length} upcoming appointment and {activeTicket ? '1 active live queue ticket' : '0 queue tickets'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/patient/book-appointment">
            <Button size="md" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold border-none shadow-sm">
              <Plus className="w-4 h-4" /> Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Queue Ticket Alert Banner */}
      {activeTicket && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active Queue Status
            </h2>
            <Link to="/patient/queue-status" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              Open Live Tracker →
            </Link>
          </div>
          <QueueCard ticket={activeTicket} isMyTicket />
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{upcomingApts.length}</span>
            <span className="block text-xs text-slate-500">Upcoming Visits</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {activeTicket ? `#${activeTicket.position}` : 'N/A'}
            </span>
            <span className="block text-xs text-slate-500">Current Queue Position</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{myAppointments.length}</span>
            <span className="block text-xs text-slate-500">Total Consultations</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">O+</span>
            <span className="block text-xs text-slate-500">Blood Type</span>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Upcoming Appointments</h2>
          <Link to="/patient/upcoming-appointments" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            View All ({upcomingApts.length})
          </Link>
        </div>

        {upcomingApts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingApts.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onCancel={(id) => cancelAppointment(id)}
                onReschedule={(id) => rescheduleAppointment(id, '2026-08-05', '10:30 AM')}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-xs text-slate-500">
            No upcoming appointments scheduled. Need care?{' '}
            <Link to="/patient/book-appointment" className="text-emerald-600 font-bold hover:underline">
              Book a doctor now
            </Link>
          </Card>
        )}
      </div>

      {/* Top Doctors Quick Select */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Available Doctors Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockDoctors.slice(0, 3).map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onBook={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
};
