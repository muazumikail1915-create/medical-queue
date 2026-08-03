import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast({ type: 'warning', title: 'Please fill in all fields' });
      return;
    }
    setSubmitted(true);
    addToast({ type: 'success', title: 'Message Sent', message: 'Hospital desk will respond within 2 hours.' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Contact & Hospital Helpdesk</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Have questions regarding appointments, queue status, or emergency admissions? Our medical desk is ready to help 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-4">
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              Hospital Location & Directory
            </h3>

            <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">Main Campus</strong>
                <span>124 Healthcare Boulevard, Metropolitan Center</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">Phone Lines</strong>
                <span>Emergency: +1 (555) 911-0000</span>
                <span className="block">OPD Appointments: +1 (555) 234-5678</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">OPD Consultation Hours</strong>
                <span>Mon - Sat: 08:00 AM - 08:00 PM</span>
                <span className="block text-rose-600 font-semibold">24/7 Emergency Trauma Unit</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Message Form */}
        <div className="md:col-span-7">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Send an Inquiry</h3>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-100">Thank you for reaching out!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your message has been routed to our patient services team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name" placeholder="e.g. Alexander Wright" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email Address" type="email" placeholder="alexander@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Describe your inquiry or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" icon={<Send className="w-4 h-4" />}>
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
