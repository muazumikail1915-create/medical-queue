import React from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  FileDown, 
  PlusCircle, 
  Activity, 
  Clock, 
  Heart,
  ChevronDown
} from 'lucide-react';

interface LHRPatientHeaderProps {
  onOpenIngestModal?: () => void;
  onOpenExportModal?: () => void;
}

export const LHRPatientHeader: React.FC<LHRPatientHeaderProps> = ({
  onOpenIngestModal,
  onOpenExportModal,
}) => {
  const { summaries, selectedPatientId, setSelectedPatient } = useLHRStore();
  const { user, role } = useAuthStore();
  const summary = summaries[selectedPatientId] || summaries['pat-1'];

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPatient(e.target.value, user ? { id: user.id, name: user.name, role } : undefined);
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'danger' as const;
      case 'High': return 'warning' as const;
      case 'Moderate': return 'info' as const;
      default: return 'success' as const;
    }
  };

  return (
    <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-5 shadow-xs transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Patient Identity & MRN */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-xl shadow-md shadow-blue-500/20 shrink-0">
            {summary.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {summary.name}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                {summary.mrn}
              </span>
              <Badge variant={getRiskBadgeVariant(summary.riskScore)}>
                {summary.riskScore.toUpperCase()} RISK
              </Badge>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> HIPAA Verified
              </span>
            </div>

            {/* Demographics & Blood Group */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>{summary.age} yrs • {summary.gender}</span>
              <span>Blood Group: <strong className="text-slate-800 dark:text-slate-200">{summary.bloodGroup}</strong></span>
              <span>Last Encounter: <strong className="text-slate-800 dark:text-slate-200">{summary.lastEncounterDate}</strong></span>
            </div>

            {/* Allergy Flag Ribbon */}
            {summary.allergies && summary.allergies.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Allergies:</span>
                <div className="flex flex-wrap gap-1">
                  {summary.allergies.map((allg, idx) => (
                    <span key={idx} className="text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {allg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Ribbon: Patient Selector, Ingest Entry, Export LHR */}
        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
          
          {/* Patient Quick Selector (for Doctors & Admins) */}
          {(role === 'doctor' || role === 'admin' || role === 'receptionist') && (
            <div className="relative min-w-[180px]">
              <select
                value={selectedPatientId}
                onChange={handlePatientChange}
                className="w-full text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                {Object.values(summaries).map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.name} ({p.mrn})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* New Event Ingestion (Doctor / Clinical role) */}
          {(role === 'doctor' || role === 'admin') && onOpenIngestModal && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenIngestModal}
              icon={<PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            >
              Ingest Record
            </Button>
          )}

          {/* Export LHR FHIR / PDF */}
          {onOpenExportModal && (
            <Button
              size="sm"
              variant="primary"
              onClick={onOpenExportModal}
              icon={<FileDown className="w-4 h-4" />}
            >
              Export LHR
            </Button>
          )}

        </div>

      </div>
    </div>
  );
};
