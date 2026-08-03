import React from 'react';
import { Card } from '../../components/ui/Card';
import { AppointmentCard } from '../../components/cards/AppointmentCard';
import { useAppointmentStore } from '../../store/useAppointmentStore';

export const DoctorSchedulePage: React.FC = () => {
  const { appointments } = useAppointmentStore();
  const doctorAppointments = appointments.filter((a) => a.doctorId === 'doc-1');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Doctor Daily OPD Schedule</h1>
        <p className="text-xs text-slate-500">Timeline of booked appointments for Dr. Sarah Jenkins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctorAppointments.map((apt) => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </div>
    </div>
  );
};
