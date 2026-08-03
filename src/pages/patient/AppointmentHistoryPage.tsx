import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { Search, FileText, Download, Stethoscope, Calendar } from 'lucide-react';
import { Appointment } from '../../types';

export const AppointmentHistoryPage: React.FC = () => {
  const { appointments } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const history = appointments.filter((a) =>
    a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Consultation History</h1>
        <p className="text-xs text-slate-500">View past medical consultations, prescriptions, and diagnosis reports</p>
      </div>

      <div className="max-w-xs">
        <Input
          placeholder="Search by doctor or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="space-y-3">
        {history.map((apt) => (
          <Card key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{apt.doctorName}</h4>
                  <Badge variant={apt.status === 'completed' ? 'completed' : 'scheduled'}>{apt.status.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-slate-500">{apt.departmentName} • {apt.hospitalName}</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  {apt.date} at {apt.timeSlot}
                </p>
              </div>
            </div>

            <Button size="sm" variant="outline" icon={<FileText className="w-4 h-4" />} onClick={() => setSelectedApt(apt)}>
              View Notes & Summary
            </Button>
          </Card>
        ))}
      </div>

      {/* Consultation Summary Modal */}
      <Modal isOpen={!!selectedApt} onClose={() => setSelectedApt(null)} title="Consultation Summary" maxWidth="lg">
        {selectedApt && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl space-y-1">
              <p>Doctor: <strong>{selectedApt.doctorName}</strong> ({selectedApt.doctorSpecialty})</p>
              <p>Date: <strong>{selectedApt.date} ({selectedApt.timeSlot})</strong></p>
              <p>Ticket Number: <strong>{selectedApt.queueTicketNumber || 'N/A'}</strong></p>
            </div>

            <div className="space-y-1">
              <strong className="block text-slate-800 dark:text-slate-200 uppercase tracking-wider font-bold">Chief Complaint & Symptoms</strong>
              <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedApt.symptoms || 'Routine follow-up consultation.'}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="block text-slate-800 dark:text-slate-200 uppercase tracking-wider font-bold">Doctor Advice & Prescriptions</strong>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1 text-emerald-900 dark:text-emerald-200">
                <p>• Tab Paracetamol 500mg - 1 tablet BD x 3 days</p>
                <p>• Tab Amoxicillin 500mg - 1 tablet TDS x 5 days</p>
                <p>• Adequate hydration and 8 hours rest advised.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={() => window.print()}>
                Download Prescription PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
