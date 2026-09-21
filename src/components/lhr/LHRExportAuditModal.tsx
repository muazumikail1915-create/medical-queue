import React, { useState } from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  FileDown, 
  ShieldCheck, 
  Code, 
  FileText, 
  Database, 
  Check, 
  Copy,
  Printer
} from 'lucide-react';

interface LHRExportAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LHRExportAuditModal: React.FC<LHRExportAuditModalProps> = ({ isOpen, onClose }) => {
  const { exportRecords, summaries, selectedPatientId, getFilteredEvents } = useLHRStore();
  const { user, role } = useAuthStore();
  const [selectedFormat, setSelectedFormat] = useState<'fhir_json' | 'clinical_pdf' | 'csv_audit'>('fhir_json');
  const [exportedOutput, setExportedOutput] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  const summary = summaries[selectedPatientId] || summaries['pat-1'];
  const filteredEvents = getFilteredEvents();

  const handleGenerateExport = () => {
    const actor = user ? { id: user.id, name: user.name, role } : { id: 'usr-demo', name: 'Authorized Provider', role: 'doctor' as const };
    const result = exportRecords(selectedFormat, actor);
    setExportedOutput(result);
  };

  const handleCopy = () => {
    if (exportedOutput) {
      navigator.clipboard.writeText(exportedOutput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Longitudinal Health Record (LHR)"
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        
        {/* Compliance Callout */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">HIPAA &amp; GDPR Audit Trail Activated</strong>
            All export actions are cryptographically signed, timestamped in UTC, and permanently appended to the tamper-evident audit ledger.
          </div>
        </div>

        {/* Export Target Scope */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <strong className="text-slate-800 dark:text-slate-200">{summary.name} ({summary.mrn})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Records in Scope:</span>
            <strong className="text-blue-600 dark:text-blue-400">{filteredEvents.length} Consolidated Events</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Authorized Requester:</span>
            <span>{user?.name || 'Dr. Sarah Jansen'} ({role.toUpperCase()})</span>
          </div>
        </div>

        {/* Format Selector Pills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Select Interoperability Export Format:
          </label>
          <div className="grid grid-cols-3 gap-3">
            
            <button
              type="button"
              onClick={() => { setSelectedFormat('fhir_json'); setExportedOutput(''); }}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFormat === 'fhir_json'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Code className="w-4 h-4 text-blue-600" /> HL7 FHIR R4
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Standard JSON Bundle for EMR transfer</p>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedFormat('clinical_pdf'); setExportedOutput(''); }}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFormat === 'clinical_pdf'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-emerald-600" /> Clinical Pass
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Formatted summary for print / PDF</p>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedFormat('csv_audit'); setExportedOutput(''); }}
              className={`p-3 rounded-xl border text-left transition ${
                selectedFormat === 'csv_audit'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Database className="w-4 h-4 text-purple-600" /> Audit CSV
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Tabular telemetry and lab series</p>
            </button>

          </div>
        </div>

        {/* Generate / Preview Action */}
        {!exportedOutput ? (
          <div className="pt-2">
            <Button
              className="w-full"
              variant="primary"
              onClick={handleGenerateExport}
              icon={<FileDown className="w-4 h-4" />}
            >
              Generate Authenticated Export &amp; Sign Audit Log
            </Button>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">Generated Export Payload:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Pass
                </button>
              </div>
            </div>

            <textarea
              readOnly
              rows={8}
              value={exportedOutput}
              className="w-full font-mono text-[11px] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-emerald-400 outline-none"
            />
          </div>
        )}

      </div>
    </Modal>
  );
};
