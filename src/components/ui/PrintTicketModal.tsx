import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, Hospital, Clock, MapPin, User, Hash } from 'lucide-react';
import { QueueItem } from '../../types';

export interface PrintTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: QueueItem | null;
}

export const PrintTicketModal: React.FC<PrintTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Queue Ticket Issued" maxWidth="sm">
      <div className="space-y-4">
        {/* Printable Ticket Area */}
        <div className="bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-inner">
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Hospital className="w-5 h-5" />
            <span>City Care General Hospital</span>
          </div>

          <div className="py-2 border-y border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Queue Ticket Number</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
              {ticket.ticketNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">Patient</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Doctor</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.doctorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Room</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ticket.roomNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Position in Line</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">#{ticket.position}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Est. Wait Time: ~{ticket.estimatedWaitMinutes} mins</span>
          </div>

          {/* Barcode Mock */}
          <div className="pt-2 flex flex-col items-center gap-1">
            <div className="h-10 w-48 bg-slate-900 dark:bg-slate-200 rounded flex items-center justify-between px-2 text-[10px] text-white dark:text-slate-900 font-mono tracking-widest opacity-80 select-none">
              ||| |||| | ||||| || ||| ||||
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{ticket.id}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};
