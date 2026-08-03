import React from 'react';
import { Card } from '../../components/ui/Card';
import { PatientCard } from '../../components/cards/PatientCard';
import { mockPatients } from '../../data/mockData';

export const DoctorPatientDetailsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Medical File Lookup</h1>
        <p className="text-xs text-slate-500">Access patient history, chronic disease records, and lab trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPatients.map((pat) => (
          <PatientCard key={pat.id} patient={pat} />
        ))}
      </div>
    </div>
  );
};
