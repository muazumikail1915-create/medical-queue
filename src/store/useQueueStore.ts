import { create } from 'zustand';
import { QueueItem, QueueStatus } from '../types';
import { mockQueueItems } from '../data/mockData';
import { useToastStore } from './useToastStore';

interface QueueState {
  queue: QueueItem[];
  soundEnabled: boolean;
  toggleSound: () => void;
  callNextPatient: (doctorId: string) => void;
  completeConsultation: (queueId: string) => void;
  skipPatient: (queueId: string) => void;
  registerWalkIn: (patientData: {
    patientName: string;
    patientPhone: string;
    patientAge: number;
    patientGender: 'male' | 'female' | 'other';
    doctorId: string;
    departmentId: string;
    isPriority?: boolean;
  }) => QueueItem;
  updateQueueStatus: (queueId: string, status: QueueStatus) => void;
  getPatientActiveTicket: (patientId: string) => QueueItem | undefined;
}

const playChimeSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio context may be restricted by browser policy before user interaction
  }
};

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: mockQueueItems,
  soundEnabled: true,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  callNextPatient: (doctorId) => {
    const { queue, soundEnabled } = get();
    const waitingItems = queue.filter(
      (q) => q.doctorId === doctorId && (q.status === 'waiting' || q.status === 'called')
    );

    if (waitingItems.length === 0) {
      useToastStore.getState().addToast({
        type: 'info',
        title: 'No Patients Waiting',
        message: 'There are currently no patients waiting in your queue.',
      });
      return;
    }

    // Sort by priority first then position
    const nextItem = [...waitingItems].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.position - b.position;
    })[0];

    const updatedQueue = queue.map((q) => {
      if (q.id === nextItem.id) {
        return {
          ...q,
          status: 'called' as QueueStatus,
          calledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return q;
    });

    set({ queue: updatedQueue });

    if (soundEnabled) {
      playChimeSound();
    }

    useToastStore.getState().addToast({
      type: 'success',
      title: `Calling Ticket ${nextItem.ticketNumber}`,
      message: `Patient ${nextItem.patientName} called to Room ${nextItem.roomNumber}.`,
    });
  },

  completeConsultation: (queueId) => {
    set((state) => {
      const target = state.queue.find((q) => q.id === queueId);
      if (!target) return state;

      const newQueue = state.queue.map((q) => {
        if (q.id === queueId) {
          return {
            ...q,
            status: 'completed' as QueueStatus,
            completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            position: 0,
            estimatedWaitMinutes: 0,
          };
        }
        // Recalculate position for remaining waiting items for this doctor
        if (q.doctorId === target.doctorId && q.status === 'waiting') {
          return {
            ...q,
            position: Math.max(1, q.position - 1),
            estimatedWaitMinutes: Math.max(0, (q.position - 1) * 8),
          };
        }
        return q;
      });

      return { queue: newQueue };
    });

    useToastStore.getState().addToast({
      type: 'success',
      title: 'Consultation Completed',
      message: 'Consultation marked completed. Next ticket is ready.',
    });
  },

  skipPatient: (queueId) => {
    set((state) => ({
      queue: state.queue.map((q) => (q.id === queueId ? { ...q, status: 'skipped' } : q)),
    }));

    useToastStore.getState().addToast({
      type: 'warning',
      title: 'Patient Skipped',
      message: 'Ticket marked as skipped. Patient can be called back later.',
    });
  },

  registerWalkIn: (data) => {
    const { queue } = get();
    const doctorItems = queue.filter((q) => q.doctorId === data.doctorId && q.status === 'waiting');
    const newPosition = doctorItems.length + 1;
    const ticketSeq = Math.floor(100 + Math.random() * 900);
    const prefix = data.departmentId === 'dept-1' ? 'CARD' : data.departmentId === 'dept-5' ? 'GEN' : 'OPD';
    const ticketNumber = `${prefix}-${ticketSeq}`;

    const newTicket: QueueItem = {
      id: `q-${Date.now()}`,
      ticketNumber,
      patientId: `pat-walkin-${Date.now()}`,
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientAge: data.patientAge,
      patientGender: data.patientGender,
      doctorId: data.doctorId,
      doctorName: 'Dr. Sarah Jenkins', // default or selected doctor name
      roomNumber: 'OPD-102',
      departmentId: data.departmentId,
      departmentName: data.departmentId === 'dept-1' ? 'Cardiology' : 'General Medicine',
      hospitalId: 'hosp-1',
      status: 'waiting',
      position: newPosition,
      estimatedWaitMinutes: newPosition * 10,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPriority: !!data.isPriority,
      type: 'walk-in',
    };

    set((state) => ({ queue: [...state.queue, newTicket] }));

    useToastStore.getState().addToast({
      type: 'success',
      title: 'Walk-In Ticket Created',
      message: `Issued ticket ${ticketNumber} for ${data.patientName}.`,
    });

    return newTicket;
  },

  updateQueueStatus: (queueId, status) => {
    set((state) => ({
      queue: state.queue.map((q) => (q.id === queueId ? { ...q, status } : q)),
    }));
  },

  getPatientActiveTicket: (patientId) => {
    return get().queue.find(
      (q) => q.patientId === patientId && (q.status === 'waiting' || q.status === 'called' || q.status === 'in-progress')
    );
  },
}));
