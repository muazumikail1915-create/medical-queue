import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { DoctorCard } from '../../components/cards/DoctorCard';
import { mockHospitals, mockDepartments, mockDoctors } from '../../data/mockData';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Hospital, Stethoscope, Calendar, Clock, FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export const BookAppointmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0].id);
  const [selectedDepartment, setSelectedDepartment] = useState(mockDepartments[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(mockDoctors[0].id);
  const [selectedDate, setSelectedDate] = useState('2026-08-04');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [appointmentType, setAppointmentType] = useState<'regular' | 'follow-up' | 'emergency'>('regular');
  const [symptoms, setSymptoms] = useState('');
  const [bookedTicket, setBookedTicket] = useState<string | null>(null);

  const { bookAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
  ];

  const currentDoctor = mockDoctors.find((d) => d.id === selectedDoctorId) || mockDoctors[0];
  const currentHospital = mockHospitals.find((h) => h.id === selectedHospital) || mockHospitals[0];
  const currentDepartment = mockDepartments.find((d) => d.id === selectedDepartment) || mockDepartments[0];

  const handleConfirm = () => {
    const apt = bookAppointment({
      patientId: user?.id || 'pat-1',
      patientName: user?.name || 'Alexander Wright',
      patientPhone: user?.phone || '+1 (555) 432-1001',
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      departmentId: currentDepartment.id,
      departmentName: currentDepartment.name,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      type: appointmentType,
      symptoms,
    });

    setBookedTicket(apt.queueTicketNumber || 'CARD-108');
    setStep(5);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header Progress */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Book Doctor Appointment</h1>
        <p className="text-xs text-slate-500">Fast digital check-in with live ticket issuing</p>
      </div>

      {step < 5 && (
        <div className="flex items-center justify-between text-xs font-semibold px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className={step >= 1 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>1. Hospital</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>2. Doctor</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>3. Slot</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>4. Symptoms</span>
        </div>
      )}

      {/* Step 1: Hospital & Department */}
      {step === 1 && (
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Hospital className="w-5 h-5 text-emerald-600" /> Select Hospital Facility & Department
          </h3>

          <div className="space-y-4">
            <Select
              label="Hospital Location"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              options={mockHospitals.map((h) => ({ value: h.id, label: `${h.name} (${h.code})` }))}
            />

            <Select
              label="Department / Specialty"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              options={mockDepartments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(2)}>
              Continue to Choose Doctor
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" /> Choose Doctor
            </h3>
            <span className="text-xs text-slate-500 font-medium">{currentDepartment.name} Department</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`cursor-pointer rounded-2xl transition-all ${
                  selectedDoctorId === doc.id ? 'ring-2 ring-emerald-500 shadow-md' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <DoctorCard doctor={doc} />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(3)}>
              Continue to Select Slot
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Date & Slot */}
      {step === 3 && (
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> Choose Date & Available Slot
          </h3>

          <div className="space-y-4">
            <Input label="Appointment Date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(4)}>
              Continue to Symptoms
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Symptoms & Confirmation */}
      {step === 4 && (
        <Card className="p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" /> Medical Reason & Confirm
          </h3>

          <div className="space-y-4">
            <Select
              label="Visit Type"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value as any)}
              options={[
                { value: 'regular', label: 'Regular Consultation' },
                { value: 'follow-up', label: 'Follow-Up Visit' },
                { value: 'emergency', label: 'Urgent OPD Check' },
              ]}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
                Symptoms / Reason for Visit
              </label>
              <textarea
                rows={3}
                placeholder="Describe symptoms briefly (e.g., chest tightness, fever, joint pain)..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100">Booking Summary</h4>
              <p>Doctor: <strong>{currentDoctor.name}</strong> ({currentDoctor.specialty})</p>
              <p>Location: <strong>{currentHospital.name}</strong> ({currentDoctor.roomNumber})</p>
              <p>Time: <strong>{selectedDate} at {selectedTimeSlot}</strong></p>
              <p>Consultation Fee: <strong className="text-emerald-600">${currentDoctor.consultationFee}</strong></p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(3)}>
              Back
            </Button>
            <Button variant="primary" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleConfirm}>
              Confirm Appointment & Issue Ticket
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Success & Ticket View */}
      {step === 5 && (
        <Card className="p-8 text-center space-y-6 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <Badge variant="success">CONFIRMED</Badge>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">Appointment Scheduled!</h2>
            <p className="text-xs text-slate-500 mt-1">Your live queue ticket has been issued.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 rounded-2xl max-w-sm mx-auto space-y-2 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">Queue Ticket Number</span>
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{bookedTicket}</span>
            <span className="text-xs text-slate-500 block font-sans mt-2">
              Room {currentDoctor.roomNumber} • {selectedDate} at {selectedTimeSlot}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/patient/queue-status')}>
              View Live Queue Status
            </Button>
            <Button variant="outline" onClick={() => navigate('/patient')}>
              Go to Patient Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
