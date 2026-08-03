import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QueueCard } from '../../components/cards/QueueCard';
import { useAuthStore } from '../../store/useAuthStore';
import { useQueueStore } from '../../store/useQueueStore';
import { mockDoctors, mockPatients } from '../../data/mockData';
import { Volume2, CheckCircle2, Clock, Users, Stethoscope, FileText, Activity } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { queue, callNextPatient, completeConsultation } = useQueueStore();

  const currentDoctor = mockDoctors[0]; // Dr. Sarah Jenkins
  const doctorQueue = queue.filter((q) => q.doctorId === currentDoctor.id);
  const activeInConsultation = doctorQueue.find((q) => q.status === 'in-progress' || q.status === 'called');
  const waitingPatients = doctorQueue.filter((q) => q.status === 'waiting');

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            ROOM {currentDoctor.roomNumber} • OPD CONSULTATION DESK
          </Badge>
          <h1 className="text-2xl font-black">{currentDoctor.name}</h1>
          <p className="text-xs text-slate-300">
            {currentDoctor.specialty} • {waitingPatients.length} patients waiting outside Room {currentDoctor.roomNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant="primary"
            icon={<Volume2 className="w-5 h-5" />}
            onClick={() => callNextPatient(currentDoctor.id)}
          >
            Call Next Patient
          </Button>
        </div>
      </div>

      {/* Active Consultation Spotlight Card */}
      {activeInConsultation ? (
        <Card className="p-6 border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-4 h-4 animate-pulse" /> Patient Currently In Consultation Room
            </span>
            <Badge variant="called">{activeInConsultation.ticketNumber}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-200 dark:border-slate-800 py-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Patient Name</span>
              <strong className="text-base text-slate-900 dark:text-slate-100">{activeInConsultation.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age / Gender</span>
              <strong className="text-sm text-slate-800 dark:text-slate-200">{activeInConsultation.patientAge} yrs, {activeInConsultation.patientGender}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Phone</span>
              <strong className="text-sm text-slate-800 dark:text-slate-200">{activeInConsultation.patientPhone}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/doctor/queue">
              <Button variant="primary" icon={<FileText className="w-4 h-4" />}>
                Write Consultation Notes & Complete
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center text-xs text-slate-500 bg-slate-50/50">
          No active patient currently inside Room {currentDoctor.roomNumber}. Click <strong>&quot;Call Next Patient&quot;</strong> to start consultation.
        </Card>
      )}

      {/* Waiting List Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Waiting Line Today ({waitingPatients.length})</h2>
          <Link to="/doctor/queue" className="text-xs font-semibold text-emerald-600 hover:underline">
            View Live Queue Grid →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {waitingPatients.map((ticket) => (
            <QueueCard
              key={ticket.id}
              ticket={ticket}
              onCallNext={() => callNextPatient(currentDoctor.id)}
              onComplete={() => completeConsultation(ticket.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
