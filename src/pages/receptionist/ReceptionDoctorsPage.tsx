import React from 'react';
import { DoctorCard } from '../../components/cards/DoctorCard';
import { mockDoctors } from '../../data/mockData';

export const ReceptionDoctorsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Doctor OPD Availability Matrix</h1>
        <p className="text-xs text-slate-500">Monitor doctor room numbers, current status, and daily patient quotas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDoctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};
