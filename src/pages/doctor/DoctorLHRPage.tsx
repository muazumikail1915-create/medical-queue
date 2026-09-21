import React, { useState } from 'react';
import { LHRPatientHeader } from '../../components/lhr/LHRPatientHeader';
import { LHRFilterToolbar } from '../../components/lhr/LHRFilterToolbar';
import { LHRHealthTrajectory } from '../../components/lhr/LHRHealthTrajectory';
import { LHRCarePlansCard } from '../../components/lhr/LHRCarePlansCard';
import { LHRTimeline } from '../../components/lhr/LHRTimeline';
import { LHRExportAuditModal } from '../../components/lhr/LHRExportAuditModal';
import { LHRIngestRecordModal } from '../../components/lhr/LHRIngestRecordModal';
import { LHRAuditTrailTable } from '../../components/lhr/LHRAuditTrailTable';
import { Tabs } from '../../components/ui/Tabs';
import { Layers, Activity, History, ShieldCheck } from 'lucide-react';

export const DoctorLHRPage: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'trajectory' | 'audit'>('timeline');

  return (
    <div className="space-y-5">
      
      {/* Patient Header Banner */}
      <LHRPatientHeader
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenIngestModal={() => setIsIngestOpen(true)}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition ${
              activeTab === 'timeline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Consolidated Timeline &amp; Records
          </button>
          <button
            onClick={() => setActiveTab('trajectory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition ${
              activeTab === 'trajectory'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Longitudinal Trajectory &amp; Vitals
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Access Trail
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
          Longitudinal Health Record Engine v2.4
        </span>
      </div>

      {/* Main View Container */}
      {activeTab === 'timeline' && (
        <div className="space-y-5">
          {/* Active Diagnoses, Medications & Pending Tests */}
          <LHRCarePlansCard />

          {/* Time & Category Filter Controls */}
          <LHRFilterToolbar />

          {/* Chronological Event Stream */}
          <LHRTimeline />
        </div>
      )}

      {activeTab === 'trajectory' && (
        <div className="space-y-5">
          <LHRHealthTrajectory />
          <LHRCarePlansCard />
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-5">
          <LHRAuditTrailTable />
        </div>
      )}

      {/* Ingestion Modal */}
      <LHRIngestRecordModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
      />

      {/* Export Modal */}
      <LHRExportAuditModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
};
