import React from 'react';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Calendar, Plus } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const UpcomingAppointmentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { appointments, cancelAppointment, rescheduleAppointment } = useAppointmentStore();

  const myUpcoming = appointments.filter(
    (a) => a.patientId === (user?.id || 'pat-1') && (a.status === 'scheduled' || a.status === 'in-queue')
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Upcoming Appointments</h1>
          <p className="text-xs text-slate-500">Manage scheduled visits, reschedule dates, or cancel if needed</p>
        </div>

        <Link to="/patient/book-appointment">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Book New Visit
          </Button>
        </Link>
      </div>

      {myUpcoming.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myUpcoming.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={(id) => cancelAppointment(id)}
              onReschedule={(id) => rescheduleAppointment(id, '2026-08-06', '11:00 AM')}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Upcoming Appointments"
          description="You don't have any visits scheduled. Book an appointment with a specialist."
          actionLabel="Book Appointment"
          onAction={() => window.location.href = '/patient/book-appointment'}
        />
      )}
    </div>
  );
};
