import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { DoctorCard } from '../../components/cards/DoctorCard';
import { mockDoctors, mockDepartments, mockQueueItems } from '../../data/mockData';
import { Search, Clock, Calendar, ShieldCheck, Stethoscope, Users, Hospital, ArrowRight, Heart, Activity } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [ticketSearch, setTicketSearch] = useState('');
  const [searchResult, setSearchResult] = useState<(typeof mockQueueItems)[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;
    setHasSearched(true);
    const found = mockQueueItems.find(
      (q) => q.ticketNumber.toLowerCase() === ticketSearch.trim().toLowerCase() || q.patientPhone.includes(ticketSearch.trim())
    );
    setSearchResult(found || null);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent pt-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <Badge variant="info" className="px-3 py-1 text-xs uppercase tracking-wider">
              Smart Hospital Queue & Appointment System
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Skip the Waiting Room.<br />
              <span className="text-emerald-600 dark:text-emerald-400">Track Your Medical Queue Live.</span>
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Book doctor appointments in seconds, monitor live queue status on your smartphone, and receive automated alerts when it is almost your turn to see the doctor.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link to="/register">
                <Button size="lg" variant="primary" icon={<Calendar className="w-5 h-5" />}>
                  Book Appointment Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" icon={<ArrowRight className="w-5 h-5" />}>
                  Patient Sign In
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">12 mins</span>
                <span className="block text-xs text-slate-500">Avg Wait Time</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">99.4%</span>
                <span className="block text-xs text-slate-500">On-Time Visits</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">25,000+</span>
                <span className="block text-xs text-slate-500">Patients Served</span>
              </div>
            </div>
          </div>

          {/* Quick Ticket Live Lookup Widget */}
          <div className="lg:col-span-5">
            <Card className="p-6 bg-white dark:bg-slate-900 shadow-xl border-emerald-500/30">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Clock className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Live Ticket Tracker</h3>
                  <p className="text-xs text-slate-500">Check queue position without signing in</p>
                </div>
              </div>

              <form onSubmit={handleTrackTicket} className="space-y-3">
                <Input
                  placeholder="Enter Ticket (e.g. CARD-102) or Phone"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
                <Button type="submit" variant="primary" className="w-full">
                  Track Ticket Status
                </Button>
              </form>

              {/* Sample Ticket Helper */}
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Try sample tickets: <button type="button" onClick={() => { setTicketSearch('CARD-102'); handleTrackTicket({ preventDefault: () => {} } as React.FormEvent); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">CARD-102</button> or <button type="button" onClick={() => { setTicketSearch('GEN-104'); handleTrackTicket({ preventDefault: () => {} } as React.FormEvent); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">GEN-104</button>
              </p>

              {/* Search Result display */}
              {hasSearched && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {searchResult ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-mono text-base text-slate-900 dark:text-slate-100">{searchResult.ticketNumber}</span>
                        <Badge variant={searchResult.status === 'called' ? 'called' : 'waiting'}>
                          {searchResult.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">Patient: {searchResult.patientName}</p>
                      <p className="text-slate-700 dark:text-slate-300">Doctor: {searchResult.doctorName} ({searchResult.roomNumber})</p>
                      <div className="flex justify-between pt-1 font-semibold text-emerald-700 dark:text-emerald-300">
                        <span>Position: #{searchResult.position}</span>
                        <span>Est. Wait: ~{searchResult.estimatedWaitMinutes} mins</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900">
                      Ticket not found. Check ticket number or contact reception desk.
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="info">Medical Specialties</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Browse Hospital Departments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Experienced specialists available for in-person consultation and live OPD queues.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDepartments.map((dept) => (
            <Card key={dept.id} hoverable className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{dept.name}</h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{dept.code} Department</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{dept.description}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">{dept.activeDoctorsCount} Doctors Available</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">~{dept.avgWaitTimeMinutes}m Wait</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="success">Expert Medical Care</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Meet Our Senior Physicians
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Board-certified doctors committed to compassionate, punctual healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDoctors.slice(0, 3).map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onBook={() => navigate('/register')} />
          ))}
        </div>
      </section>
    </div>
  );
};
