import React, { useState } from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LHRCategory, LHREvent } from '../../types/lhr';
import { 
  PlusCircle, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Scan, 
  Activity, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface LHRIngestRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LHRIngestRecordModal: React.FC<LHRIngestRecordModalProps> = ({ isOpen, onClose }) => {
  const { ingestNewEvent, selectedPatientId, summaries } = useLHRStore();
  const { user, role } = useAuthStore();
  
  const summary = summaries[selectedPatientId] || summaries['pat-1'];

  const [category, setCategory] = useState<LHRCategory>('encounter');
  const [title, setTitle] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [labTestName, setLabTestName] = useState('Serum Potassium');
  const [labValue, setLabValue] = useState('4.2');
  const [labUnit, setLabUnit] = useState('mmol/L');
  const [drugName, setDrugName] = useState('Metoprolol Succinate 25mg');
  const [dosage, setDosage] = useState('25 mg PO Daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actor = user ? { id: user.id, name: user.name, role } : { id: 'doc-1', name: 'Dr. Sarah Jansen, MD', role: 'doctor' as const };

    const payload: Omit<LHREvent, 'id' | 'timestampUtc' | 'localTimestamp' | 'timezone' | 'auditHash'> = {
      patientId: selectedPatientId,
      mrn: summary.mrn,
      category,
      title: title || `${category.toUpperCase()} Record Ingested`,
      summary: summaryText || 'Automated clinical touchpoint ingestion',
      provider: {
        id: actor.id,
        name: actor.name,
        role: 'Attending Physician',
        specialty: 'Internal Medicine',
        facility: 'City Care General Hospital',
        department: 'Clinical OPD',
      },
      status: 'completed',
      clinicalAcuity: 'normal',
      tags: [category, 'Ingested'],
    };

    if (category === 'encounter') {
      payload.encounterData = {
        visitType: 'Outpatient Clinic',
        chiefComplaint: summaryText || 'Follow-up consultation',
        soapNotes: soapNotes.subjective ? soapNotes : {
          subjective: 'Patient attended routine scheduled review.',
          objective: 'Vital signs stable.',
          assessment: 'Clinical stability maintained.',
          plan: 'Continue established treatment plan.',
        },
        icd10Codes: [{ code: 'Z00.00', description: 'General medical examination' }],
      };
    } else if (category === 'lab_result') {
      payload.labData = [
        {
          testName: labTestName,
          value: parseFloat(labValue) || labValue,
          unit: labUnit,
          referenceRange: '3.5 - 5.0',
          flag: 'NORMAL',
          interpretation: 'Within physiological baseline',
        },
      ];
    } else if (category === 'prescription') {
      payload.prescriptionData = {
        drugName,
        dosage,
        route: 'Oral',
        frequency: 'Once Daily',
        duration: '90 Days',
        status: 'active',
        changeType: 'new',
        prescribedBy: actor.name,
        instructions: 'Take as directed with water.',
      };
    }

    ingestNewEvent(payload, actor);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Automated Record Ingestion &amp; Time-Series Indexing"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong>Automated Ingestion Pipeline:</strong> New record entries are tagged with normalized UTC ISO 8601 timestamps, signed with a SHA-256 audit hash, and instantly aggregated into the patient's longitudinal index.
          </div>
        </div>

        {/* Patient Target */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono flex justify-between items-center">
          <span className="text-slate-500">Target Patient MRN:</span>
          <strong className="text-slate-900 dark:text-slate-100">{summary.name} ({summary.mrn})</strong>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Record Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'encounter', label: 'EHR Encounter', icon: <Stethoscope className="w-3.5 h-3.5" /> },
              { id: 'lab_result', label: 'Lab Result', icon: <FlaskConical className="w-3.5 h-3.5" /> },
              { id: 'prescription', label: 'Prescription (Rx)', icon: <Pill className="w-3.5 h-3.5" /> },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as LHRCategory)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  category === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Record Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Clinical Event Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Cardiology Medication Optimization & Lab Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Summary Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Clinical Summary *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Blood pressure well controlled on updated dosage"
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category Dynamic Fields */}
        {category === 'encounter' && (
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              SOAP Assessment Notes (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Subjective: Patient symptoms"
                value={soapNotes.subjective}
                onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Objective: Vitals & exam findings"
                value={soapNotes.objective}
                onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Assessment: Clinical diagnosis"
                value={soapNotes.assessment}
                onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Plan: Medication & follow-up"
                value={soapNotes.plan}
                onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {category === 'lab_result' && (
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Test Name</label>
              <input
                type="text"
                value={labTestName}
                onChange={(e) => setLabTestName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Result Value</label>
              <input
                type="text"
                value={labValue}
                onChange={(e) => setLabValue(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unit</label>
              <input
                type="text"
                value={labUnit}
                onChange={(e) => setLabUnit(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
        )}

        {category === 'prescription' && (
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Drug Name &amp; Strength</label>
              <input
                type="text"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dosage &amp; Frequency</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={<CheckCircle2 className="w-4 h-4" />}>
            Sign &amp; Ingest to LHR
          </Button>
        </div>

      </form>
    </Modal>
  );
};
