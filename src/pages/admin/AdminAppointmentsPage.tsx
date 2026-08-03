import React from 'react';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { Appointment } from '../../types';

export const AdminAppointmentsPage: React.FC = () => {
  const { appointments } = useAppointmentStore();

  const columns: Column<Appointment>[] = [
    {
      header: 'Appt #',
      accessor: (row) => <span className="font-mono font-bold">{row.appointmentNumber}</span>,
      sortable: true,
    },
    {
      header: 'Patient Name',
      accessor: 'patientName',
      sortable: true,
    },
    {
      header: 'Doctor',
      accessor: 'doctorName',
      sortable: true,
    },
    {
      header: 'Department',
      accessor: 'departmentName',
    },
    {
      header: 'Date/Slot',
      accessor: (row) => `${row.date} @ ${row.timeSlot}`,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status === 'scheduled' ? 'scheduled' : 'info'}>{row.status.toUpperCase()}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Appointments Master Log</h1>
        <p className="text-xs text-slate-500">Cross-hospital consultation scheduling records</p>
      </div>

      <DataTable data={appointments} columns={columns} searchPlaceholder="Search appointment, patient, or doctor..." pageSize={8} />
    </div>
  );
};
