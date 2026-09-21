import React, { useState } from 'react';
import { LHRPatientHeader } from '../../components/lhr/LHRPatientHeader';
import { LHRFilterToolbar } from '../../components/lhr/LHRFilterToolbar';
import { LHRHealthTrajectory } from '../../components/lhr/LHRHealthTrajectory';
import { LHRCarePlansCard } from '../../components/lhr/LHRCarePlansCard';
import { LHRTimeline } from '../../components/lhr/LHRTimeline';
import { LHRExportAuditModal } from '../../components/lhr/LHRExportAuditModal';
import { ShieldCheck, Heart, Sparkles, FileDown, Layers, Activity } from 'lucide-react';

export const PatientLHRPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeView, setActiveView] = useState<'timeline' | 'trends'>('timeline');

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md shadow-blue-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
              Longitudinal Health Journey
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
              HIPAA Protected
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            My Complete Medical Timeline &amp; Health Trajectory
          </h1>
          <p className="text-xs text-blue-100 max-w-xl">
            Access your unified clinical history, laboratory test results, active prescriptions, and progress metrics across all hospital visits.
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="px-4 py-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 transition shadow-xs shrink-0"
        >
          <FileDown className="w-4 h-4" /> Download Medical Pass (PDF)
        </button>
      </div>

      {/* Patient Header & Quick Profile Info */}
      <LHRPatientHeader
        onOpenExportModal={() => setIsExportOpen(true)}
      />

      {/* View Switcher Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition ${
            activeView === 'timeline'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Medical Timeline &amp; Records
        </button>
        <button
          onClick={() => setActiveView('trends')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition ${
            activeView === 'trends'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Health Trends &amp; Vitals Analysis
        </button>
      </div>

      {/* Main Content */}
      {activeView === 'timeline' ? (
        <div className="space-y-5">
          {/* Active Diagnoses & Medications */}
          <LHRCarePlansCard />

          {/* Filter Toolbar */}
          <LHRFilterToolbar />

          {/* Chronological Event Stream */}
          <LHRTimeline />
        </div>
      ) : (
        <div className="space-y-5">
          <LHRHealthTrajectory />
          <LHRCarePlansCard />
        </div>
      )}

      {/* Export Modal */}
      <LHRExportAuditModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
};
