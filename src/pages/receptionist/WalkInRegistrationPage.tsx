import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { PrintTicketModal } from '../../components/ui/PrintTicketModal';
import { useQueueStore, evaluateTriageStatus } from '../../store/useQueueStore';
import { mockDoctors, mockDepartments } from '../../data/mockData';
import { UserPlus, Printer, AlertTriangle, Stethoscope } from 'lucide-react';
import { QueueItem, TriageStatus } from '../../types';

export const WalkInRegistrationPage: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number>(35);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(mockDepartments[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(mockDoctors[0].id);
  const [isPriority, setIsPriority] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [painScore, setPainScore] = useState(3);
  const [systolicBloodPressure, setSystolicBloodPressure] = useState<number>(120);
  const [pulse, setPulse] = useState<number>(78);
  const [oxygenSaturation, setOxygenSaturation] = useState<number>(98);
  const [issuedTicket, setIssuedTicket] = useState<QueueItem | null>(null);

  const registerWalkIn = useQueueStore((s) => s.registerWalkIn);

  const triageStatus: TriageStatus = evaluateTriageStatus({
    chiefComplaint,
    painScore,
    systolicBloodPressure,
    pulse,
    oxygenSaturation,
  });

  const triageLabel =
    triageStatus === 'red' ? 'Red Flag - Immediate attention' : triageStatus === 'yellow' ? 'Yellow Flag - Urgent evaluation' : 'Green Flag - Routine queue';

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
      isPriority: isPriority || triageStatus === 'red',
      triageStatus,
      triageReason: triageLabel,
      triageScore: painScore + (triageStatus === 'red' ? 10 : triageStatus === 'yellow' ? 5 : 0),
    });

    setIssuedTicket(ticket);
    setPatientName('');
    setPatientPhone('');
    setChiefComplaint('');
    setPainScore(3);
    setSystolicBloodPressure(120);
    setPulse(78);
    setOxygenSaturation(98);
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

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Triage status</span>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide border ${
                triageStatus === 'red'
                  ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                  : triageStatus === 'yellow'
                    ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              }`}>
                {triageStatus.toUpperCase()}
              </span>
            </div>

            <Input label="Chief Complaint" placeholder="e.g. chest pain, abdominal pain, fever" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Pain Score (0-10)" type="number" min={0} max={10} value={painScore} onChange={(e) => setPainScore(Number(e.target.value))} />
              <Input label="Systolic BP" type="number" value={systolicBloodPressure} onChange={(e) => setSystolicBloodPressure(Number(e.target.value))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Pulse" type="number" value={pulse} onChange={(e) => setPulse(Number(e.target.value))} />
              <Input label="Oxygen %" type="number" min={0} max={100} value={oxygenSaturation} onChange={(e) => setOxygenSaturation(Number(e.target.value))} />
            </div>

            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assessment: {triageLabel}</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="checkbox" checked={isPriority} onChange={(e) => setIsPriority(e.target.checked)} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Manual Fast-Track Priority Ticket
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
