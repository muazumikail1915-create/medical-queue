import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { User, Mail, Lock, Phone, Calendar, MapPin, UserCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      addToast({ type: 'warning', title: 'Missing required fields' });
      return;
    }

    login(email, 'patient');
    addToast({
      type: 'success',
      title: 'Registration Successful!',
      message: 'Your Patient Medical Record Number (MRN) has been generated.',
    });
    navigate('/patient');
  };

  return (
    <Card className="p-6 shadow-xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Patient Registration</h2>
        <p className="text-xs text-slate-500">Create your digital healthcare account for instant booking</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        <Input label="Full Name" placeholder="e.g. Alexander Wright" value={name} onChange={(e) => setName(e.target.value)} leftIcon={<User className="w-4 h-4" />} required />
        <Input label="Email Address" type="email" placeholder="alexander@example.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
        
        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone Number" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} leftIcon={<Phone className="w-4 h-4" />} required />
          <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Select
            label="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
            ]}
          />
        </div>

        <Input label="Home Address" placeholder="124 Oakridge Lane" value={address} onChange={(e) => setAddress(e.target.value)} leftIcon={<MapPin className="w-4 h-4" />} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4" />} required />

        <Button type="submit" variant="primary" className="w-full mt-2" icon={<UserCheck className="w-4 h-4" />}>
          Create Account & Sign In
        </Button>
      </form>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Sign In Here
        </Link>
      </div>
    </Card>
  );
};
