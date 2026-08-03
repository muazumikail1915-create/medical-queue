import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PrintTicketModal } from '../../components/ui/PrintTicketModal';
import { useQueueStore } from '../../store/useQueueStore';
import { mockDoctors, mockDepartments } from '../../data/mockData';
import { UserPlus, Printer, AlertTriangle } from 'lucide-react';
import { QueueItem } from '../../types';

export const WalkInRegistrationPage: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(mockDepartments[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(mockDoctors[0].id);
  const [isPriority, setIsPriority] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<QueueItem | null>(null);

  const registerWalkIn = useQueueStore((s) => s.registerWalkIn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const ticket = registerWalkIn({
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      departmentId: selectedDepartmentId,
      doctorId: selectedDoctorId,
      isPriority,
    });

    setIssuedTicket(ticket);
    setPatientName('');
    setPatientPhone('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Walk-In Patient Intake & Registration</h1>
        <p className="text-xs text-slate-500">Fast reception intake for unscheduled OPD visitors</p>
      </div>

      <Card className="p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Patient Full Name" placeholder="e.g. David Kim" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone Number" placeholder="+1 (555) 000-0000" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required />
            <Input label="Age" type="number" value={patientAge} onChange={(e) => setPatientAge(Number(e.target.value))} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value as any)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />

            <Select
              label="Department"
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              options={mockDepartments.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>

          <Select
            label="Assign Doctor"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            options={mockDoctors.map((doc) => ({ value: doc.id, label: `${doc.name} (${doc.roomNumber})` }))}
          />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" checked={isPriority} onChange={(e) => setIsPriority(e.target.checked)} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Fast-Track Priority Ticket (Senior Citizen / Acute Symptoms)
            </span>
          </label>

          <Button type="submit" variant="primary" className="w-full mt-2" icon={<UserPlus className="w-4 h-4" />}>
            Issue Walk-In Ticket & Print
          </Button>
        </form>
      </Card>

      <PrintTicketModal isOpen={!!issuedTicket} onClose={() => setIssuedTicket(null)} ticket={issuedTicket} />
    </div>
  );
};
