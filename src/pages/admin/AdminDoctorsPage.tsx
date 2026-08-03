import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DataTable, Column } from '../../components/ui/DataTable';
import { mockDoctors, mockDepartments } from '../../data/mockData';
import { Doctor } from '../../types';
import { Plus, Edit2, UserPlus, Trash2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const AdminDoctorsPage: React.FC = () => {
  const [doctorsList, setDoctorsList] = useState(mockDoctors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [roomNumber, setRoomNumber] = useState('Room 101');
  const [consultationFee, setConsultationFee] = useState(120);

  const addToast = useToastStore((s) => s.addToast);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@citycare.org`,
      phone: '+1 (555) 234-9988',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
      specialty,
      departmentId: 'dept-1',
      departmentName: specialty,
      hospitalId: 'hosp-1',
      hospitalName: 'City Care Hospital',
      qualification: 'MBBS, MD',
      experienceYears: 8,
      roomNumber,
      consultationFee,
      isAvailable: true,
      status: 'available',
      rating: 4.9,
      reviewsCount: 1,
      dailyPatientLimit: 40,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      workingHours: { start: '09:00 AM', end: '05:00 PM' },
    };

    setDoctorsList([newDoc, ...doctorsList]);
    setIsModalOpen(false);
    addToast({ type: 'success', title: 'Doctor Added', message: `${name} registered to OPD schedule.` });
  };

  const columns: Column<Doctor>[] = [
    {
      header: 'Doctor Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.name}</span>
          <span className="text-xs text-slate-400">{row.qualification}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Specialty',
      accessor: (row) => <span className="font-semibold text-emerald-600">{row.specialty}</span>,
      sortable: true,
    },
    {
      header: 'Room',
      accessor: 'roomNumber',
    },
    {
      header: 'Fee',
      accessor: (row) => `$${row.consultationFee}`,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status === 'available' ? 'success' : 'warning'}>{row.status.toUpperCase()}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Physician Roster & OPD Assignment</h1>
          <p className="text-xs text-slate-500">Manage doctors, consultation rooms, and daily patient quotas</p>
        </div>

        <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add New Doctor
        </Button>
      </div>

      <DataTable data={doctorsList} columns={columns} searchPlaceholder="Search doctor or specialty..." pageSize={8} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New OPD Doctor">
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <Input label="Doctor Full Name" placeholder="e.g. Dr. Robert Vance" value={name} onChange={(e) => setName(e.target.value)} required />
          <Select
            label="Specialty Department"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            options={mockDepartments.map((d) => ({ value: d.name, label: d.name }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="OPD Room Number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
            <Input label="Consultation Fee ($)" type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} required />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Doctor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
