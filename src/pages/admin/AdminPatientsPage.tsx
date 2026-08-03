import React from 'react';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { mockPatients } from '../../data/mockData';
import { Patient } from '../../types';

export const AdminPatientsPage: React.FC = () => {
  const columns: Column<Patient>[] = [
    {
      header: 'MRN Number',
      accessor: (row) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{row.mrn}</span>,
      sortable: true,
    },
    {
      header: 'Patient Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.name}</span>
          <span className="text-xs text-slate-400">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'DOB/Gender',
      accessor: (row) => `${row.dateOfBirth} / ${row.gender}`,
    },
    {
      header: 'Blood Group',
      accessor: (row) => <Badge variant="danger">{row.bloodGroup}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Database Management</h1>
        <p className="text-xs text-slate-500">Central patient repository with MRN indices and allergy flags</p>
      </div>

      <DataTable data={mockPatients} columns={columns} searchPlaceholder="Search patient, MRN, or phone..." pageSize={8} />
    </div>
  );
};
