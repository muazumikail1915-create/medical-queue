import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { UserRole } from '../../types';
import { Mail, Lock, User, Stethoscope, ClipboardList, ShieldCheck, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('alexander.w@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const roleTabs = [
    { id: 'patient', label: 'Patient', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'receptionist', label: 'Receptionist', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  const handleRoleChange = (newRole: string) => {
    const r = newRole as UserRole;
    setRole(r);
    if (r === 'patient') setEmail('alexander.w@example.com');
    if (r === 'receptionist') setEmail('clara.reception@citycare.org');
    if (r === 'doctor') setEmail('sarah.jenkins@citycare.org');
    if (r === 'admin') setEmail('raymond.admin@citycare.org');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, role, password);
      setIsLoading(false);

      if (!success) {
        addToast({
          type: 'error',
          title: 'Invalid credentials',
          message: 'Please check your email and password, then try again.',
        });
        return;
      }

      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Signed in successfully as ${role.toUpperCase()}.`,
      });

      if (role === 'patient') navigate('/patient');
      else if (role === 'receptionist') navigate('/reception');
      else if (role === 'doctor') navigate('/doctor');
      else navigate('/admin');
    }, 600);
  };

  return (
    <Card className="p-6 shadow-xl space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sign In to Your Account</h2>
        <p className="text-xs text-slate-500">Select portal role and enter credentials</p>
      </div>

      <Tabs tabs={roleTabs} activeTab={role} onChange={handleRoleChange} className="justify-center" />

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} icon={<LogIn className="w-4 h-4" />}>
          Sign In as {role.toUpperCase()}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
        Don&apos;t have a patient account?{' '}
        <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Register Here
        </Link>
      </div>
    </Card>
  );
};
