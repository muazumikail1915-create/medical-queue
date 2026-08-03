import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Star, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { Doctor } from '../../types';

export interface DoctorCardProps {
  doctor: Doctor;
  onBook?: (doc: Doctor) => void;
  onSelect?: (doc: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onSelect }) => {
  return (
    <Card hoverable className="space-y-4">
      <div className="flex items-start gap-3.5">
        <Avatar src={doctor.avatar} name={doctor.name} size="lg" status={doctor.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{doctor.name}</h4>
            <Badge variant={doctor.status === 'available' ? 'success' : doctor.status === 'in-session' ? 'warning' : 'neutral'}>
              {doctor.status.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{doctor.specialty}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doctor.qualification}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold">{doctor.rating}</span>
          <span className="text-slate-400">({doctor.reviewsCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{doctor.experienceYears} yrs exp</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">{doctor.roomNumber}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">${doctor.consultationFee}</span>
        </div>
      </div>

      {(onBook || onSelect) && (
        <div className="pt-2">
          {onBook && (
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => onBook(doctor)}
            >
              Book Appointment
            </Button>
          )}
          {onSelect && !onBook && (
            <Button size="sm" variant="outline" className="w-full" onClick={() => onSelect(doctor)}>
              Select Doctor
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
