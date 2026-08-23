import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { PrintTicketModal } from '../../components/ui/PrintTicketModal';
import { useQueueStore } from '../../store/useQueueStore';
import { QueueItem } from '../../types';
import { Volume2, CheckCircle2, FastForward, Printer, RefreshCw } from 'lucide-react';

export const QueueManagementPage: React.FC = () => {
  const { queue, callNextPatient, completeConsultation, skipPatient } = useQueueStore();
  const [selectedTicketToPrint, setSelectedTicketToPrint] = useState<QueueItem | null>(null);

  const columns: Column<QueueItem>[] = [
    {
      header: 'Ticket #',
      accessor: (row) => <span className="font-mono font-black text-slate-900 dark:text-slate-100">{row.ticketNumber}</span>,
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
      header: 'Doctor & Room',
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">{row.doctorName}</span>
          <span className="text-xs text-emerald-600 font-bold">{row.roomNumber}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Type',
      accessor: (row) => (
        <Badge variant={row.type === 'walk-in' ? 'warning' : 'info'}>
          {row.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.status === 'in-progress' ? 'in-progress' : row.status === 'called' ? 'called' : row.status === 'waiting' ? 'waiting' : 'completed'}>
            {row.status.toUpperCase()}
          </Badge>
          {row.triageStatus && (
            <Badge
              variant={row.triageStatus === 'red' ? 'danger' : row.triageStatus === 'yellow' ? 'warning' : 'success'}
              className="w-fit"
            >
              {row.triageStatus.toUpperCase()}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Check-In',
      accessor: 'checkInTime',
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'waiting' && (
            <Button size="sm" variant="primary" icon={<Volume2 className="w-3.5 h-3.5" />} onClick={() => callNextPatient(row.doctorId)}>
              Call
            </Button>
          )}
          {(row.status === 'called' || row.status === 'in-progress') && (
            <Button size="sm" variant="primary" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => completeConsultation(row.id)}>
              Complete
            </Button>
          )}
          {row.status === 'waiting' && (
            <Button size="sm" variant="outline" icon={<FastForward className="w-3.5 h-3.5" />} onClick={() => skipPatient(row.id)}>
              Skip
            </Button>
          )}
          <button
            onClick={() => setSelectedTicketToPrint(row)}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg"
            title="Print Ticket"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">OPD Queue Management Matrix</h1>
        <p className="text-xs text-slate-500">Live operational queue grid with patient calling and printing controls</p>
      </div>

      <DataTable data={queue} columns={columns} searchPlaceholder="Search ticket, patient, or doctor..." pageSize={8} />

      <PrintTicketModal isOpen={!!selectedTicketToPrint} onClose={() => setSelectedTicketToPrint(null)} ticket={selectedTicketToPrint} />
    </div>
  );
};
