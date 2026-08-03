import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { mockDoctors } from '../../data/mockData';
import { useToastStore } from '../../store/useToastStore';
import { Save, Stethoscope, Clock, MapPin, DollarSign } from 'lucide-react';

export const DoctorProfilePage: React.FC = () => {
  const doctor = mockDoctors[0];
  const [status, setStatus] = useState(doctor.status);
  const [consultationFee, setConsultationFee] = useState(doctor.consultationFee);
  const addToast = useToastStore((s) => s.addToast);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Doctor Status & Settings Saved' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Doctor Profile & Availability Settings</h1>
        <p className="text-xs text-slate-500">Set active OPD status, consultation fee, and room number</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <Avatar src={doctor.avatar} name={doctor.name} size="xl" status={status} />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{doctor.name}</h2>
            <p className="text-xs text-emerald-600 font-bold">{doctor.specialty}</p>
            <p className="text-xs text-slate-500">{doctor.qualification}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Select
            label="Current OPD Live Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'available', label: 'Available (Accepting Queue Patients)' },
              { value: 'in-session', label: 'In Consultation Session' },
              { value: 'on-break', label: 'On Break' },
              { value: 'offline', label: 'OPD Closed / Offline' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Assigned OPD Room" value={doctor.roomNumber} disabled />
            <Input
              label="Consultation Fee ($)"
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(Number(e.target.value))}
              leftIcon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save Availability Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
