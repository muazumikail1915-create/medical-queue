import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QueueCard } from '../../components/cards/QueueCard';
import { useQueueStore } from '../../store/useQueueStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../services/socketService';
import { Volume2, VolumeX, Clock, MapPin, User, Stethoscope, RefreshCw, Radio } from 'lucide-react';

export const LiveQueueStatusPage: React.FC = () => {
  const { user } = useAuthStore();
  const { queue, soundEnabled, toggleSound, getPatientActiveTicket } = useQueueStore();
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());

  const activeTicket = user ? getPatientActiveTicket(user.id) || getPatientActiveTicket('pat-1') : undefined;

  useEffect(() => {
    socketService.connect();
    const unsubscribe = socketService.subscribeQueue(() => {
      setLastUpdate(new Date().toLocaleTimeString());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Live Hospital OPD Queue Tracker</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Real-time socket synchronization. Last sync: {lastUpdate}</p>
        </div>

        <Button
          size="sm"
          variant={soundEnabled ? 'primary' : 'outline'}
          icon={soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          onClick={toggleSound}
        >
          {soundEnabled ? 'Audio Alerts ON' : 'Audio Muted'}
        </Button>
      </div>

      {/* Active Ticket Banner */}
      {activeTicket ? (
        <div className="space-y-3">
          <Badge variant="called" className="text-xs font-bold px-3 py-1">YOUR ACTIVE TICKET</Badge>
          <QueueCard ticket={activeTicket} isMyTicket />
        </div>
      ) : (
        <Card className="p-6 text-center text-xs text-slate-500 bg-emerald-50/30 border-dashed border-emerald-200 dark:border-emerald-900">
          You currently have no active ticket in queue today. Check in at the reception desk to receive a live queue ticket.
        </Card>
      )}

      {/* Active OPD Queue Grid across hospital */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Live Clinic Queue Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queue.map((ticket) => (
            <QueueCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
};
