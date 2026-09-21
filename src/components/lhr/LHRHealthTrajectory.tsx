import React, { useState } from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Droplet, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const LHRHealthTrajectory: React.FC = () => {
  const { getVitalsTrajectory, getComparativeMetrics, comparativePeriod, setComparativePeriod } = useLHRStore();
  const [activeChartTab, setActiveChartTab] = useState<'bp' | 'glucose' | 'weight'>('bp');

  const trajectoryData = getVitalsTrajectory();
  const comparativeMetrics = getComparativeMetrics();

  return (
    <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-5 space-y-5 shadow-xs">
      
      {/* Header & Trajectory Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Longitudinal Health Trajectory &amp; Comparative Analytics
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
              2024 - 2026 Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-year clinical trend analysis with automated delta computation.
          </p>
        </div>

        {/* Chart View Toggle Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveChartTab('bp')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeChartTab === 'bp'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Blood Pressure
          </button>
          <button
            onClick={() => setActiveChartTab('glucose')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeChartTab === 'glucose'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" /> Glucose &amp; HbA1c
          </button>
          <button
            onClick={() => setActiveChartTab('weight')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeChartTab === 'weight'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Weight / BMI
          </button>
        </div>
      </div>

      {/* 4 Comparative Metric Cards (Month-over-Month & Year-over-Year Delta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {comparativeMetrics.map((metric, idx) => {
          const isImproving = metric.trend === 'improving';
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium truncate">{metric.metricName}</span>
                <span className="text-[10px] font-mono">{metric.periodLabel}</span>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100">
                  {metric.currentValue}{' '}
                  <span className="text-xs font-normal text-slate-500">{metric.unit}</span>
                </p>
                
                {/* Delta Badge */}
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    isImproving
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {isImproving ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {Math.abs(metric.deltaPercent)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span>Prev: <strong className="font-mono text-slate-700 dark:text-slate-300">{metric.previousValue}</strong></span>
                <span className="font-mono text-[10px] text-slate-400">Target: {metric.benchmarkRange}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Recharts Chart Canvas */}
      <div className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'bp' ? (
              <LineChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[70, 160]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="bpSystolic"
                  name="Systolic BP (Target < 130)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="bpDiastolic"
                  name="Diastolic BP (Target < 85)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </LineChart>
            ) : activeChartTab === 'glucose' ? (
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[60, 140]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="bloodGlucose"
                  name="Fasting Glucose (mg/dL)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#glucoseGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="hba1c"
                  name="HbA1c (%)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={trajectoryData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[70, 90]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="weightKg"
                  name="Body Weight (kg)"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Clinical Insight Footer Callout */}
        <div className="mt-3 p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Automated Clinical Trajectory Analysis:</strong> Systolic BP demonstrates a sustained downwards trajectory from 148 mmHg to 124 mmHg (-16.2%) following initiation of Lisinopril 20mg and sodium reduction. Fasting glucose and HbA1c remain strictly within normoglycemic bounds.
          </div>
        </div>
      </div>

    </div>
  );
};
