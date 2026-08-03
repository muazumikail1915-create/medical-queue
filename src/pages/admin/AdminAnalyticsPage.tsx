import React from 'react';
import { Card } from '../../components/ui/Card';
import { mockAnalyticsSummary } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const analytics = mockAnalyticsSummary;

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Healthcare Operational Analytics</h1>
        <p className="text-xs text-slate-500">In-depth statistical breakdown of OPD throughput, bottleneck analysis, and patient satisfaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Patients Processed by Department</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="departmentName" stroke="#888888" fontSize={10} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="totalPatients" fill="#10b981" radius={[8, 8, 0, 0]} name="Total Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Department Patient Share</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.departmentStats} dataKey="totalPatients" nameKey="departmentName" cx="50%" cy="50%" outerRadius={80} label>
                  {analytics.departmentStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
