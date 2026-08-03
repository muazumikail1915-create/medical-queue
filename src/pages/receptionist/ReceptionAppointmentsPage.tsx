import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useQueueStore } from '../../store/useQueueStore';
import { Appointment } from '../../types';
import { CheckCircle2, XCircle, Calendar, Plus } from 'lucide-react';

export const ReceptionAppointmentsPage: React.FC = () => {
  const { appointments, updateStatus, cancelAppointment } = useAppointmentStore();
  const { registerWalkIn } = useQueueStore();

  const handleCheckIn = (apt: Appointment) => {
    updateStatus(apt.id, 'checked-in');
    registerWalkIn({
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      patientAge: apt.patientAge || 35,
      patientGender: 'male',
      doctorId: apt.doctorId,
      departmentId: apt.departmentId,
    });
  };

  const columns: Column<Appointment>[] = [
    {
      header: 'Appt #',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.appointmentNumber}</span>,
      sortable: true,
    },
    {
      header: 'Patient Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.patientName}</span>
          <span className="text-xs text-slate-400">{row.patientPhone}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Doctor',
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{row.doctorName}</span>
          <span className="text-xs text-emerald-600">{row.departmentName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Date & Time',
      accessor: (row) => `${row.date} @ ${row.timeSlot}`,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status === 'scheduled' ? 'scheduled' : 'info'}>{row.status.toUpperCase()}</Badge>,
    },
    {
      header: 'Check-In Action',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'scheduled' && (
            <Button size="sm" variant="primary" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => handleCheckIn(row)}>
              Check-In Patient
            </Button>
          )}
          {row.status === 'scheduled' && (
            <Button size="sm" variant="danger" icon={<XCircle className="w-3.5 h-3.5" />} onClick={() => cancelAppointment(row.id)}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reception Appointment Schedule</h1>
        <p className="text-xs text-slate-500">Check-in arriving scheduled patients into today&apos;s live OPD queue</p>
      </div>

      <DataTable data={appointments} columns={columns} searchPlaceholder="Search patient or doctor..." pageSize={8} />
    </div>
  );
};
