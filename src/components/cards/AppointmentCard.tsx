import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, Clock, MapPin, User, Stethoscope, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '../../types';

export interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onViewDetails?: (apt: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
  onViewDetails,
}) => {
  const statusVariants = {
    scheduled: 'scheduled' as const,
    'checked-in': 'info' as const,
    'in-queue': 'waiting' as const,
    'in-consultation': 'in-progress' as const,
    completed: 'completed' as const,
    cancelled: 'cancelled' as const,
    'no-show': 'danger' as const,
  };

  return (
    <Card hoverable className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">{appointment.appointmentNumber}</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{appointment.doctorName}</span>
          </h4>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{appointment.doctorSpecialty}</p>
        </div>
        <Badge variant={statusVariants[appointment.status]}>
          {appointment.status.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold">{appointment.timeSlot}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{appointment.hospitalName} ({appointment.departmentName})</span>
        </div>
      </div>

      {appointment.symptoms && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
          &ldquo;{appointment.symptoms}&rdquo;
        </p>
      )}

      {(onCancel || onReschedule || onViewDetails) && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {onViewDetails && (
            <Button size="sm" variant="ghost" icon={<FileText className="w-3.5 h-3.5" />} onClick={() => onViewDetails(appointment)}>
              Details
            </Button>
          )}
          {appointment.status === 'scheduled' && onReschedule && (
            <Button size="sm" variant="outline" onClick={() => onReschedule(appointment.id)}>
              Reschedule
            </Button>
          )}
          {appointment.status === 'scheduled' && onCancel && (
            <Button size="sm" variant="danger" onClick={() => onCancel(appointment.id)}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
