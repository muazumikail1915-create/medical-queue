import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { UserRole } from '../../types';
import { ShieldCheck, UserPlus } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'suspended';
}

export const AdminUserManagementPage: React.FC = () => {
  const [staff] = useState<StaffUser[]>([
    { id: 'usr-1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@citycare.org', role: 'doctor', department: 'Cardiology', status: 'active' },
    { id: 'usr-2', name: 'Clara Oswald', email: 'clara.reception@citycare.org', role: 'receptionist', department: 'Main OPD', status: 'active' },
    { id: 'usr-3', name: 'Raymond Vance', email: 'raymond.admin@citycare.org', role: 'admin', department: 'Administration', status: 'active' },
    { id: 'usr-4', name: 'Dr. Marcus Vance', email: 'marcus.vance@citycare.org', role: 'doctor', department: 'Neurology', status: 'active' },
  ]);

  const columns: Column<StaffUser>[] = [
    {
      header: 'Staff Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.name}</span>
          <span className="text-xs text-slate-400">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Role',
      accessor: (row) => <Badge variant="info">{row.role.toUpperCase()}</Badge>,
      sortable: true,
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{row.status.toUpperCase()}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Hospital Staff Access & User Roles</h1>
          <p className="text-xs text-slate-500">Manage user accounts for Doctors, Receptionists, and Administrators</p>
        </div>

        <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
          Invite New Staff Member
        </Button>
      </div>

      <DataTable data={staff} columns={columns} searchPlaceholder="Search staff member or role..." pageSize={8} />
    </div>
  );
};
