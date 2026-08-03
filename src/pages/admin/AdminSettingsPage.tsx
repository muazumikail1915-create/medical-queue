import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToastStore } from '../../store/useToastStore';
import { Save, BellRing, Settings, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [hospitalName, setHospitalName] = useState('City Care General Hospital');
  const [ticketPrefix, setTicketPrefix] = useState('CARD');
  const [avgConsultationMins, setAvgConsultationMins] = useState(15);
  const [soundChime, setSoundChime] = useState('chime-classic');

  const addToast = useToastStore((s) => s.addToast);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Hospital Settings Updated' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Configuration</h1>
        <p className="text-xs text-slate-500">Configure global queue parameters, audio chime alerts, and ticket prefixes</p>
      </div>

      <Card className="p-6 space-y-5">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Hospital System Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} required />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Ticket Code Prefix" value={ticketPrefix} onChange={(e) => setTicketPrefix(e.target.value)} required />
            <Input
              label="Default Avg Consultation (Mins)"
              type="number"
              value={avgConsultationMins}
              onChange={(e) => setAvgConsultationMins(Number(e.target.value))}
              required
            />
          </div>

          <Select
            label="OPD Queue Audio Alert Chime"
            value={soundChime}
            onChange={(e) => setSoundChime(e.target.value)}
            options={[
              { value: 'chime-classic', label: 'Classic Hospital Chime (Two-Tone)' },
              { value: 'chime-modern', label: 'Soft Digital Notification' },
              { value: 'chime-bell', label: 'Loud Public Address Bell' },
            ]}
          />

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save System Parameters
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
