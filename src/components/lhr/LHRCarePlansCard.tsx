import React from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { Badge } from '../ui/Badge';
import { 
  HeartHandshake, 
  Pill, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2,
  BookmarkCheck
} from 'lucide-react';

export const LHRCarePlansCard: React.FC = () => {
  const { summaries, selectedPatientId, events } = useLHRStore();
  const summary = summaries[selectedPatientId] || summaries['pat-1'];

  // Find active prescriptions
  const activeRx = events
    .filter((e) => e.patientId === selectedPatientId && e.category === 'prescription' && e.prescriptionData?.status === 'active')
    .map((e) => e.prescriptionData!);

  // Find pending diagnostic tests
  const pendingTests = events.filter(
    (e) => e.patientId === selectedPatientId && (e.status === 'pending' || e.category === 'imaging') && e.status === 'pending'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* 1. Active vs Historical Conditions */}
      <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-4.5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Chronic Conditions Index
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">
            {summary.chronicConditions.length} Diagnoses
          </span>
        </div>

        <div className="space-y-2.5">
          {summary.chronicConditions.map((cond, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{cond.name}</h5>
                  <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-600 dark:text-slate-400">
                    {cond.icd10}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">Diagnosed: {cond.diagnosedDate}</p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize font-mono ${
                  cond.status === 'active'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    : cond.status === 'managed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                ● {cond.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Medications & Ongoing Treatment Regimens */}
      <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-4.5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Active Medications (Rx)
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold">
            {summary.activePrescriptionsCount} Active
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-purple-950 dark:text-purple-200">Lisinopril 20 mg Tab</strong>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Adherence: 98%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">1 tab PO daily in AM • For BP optimization</p>
          </div>

          <div className="p-3 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-purple-950 dark:text-purple-200">Atorvastatin 20 mg Tab</strong>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Adherence: 96%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">1 tab PO at bedtime • Lipid reduction</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">Albuterol HFA Inhaler 90mcg</strong>
              <span className="text-[10px] font-mono text-slate-500">PRN (As Needed)</span>
            </div>
            <p className="text-[11px] text-slate-500">1-2 puffs q4h as needed for wheezing</p>
          </div>
        </div>
      </div>

      {/* 3. Pending Diagnostics & Scheduled Orders */}
      <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-4.5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Pending Diagnostic Orders
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold">
            {summary.pendingDiagnosticsCount} Pending
          </span>
        </div>

        <div className="space-y-2.5">
          {pendingTests.length > 0 ? (
            pendingTests.map((test) => (
              <div
                key={test.id}
                className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">{test.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                    Scheduled
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{test.summary}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-amber-200/50">
                  <span>Target Date: <strong>Sep 28, 2026</strong></span>
                  <span>Dr. S. Jansen</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center rounded-xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-500">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              All scheduled diagnostic workups are up to date.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
