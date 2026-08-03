import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Phone, Mail, Droplets, AlertTriangle, Clock } from 'lucide-react';
import { Patient } from '../../types';

export interface PatientCardProps {
  patient: Patient;
  onSelect?: (patient: Patient) => void;
  onNewAppointment?: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, onNewAppointment }) => {
  return (
    <Card hoverable className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar src={patient.avatar} name={patient.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{patient.name}</h4>
            <span className="text-xs font-mono font-bold text-slate-400">{patient.mrn}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="info">{patient.bloodGroup}</Badge>
            <span className="text-xs text-slate-500 capitalize">{patient.gender}, {patient.dateOfBirth}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{patient.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{patient.totalVisits} Total Visits</span>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && patient.allergies[0] !== 'None' && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Allergies: {patient.allergies.join(', ')}</span>
        </div>
      )}

      {(onSelect || onNewAppointment) && (
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {onSelect && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onSelect(patient)}>
              View Records
            </Button>
          )}
          {onNewAppointment && (
            <Button size="sm" variant="primary" className="flex-1" onClick={() => onNewAppointment(patient)}>
              Book Appointment
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
