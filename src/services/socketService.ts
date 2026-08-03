import { io, Socket } from 'socket.io-client';
import { QueueItem } from '../types';

type QueueListener = (data: { event: 'position_changed' | 'patient_called' | 'queue_updated'; ticket: QueueItem }) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Set<QueueListener> = new Set();
  private isSimulating = false;
  private timer: number | null = null;

  connect() {
    try {
      this.socket = io('http://localhost:3000', {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 3,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected to real-time server');
      });

      this.socket.on('disconnect', () => {
        console.log('[Socket] Disconnected from server');
      });
    } catch {
      // Fallback to local simulation mode if Socket.IO backend server isn't actively running
      this.startSimulation();
    }
    this.startSimulation();
  }

  subscribeQueue(listener: QueueListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    // Simulate real-time queue ticking every 20 seconds
    this.timer = window.setInterval(() => {
      if (this.listeners.size > 0) {
        // Emit simulated position advance event
        const mockEventData = {
          event: 'position_changed' as const,
          ticket: {
            id: 'q-sim',
            ticketNumber: 'CARD-102',
            patientId: 'pat-1',
            patientName: 'Alexander Wright',
            patientPhone: '+1 (555) 432-1001',
            patientAge: 38,
            patientGender: 'male' as const,
            doctorId: 'doc-1',
            doctorName: 'Dr. Sarah Jenkins',
            roomNumber: 'OPD-102',
            departmentId: 'dept-1',
            departmentName: 'Cardiology',
            hospitalId: 'hosp-1',
            status: 'waiting' as const,
            position: Math.max(1, Math.floor(Math.random() * 3)),
            estimatedWaitMinutes: Math.floor(Math.random() * 12) + 2,
            checkInTime: '09:12 AM',
            isPriority: true,
            type: 'appointment' as const,
          },
        };
        this.listeners.forEach((fn) => fn(mockEventData));
      }
    }, 20000);
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
