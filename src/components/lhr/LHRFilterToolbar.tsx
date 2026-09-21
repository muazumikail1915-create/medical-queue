import React from 'react';
import { useLHRStore, LHRTimeGranularity, LHRStatusFilter } from '../../store/useLHRStore';
import { LHRCategory } from '../../types/lhr';
import { 
  Search, 
  Calendar, 
  Filter, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Scan, 
  Activity, 
  Receipt, 
  Award,
  Layers,
  X
} from 'lucide-react';

export const LHRFilterToolbar: React.FC = () => {
  const {
    events,
    selectedCategory,
    setSelectedCategory,
    timeGranularity,
    setTimeGranularity,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedPatientId,
  } = useLHRStore();

  // Calculate counts per category for active patient
  const patientEvents = events.filter((e) => e.patientId === selectedPatientId);
  const getCategoryCount = (cat: LHRCategory | 'all') => {
    if (cat === 'all') return patientEvents.length;
    return patientEvents.filter((e) => e.category === cat).length;
  };

  const categories: { id: LHRCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Records', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'encounter', label: 'EHR Encounters', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'lab_result', label: 'Diagnostic Labs', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'prescription', label: 'Prescriptions (Rx)', icon: <Pill className="w-3.5 h-3.5" /> },
    { id: 'imaging', label: 'Imaging & ECG', icon: <Scan className="w-3.5 h-3.5" /> },
    { id: 'vitals', label: 'Vitals Log', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'administrative', label: 'Billing & Admin', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'milestone', label: 'Care Milestones', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const timeOptions: { id: LHRTimeGranularity; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '12m', label: '12 Months' },
    { id: 'all', label: 'All Time' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-4.5 space-y-3.5 shadow-xs">
      
      {/* Row 1: Search + Time Granularity Segmented Control */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search longitudinal records, diagnoses, drugs, labs, or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Time Granularity Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Time:
          </span>
          {timeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTimeGranularity(opt.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                timeGranularity === opt.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

      </div>

      {/* Row 1.5: Custom Date Range Picker (shown when custom is selected) */}
      {timeGranularity === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900 text-xs">
          <span className="font-semibold text-blue-900 dark:text-blue-300">Custom Date Span:</span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(e.target.value, dateRange.end)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(dateRange.start, e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      )}

      {/* Row 2: Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.id);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Secondary Quick Status Filter Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quick Filter:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All States
          </button>
          <button
            onClick={() => setStatusFilter('active_only')}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              statusFilter === 'active_only'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            Active Regimens Only
          </button>
          <button
            onClick={() => setStatusFilter('pending_only')}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              statusFilter === 'pending_only'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
            }`}
          >
            Pending Diagnostics
          </button>
          <button
            onClick={() => setStatusFilter('abnormal_only')}
            className={`px-2 py-0.5 rounded-lg font-medium transition ${
              statusFilter === 'abnormal_only'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            Abnormal / Flags
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Showing {getCategoryCount(selectedCategory)} record(s)
        </span>
      </div>

    </div>
  );
};
