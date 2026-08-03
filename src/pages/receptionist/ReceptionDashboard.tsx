import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QueueCard } from '../../components/cards/QueueCard';
import { PrintTicketModal } from '../../components/ui/PrintTicketModal';
import { useQueueStore } from '../../store/useQueueStore';
import { mockDoctors } from '../../data/mockData';
import { Clock, UserPlus, Search, Calendar, Stethoscope, Printer, Users, Volume2 } from 'lucide-react';
import { QueueItem } from '../../types';

export const ReceptionDashboard: React.FC = () => {
  const { queue, callNextPatient, completeConsultation, skipPatient } = useQueueStore();
  const [selectedTicketToPrint, setSelectedTicketToPrint] = useState<QueueItem | null>(null);

  const waitingCount = queue.filter((q) => q.status === 'waiting').length;
  const inProgressCount = queue.filter((q) => q.status === 'in-progress' || q.status === 'called').length;
  const completedToday = queue.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Reception Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <Badge variant="info">RECEPTION DESK - MAIN OPD</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Today Queue & Registration Center</h1>
          <p className="text-xs text-slate-500">Manage patient check-ins, issue physical queue tickets, and direct OPD flows</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/reception/walkin-register">
            <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
              Register Walk-In Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{waitingCount}</span>
            <span className="block text-xs text-slate-500 font-medium">Waiting in Queue</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{inProgressCount}</span>
            <span className="block text-xs text-slate-500 font-medium">In Consultation</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{completedToday}</span>
            <span className="block text-xs text-slate-500 font-medium">Completed Today</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">8</span>
            <span className="block text-xs text-slate-500 font-medium">Active Doctors</span>
          </div>
        </Card>
      </div>

      {/* Doctor Call Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Quick Doctor Desk Controls</h2>
          <Link to="/reception/queue" className="text-xs font-semibold text-emerald-600 hover:underline">
            Manage Full Queue →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDoctors.slice(0, 3).map((doc) => {
            const doctorWaiting = queue.filter((q) => q.doctorId === doc.id && q.status === 'waiting');
            return (
              <Card key={doc.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.name}</span>
                  <Badge variant="info">{doc.roomNumber}</Badge>
                </div>
                <p className="text-xs text-slate-500">{doc.specialty} • {doctorWaiting.length} waiting</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    icon={<Volume2 className="w-3.5 h-3.5" />}
                    onClick={() => callNextPatient(doc.id)}
                  >
                    Call Next Patient
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Live Queue Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Active Queue Status Tickets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queue.map((ticket) => (
            <div key={ticket.id} className="relative group">
              <QueueCard
                ticket={ticket}
                onCallNext={() => callNextPatient(ticket.doctorId)}
                onComplete={() => completeConsultation(ticket.id)}
                onSkip={() => skipPatient(ticket.id)}
              />
              <button
                onClick={() => setSelectedTicketToPrint(ticket)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Print Ticket"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <PrintTicketModal isOpen={!!selectedTicketToPrint} onClose={() => setSelectedTicketToPrint(null)} ticket={selectedTicketToPrint} />
    </div>
  );
};
