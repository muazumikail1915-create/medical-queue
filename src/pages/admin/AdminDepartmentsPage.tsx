import React from 'react';
import { Card } from '../../components/ui/Card';
import { mockDepartments } from '../../data/mockData';
import { Activity, Clock } from 'lucide-react';

export const AdminDepartmentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Department Setup & SLA Benchmarks</h1>
        <p className="text-xs text-slate-500">Configure medical specialties and maximum target queue wait times</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDepartments.map((dept) => (
          <Card key={dept.id} className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{dept.name}</h3>
                <span className="text-xs text-emerald-600 font-bold">{dept.code}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">{dept.description}</p>
            <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">{dept.activeDoctorsCount} Doctors Assigned</span>
              <span className="font-bold text-amber-600">SLA: ~{dept.avgWaitTimeMinutes}m Wait</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
