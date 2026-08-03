import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({ type: 'error', title: 'Passwords do not match' });
      return;
    }
    addToast({ type: 'success', title: 'Password Updated', message: 'You can now log in with your new password.' });
    navigate('/login');
  };

  return (
    <Card className="p-6 shadow-xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Set New Password</h2>
        <p className="text-xs text-slate-500">Choose a new secure password for your account</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />
        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />
        <Button type="submit" variant="primary" className="w-full">
          Update Password
        </Button>
      </form>
    </Card>
  );
};
