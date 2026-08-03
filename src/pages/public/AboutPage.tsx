import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Hospital, ShieldCheck, HeartPulse, Award, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="info">About City Care Hospital</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          Redefining Healthcare Efficiency & Patient Experience
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Founded in 1998, City Care General Hospital is a premier multi-specialty tertiary healthcare institution providing compassionate, world-class medical treatment supported by real-time queue intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Patient-Centric Mission</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminating frustrating waiting room delays through modern digital scheduling and live queue tracking.
          </p>
        </Card>

        <Card className="text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">JCI & NABH Accredited</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Maintaining world-class patient safety, hygienic infection control standards, and clinical excellence.
          </p>
        </Card>

        <Card className="text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">120+ Specialist Physicians</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Comprehensive care across Cardiology, Orthopedics, Pediatrics, Neurology, and Surgical sub-specialties.
          </p>
        </Card>
      </div>
    </div>
  );
};
