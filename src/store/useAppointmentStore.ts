import { create } from 'zustand';
import { Appointment, AppointmentStatus } from '../types';
import { mockAppointments } from '../data/mockData';
import { useToastStore } from './useToastStore';

interface AppointmentState {
  appointments: Appointment[];
  bookAppointment: (newApt: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'status'>) => Appointment;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;
  updateStatus: (id: string, status: AppointmentStatus) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: mockAppointments,

  bookAppointment: (data) => {
    const aptNumber = `APT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const ticketNum = `${data.departmentName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
      status: 'scheduled',
      queueTicketNumber: ticketNum,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      appointments: [newAppointment, ...state.appointments],
    }));

    useToastStore.getState().addToast({
      type: 'success',
      title: 'Appointment Booked Successfully!',
      message: `Your appointment ${aptNumber} is confirmed for ${data.date} at ${data.timeSlot}.`,
    });

    return newAppointment;
  },

  cancelAppointment: (id, reason) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled', notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient' } : apt
      ),
    }));

    useToastStore.getState().addToast({
      type: 'info',
      title: 'Appointment Cancelled',
      message: 'The appointment has been successfully cancelled.',
    });
  },

  rescheduleAppointment: (id, newDate, newSlot) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, date: newDate, timeSlot: newSlot, status: 'scheduled' } : apt
      ),
    }));

    useToastStore.getState().addToast({
      type: 'success',
      title: 'Appointment Rescheduled',
      message: `Updated to ${newDate} at ${newSlot}.`,
    });
  },

  updateStatus: (id, status) => {
    set((state) => ({
      appointments: state.appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
    }));
  },
}));
