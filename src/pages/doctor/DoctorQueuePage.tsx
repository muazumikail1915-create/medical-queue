import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useQueueStore } from '../../store/useQueueStore';
import { useToastStore } from '../../store/useToastStore';
import { mockDoctors } from '../../data/mockData';
import { QueueItem } from '../../types';
import { Volume2, CheckCircle2, FileText, Plus, Trash2, Stethoscope } from 'lucide-react';

export const DoctorQueuePage: React.FC = () => {
  const { queue, callNextPatient, completeConsultation, skipPatient } = useQueueStore();
  const addToast = useToastStore((s) => s.addToast);
  const currentDoctor = mockDoctors[0];

  const doctorQueue = queue.filter((q) => q.doctorId === currentDoctor.id);
  const [activeConsultationTicket, setActiveConsultationTicket] = useState<QueueItem | null>(null);

  // Consultation Note Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { medicine: 'Tab Paracetamol 500mg', dosage: '1 Tab', frequency: 'Twice daily', durationDays: 3 },
  ]);
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-08-10');

  const handleOpenConsultation = (ticket: QueueItem) => {
    setActiveConsultationTicket(ticket);
    setChiefComplaint('Chest tightness and intermittent fatigue');
    setDiagnosis('Mild Essential Hypertension & Stress Palpitations');
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicine: '', dosage: '1 Tab', frequency: 'Daily', durationDays: 5 }]);
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSaveConsultation = () => {
    if (!activeConsultationTicket) return;
    completeConsultation(activeConsultationTicket.id);
    addToast({
      type: 'success',
      title: 'Consultation Completed & Saved',
      message: `Prescription issued for ticket ${activeConsultationTicket.ticketNumber}.`,
    });
    setActiveConsultationTicket(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Live Consultation OPD Queue</h1>
          <p className="text-xs text-slate-500">Room {currentDoctor.roomNumber} • Dr. Sarah Jenkins</p>
        </div>

        <Button variant="primary" icon={<Volume2 className="w-4 h-4" />} onClick={() => callNextPatient(currentDoctor.id)}>
          Call Next Patient
        </Button>
      </div>

      <div className="space-y-3">
        {doctorQueue.map((ticket) => (
          <Card key={ticket.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-lg text-slate-900 dark:text-slate-100">{ticket.ticketNumber}</span>
                <Badge variant={ticket.status === 'in-progress' ? 'in-progress' : ticket.status === 'called' ? 'called' : 'waiting'}>
                  {ticket.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {ticket.patientName} ({ticket.patientAge}y, {ticket.patientGender}) • {ticket.patientPhone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {ticket.status === 'waiting' && (
                <Button size="sm" variant="primary" icon={<Volume2 className="w-4 h-4" />} onClick={() => callNextPatient(currentDoctor.id)}>
                  Call
                </Button>
              )}
              {(ticket.status === 'called' || ticket.status === 'in-progress' || ticket.status === 'waiting') && (
                <Button size="sm" variant="primary" icon={<FileText className="w-4 h-4" />} onClick={() => handleOpenConsultation(ticket)}>
                  Open Consultation Form
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Consultation Modal */}
      <Modal isOpen={!!activeConsultationTicket} onClose={() => setActiveConsultationTicket(null)} title="Patient Consultation & Prescription" maxWidth="2xl">
        {activeConsultationTicket && (
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center font-semibold">
              <span>Patient: <strong>{activeConsultationTicket.patientName}</strong> ({activeConsultationTicket.patientAge}y)</span>
              <Badge variant="called">TICKET #{activeConsultationTicket.ticketNumber}</Badge>
            </div>

            <Input label="Chief Complaint" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} />
            <Input label="Clinical Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

            {/* Prescriptions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">Prescribed Medications</label>
                <Button size="sm" variant="ghost" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleAddMedicine}>
                  Add Medicine
                </Button>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      placeholder="Medicine Name (e.g. Paracetamol)"
                      value={med.medicine}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].medicine = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      placeholder="Dosage (e.g. 1 Tab BD)"
                      value={med.dosage}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].dosage = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Days"
                      value={med.durationDays}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].durationDays = Number(e.target.value);
                        setMedicines(copy);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                    />
                  </div>
                  <div className="col-span-1">
                    <button onClick={() => handleRemoveMedicine(idx)} className="text-rose-500 hover:text-rose-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Doctor Advice / Lifestyle Notes" value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Low sodium diet, rest..." />
              <Input label="Follow-Up Date" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setActiveConsultationTicket(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleSaveConsultation}>
                Complete Consultation & Issue Prescription
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
