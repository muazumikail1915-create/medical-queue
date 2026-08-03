import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { User, Phone, Mail, MapPin, Droplets, ShieldCheck, AlertTriangle, Save } from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  const [phone, setPhone] = useState(user?.phone || '+1 (555) 432-1001');
  const [emergencyContact, setEmergencyContact] = useState('Maria Wright (+1 555-432-9988)');
  const [address, setAddress] = useState('42 Oakridge Lane, Springfield');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Profile Updated Successfully' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Medical Profile</h1>
        <p className="text-xs text-slate-500">Manage personal health records, allergies, and emergency contacts</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <Avatar src={user?.avatar} name={user?.name || 'Alexander Wright'} size="xl" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">MRN-90821</Badge>
              <Badge variant="danger">Blood Group: O+</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">Registered since March 2024</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" value={user?.email || 'alexander.w@example.com'} disabled />
            <Input label="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<Phone className="w-4 h-4" />} />
          </div>

          <Input label="Emergency Contact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} leftIcon={<Phone className="w-4 h-4" />} />
          <Input label="Residential Address" value={address} onChange={(e) => setAddress(e.target.value)} leftIcon={<MapPin className="w-4 h-4" />} />

          <div className="space-y-1 pt-2">
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">Known Drug Allergies</label>
            <div className="flex items-center gap-2">
              <Badge variant="danger">Penicillin</Badge>
              <Badge variant="warning">Dust Mites</Badge>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
