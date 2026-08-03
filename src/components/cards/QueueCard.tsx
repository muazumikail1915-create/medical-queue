import type { FC } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, MapPin, User, Stethoscope, AlertCircle, Volume2 } from 'lucide-react';
import type { QueueItem } from '../../types';

interface QueueCardProps {
  ticket: QueueItem;
  isMyTicket?: boolean;
  onCallNext?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const QueueCard: FC<QueueCardProps> = ({
  ticket,
  isMyTicket = false,
  onCallNext,
  onComplete,
  onSkip,
}: QueueCardProps) => {
  const isCalled = ticket.status === 'called';
  const isInProgress = ticket.status === 'in-progress';

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isCalled
          ? 'ring-2 ring-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md'
          : isInProgress
            ? 'border-emerald-500/50'
            : ''
      }`}
    >
      {isCalled && (
        <div className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between animate-pulse -mx-5 -mt-5 mb-4">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> YOUR TICKET HAS BEEN CALLED!
          </span>
          <span>ROOM {ticket.roomNumber}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-mono">
              {ticket.ticketNumber}
            </span>
            {ticket.isPriority && (
              <Badge variant="warning" className="text-[10px]">
                PRIORITY
              </Badge>
            )}
            <Badge
              variant={
                ticket.status === 'in-progress'
                  ? 'in-progress'
                  : ticket.status === 'called'
                    ? 'called'
                    : ticket.status === 'waiting'
                      ? 'waiting'
                      : 'completed'
              }
            >
              {ticket.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" /> {ticket.patientName} ({ticket.patientAge}y, {ticket.patientGender})
          </p>
        </div>

        {ticket.status === 'waiting' && (
          <div className="text-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Position</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">#{ticket.position}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Stethoscope className="w-4 h-4 text-emerald-500" />
          <span className="truncate font-medium">{ticket.doctorName}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{ticket.roomNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Check-in: {ticket.checkInTime}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="font-medium text-amber-700 dark:text-amber-400">~{ticket.estimatedWaitMinutes} min wait</span>
        </div>
      </div>

      {(onCallNext || onComplete || onSkip) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {ticket.status === 'waiting' && onCallNext && (
            <Button size="sm" variant="primary" className="flex-1" onClick={onCallNext}>
              Call Patient
            </Button>
          )}
          {(ticket.status === 'called' || ticket.status === 'in-progress') && onComplete && (
            <Button size="sm" variant="primary" className="flex-1" onClick={onComplete}>
              Complete Consultation
            </Button>
          )}
          {ticket.status === 'waiting' && onSkip && (
            <Button size="sm" variant="outline" onClick={onSkip}>
              Skip
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
