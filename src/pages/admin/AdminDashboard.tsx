import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { mockAnalyticsSummary, mockDoctors } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Users, Clock, Activity, Stethoscope, AlertTriangle, FileSpreadsheet, Building2, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const analytics = mockAnalyticsSummary;

  return (
    <div className="space-y-6">
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <Badge variant="info">HOSPITAL EXECUTIVE COMMAND CENTER</Badge>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Hospital Operations & OPD Overview</h1>
          <p className="text-xs text-slate-500">Live operational telemetry across all hospital clinics and OPD wards</p>
        </div>

        <Button variant="primary" icon={<FileSpreadsheet className="w-4 h-4" />} onClick={() => window.print()}>
          Export Daily Report
        </Button>
      </div>

      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{analytics.totalPatientsToday}</span>
            <span className="block text-xs text-slate-500">Total OPD Visits Today</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{analytics.avgWaitTimeMinutes}m</span>
            <span className="block text-xs text-slate-500">Avg OPD Wait Time</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{analytics.completedConsultationsToday}</span>
            <span className="block text-xs text-slate-500">Consultations Done</span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{analytics.noShowRate}%</span>
            <span className="block text-xs text-slate-500">No-Show Rate</span>
          </div>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Patient Volume Chart */}
        <Card className="lg:col-span-7 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Hourly Patient Flow & Queue Volume</h3>
              <p className="text-xs text-slate-500">Peak OPD operational hours vs completed consultations</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.hourlyQueueTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="hour" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="waiting" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Waiting Patients" />
                <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Wait Times Chart */}
        <Card className="lg:col-span-5 p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Wait Times by Department</h3>
            <p className="text-xs text-slate-500">Average minutes patients wait before consultation</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="#888888" fontSize={11} />
                <YAxis dataKey="departmentName" type="category" stroke="#888888" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="avgWaitTime" fill="#10b981" radius={[0, 8, 8, 0]} name="Avg Wait (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Doctor Performance & Utilization Table */}
      <Card className="p-5 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Doctor Productivity & Satisfaction Scores</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-3">Doctor Name</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Patients Served Today</th>
                <th className="p-3">Satisfaction Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {analytics.doctorUtilization.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{doc.doctorName}</td>
                  <td className="p-3 text-emerald-600 font-semibold">{doc.specialty}</td>
                  <td className="p-3 font-bold">{doc.patientsServed} patients</td>
                  <td className="p-3 font-bold text-amber-500">★ {doc.satisfactionScore} / 5.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
