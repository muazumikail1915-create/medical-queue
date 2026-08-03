export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  specialization?: string;
  departmentId?: string;
  hospitalId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  image?: string;
  activeQueuesCount: number;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  description: string;
  iconName: string;
  headDoctor: string;
  activeDoctorsCount: number;
  avgWaitTimeMinutes: number;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialty: string;
  departmentId: string;
  departmentName: string;
  hospitalId: string;
  hospitalName: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  isAvailable: boolean;
  status: 'available' | 'in-session' | 'on-break' | 'offline';
  roomNumber: string;
  dailyPatientLimit: number;
  availableDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  avatar?: string;
  totalVisits: number;
  lastVisit?: string;
  allergies?: string[];
  medicalHistory?: string[];
}

export type AppointmentStatus = 
  | 'scheduled' 
  | 'checked-in' 
  | 'in-queue' 
  | 'in-consultation' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientGender?: string;
  patientAge?: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  departmentId: string;
  departmentName: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  type: 'regular' | 'follow-up' | 'emergency' | 'teleconsultation';
  status: AppointmentStatus;
  symptoms?: string;
  queueTicketNumber?: string;
  notes?: string;
  createdAt: string;
}

export type QueueStatus = 'waiting' | 'called' | 'in-progress' | 'completed' | 'skipped' | 'cancelled';

export interface QueueItem {
  id: string;
  ticketNumber: string; // e.g. CARD-102
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  doctorId: string;
  doctorName: string;
  roomNumber: string;
  departmentId: string;
  departmentName: string;
  hospitalId: string;
  appointmentId?: string;
  status: QueueStatus;
  position: number;
  estimatedWaitMinutes: number;
  checkInTime: string;
  calledTime?: string;
  completedTime?: string;
  isPriority: boolean;
  type: 'appointment' | 'walk-in';
}

export interface ConsultationNote {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  chiefComplaint: string;
  diagnosis: string;
  symptoms: string[];
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weightKg?: string;
  };
  prescription: {
    medicine: string;
    dosage: string;
    frequency: string;
    durationDays: number;
  }[];
  advice: string;
  followUpDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'queue' | 'appointment' | 'system' | 'reminder';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AnalyticsSummary {
  totalPatientsToday: number;
  activeQueueCount: number;
  completedConsultationsToday: number;
  avgWaitTimeMinutes: number;
  avgConsultationTimeMinutes: number;
  noShowRate: number;
  departmentStats: {
    departmentName: string;
    patientCount: number;
    avgWaitTime: number;
  }[];
  hourlyQueueTrend: {
    hour: string;
    waiting: number;
    completed: number;
  }[];
  doctorUtilization: {
    doctorName: string;
    specialty: string;
    patientsServed: number;
    satisfactionScore: number;
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
