import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    addToast({ type: 'success', title: 'Password Reset Sent', message: 'Check your email inbox for instructions.' });
  };

  return (
    <Card className="p-6 shadow-xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h2>
        <p className="text-xs text-slate-500">Enter your email to receive a password reset link</p>
      </div>

      {sent ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            Reset link sent to <strong>{email}</strong>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4" />} required />
          <Button type="submit" variant="primary" className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
};
