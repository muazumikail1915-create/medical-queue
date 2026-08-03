import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Printer, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export const AdminReportsPage: React.FC = () => {
  const addToast = useToastStore((s) => s.addToast);

  const handleExport = (reportName: string) => {
    addToast({ type: 'success', title: 'Export Generated', message: `${reportName} downloaded as PDF/CSV.` });
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Hospital Compliance & OPD Reports</h1>
        <p className="text-xs text-slate-500">Download audited reports for hospital accreditation and operational metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Daily OPD Queue Throughput</h3>
              <p className="text-xs text-slate-500">Patient arrival times, wait durations, and room assignments</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" icon={<Download className="w-4 h-4" />} onClick={() => handleExport('OPD Queue Summary')}>
            Export Daily Report (PDF)
          </Button>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Doctor Utilization & Patient Caps</h3>
              <p className="text-xs text-slate-500">Consultation counts, average session times, and ratings</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" icon={<Download className="w-4 h-4" />} onClick={() => handleExport('Doctor Performance Summary')}>
            Export Performance Log (CSV)
          </Button>
        </Card>
      </div>
    </div>
  );
};
