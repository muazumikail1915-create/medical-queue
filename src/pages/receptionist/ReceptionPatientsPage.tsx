import React from 'react';
import { PatientCard } from '../../components/cards/PatientCard';
import { mockPatients } from '../../data/mockData';
import { Users, Search } from 'lucide-react';

export const ReceptionPatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Directory</h1>
        <p className="text-xs text-slate-500">Lookup patient Medical Record Numbers (MRN), allergy flags, and visit histories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} onSelect={() => {}} onNewAppointment={() => {}} />
        ))}
      </div>
    </div>
  );
};
