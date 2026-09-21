import React, { useState } from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { LHREvent, LHRCategory } from '../../types/lhr';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Scan, 
  Activity, 
  Receipt, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Download, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  AlertCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export const LHRTimeline: React.FC = () => {
  const { getFilteredEvents, setSelectedEventForModal } = useLHRStore();
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({
    'lhr-evt-001': true, // Expand first by default
  });

  const events = getFilteredEvents();

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryConfig = (category: LHRCategory) => {
    switch (category) {
      case 'encounter':
        return {
          icon: <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800',
          badgeText: 'EHR ENCOUNTER',
          badgeVariant: 'info' as const,
        };
      case 'lab_result':
        return {
          icon: <FlaskConical className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          badgeText: 'DIAGNOSTIC LAB',
          badgeVariant: 'completed' as const,
        };
      case 'prescription':
        return {
          icon: <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bgColor: 'bg-purple-50 dark:bg-purple-950/50',
          borderColor: 'border-purple-200 dark:border-purple-800',
          badgeText: 'PRESCRIPTION (RX)',
          badgeVariant: 'warning' as const,
        };
      case 'imaging':
        return {
          icon: <Scan className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
          bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
          borderColor: 'border-indigo-200 dark:border-indigo-800',
          badgeText: 'IMAGING & ECG',
          badgeVariant: 'scheduled' as const,
        };
      case 'vitals':
        return {
          icon: <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          bgColor: 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200 dark:border-amber-800',
          badgeText: 'VITALS TELEMETRY',
          badgeVariant: 'warning' as const,
        };
      case 'administrative':
        return {
          icon: <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
          bgColor: 'bg-slate-100 dark:bg-slate-800',
          borderColor: 'border-slate-200 dark:border-slate-700',
          badgeText: 'ADMIN / BILLING',
          badgeVariant: 'scheduled' as const,
        };
      case 'milestone':
        return {
          icon: <Award className="w-4 h-4 text-amber-500" />,
          bgColor: 'bg-amber-50 dark:bg-amber-950/40',
          borderColor: 'border-amber-200 dark:border-amber-800',
          badgeText: 'CARE MILESTONE',
          badgeVariant: 'success' as const,
        };
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Longitudinal Records Match Filters</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try expanding the time range or clearing active category filters to view full patient timeline history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Timeline Stream Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Chronological Longitudinal Journey
          </h3>
          <span className="text-xs font-mono text-slate-500 font-semibold">
            ({events.length} Events Ingested)
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            UTC Synced
          </span>
        </div>
      </div>

      {/* Timeline Items Stack with Connected Vertical Guide */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        
        {events.map((evt) => {
          const cfg = getCategoryConfig(evt.category);
          const isExpanded = !!expandedEvents[evt.id];

          return (
            <div key={evt.id} className="relative group">
              
              {/* Timeline Node Bullet */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 border-white dark:border-[#121214] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${cfg.bgColor}`}
              >
                {cfg.icon}
              </div>

              {/* Event Card */}
              <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] shadow-xs overflow-hidden transition-all hover:border-blue-400/50">
                
                {/* Event Summary Bar */}
                <div
                  onClick={() => toggleExpand(evt.id)}
                  className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none bg-slate-50/40 dark:bg-slate-900/20"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {cfg.badgeText}
                      </span>
                      {evt.status === 'pending' && (
                        <Badge variant="warning">PENDING TEST</Badge>
                      )}
                      {evt.clinicalAcuity === 'elevated' && (
                        <Badge variant="warning">ELEVATED ACUITY</Badge>
                      )}
                      {evt.clinicalAcuity === 'critical' && (
                        <Badge variant="danger">CRITICAL</Badge>
                      )}
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {evt.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {evt.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-mono pt-0.5">
                      <span>Provider: <strong className="text-slate-700 dark:text-slate-300">{evt.provider.name}</strong> ({evt.provider.specialty})</span>
                      <span>•</span>
                      <span>Facility: {evt.provider.facility}</span>
                    </div>
                  </div>

                  {/* Right Meta & Expand Icon */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {evt.localTimestamp}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        UTC: {evt.timestampUtc.split('T')[0]} {evt.timestampUtc.split('T')[1]?.slice(0, 5)}Z
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {isExpanded ? (
                        <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                          Collapse <ChevronUp className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          Expand Record <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Section */}
                {isExpanded && (
                  <div className="p-4.5 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-white dark:bg-[#121214] text-xs">
                    
                    {/* Category 1: Clinical SOAP Encounter Details */}
                    {evt.encounterData && evt.encounterData.soapNotes && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-600" /> Clinical SOAP Notes &amp; Findings
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Visit: {evt.encounterData.visitType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <strong className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] block">
                              S: Subjective
                            </strong>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {evt.encounterData.soapNotes.subjective}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <strong className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] block">
                              O: Objective
                            </strong>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {evt.encounterData.soapNotes.objective}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <strong className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] block">
                              A: Assessment
                            </strong>
                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                              {evt.encounterData.soapNotes.assessment}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <strong className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[10px] block">
                              P: Plan
                            </strong>
                            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                              {evt.encounterData.soapNotes.plan}
                            </p>
                          </div>
                        </div>

                        {/* ICD-10 Diagnoses Chips */}
                        {evt.encounterData.icd10Codes && evt.encounterData.icd10Codes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-500">ICD-10 Coding:</span>
                            {evt.encounterData.icd10Codes.map((code, idx) => (
                              <span
                                key={idx}
                                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              >
                                {code.code} • {code.description}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Category 2: Diagnostic Lab Results Table */}
                    {evt.labData && evt.labData.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" /> Ingested Biomarkers &amp; Reference Comparison
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">Standardized LOINC Ontology</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="p-2.5">Biomarker / Test Name</th>
                                <th className="p-2.5">Result Value</th>
                                <th className="p-2.5">Reference Range</th>
                                <th className="p-2.5">Flag Status</th>
                                <th className="p-2.5">Clinical Note</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {evt.labData.map((lab, idx) => {
                                const isNormal = !lab.flag || lab.flag === 'NORMAL';
                                const isHigh = lab.flag === 'HIGH' || lab.flag === 'CRITICAL_HIGH';
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">
                                      {lab.testName}{' '}
                                      {lab.code && <span className="text-[10px] font-mono text-slate-400">({lab.code})</span>}
                                    </td>
                                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                                      {lab.value} <span className="text-[10px] font-normal text-slate-500">{lab.unit}</span>
                                    </td>
                                    <td className="p-2.5 font-mono text-slate-500">{lab.referenceRange}</td>
                                    <td className="p-2.5">
                                      <span
                                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          isNormal
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                            : isHigh
                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                            : 'bg-amber-50 text-amber-800'
                                        }`}
                                      >
                                        {lab.flag || 'NORMAL'}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-slate-500 text-[11px]">
                                      {lab.interpretation || 'Within acceptable bounds'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Category 3: Prescription (Rx) Detail Card */}
                    {evt.prescriptionData && (
                      <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-950 dark:text-purple-200 text-sm flex items-center gap-1.5">
                            <Pill className="w-4 h-4 text-purple-600" />
                            {evt.prescriptionData.drugName}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 font-semibold uppercase">
                            Status: {evt.prescriptionData.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Dosage &amp; Route:</span>
                            <strong className="text-slate-800 dark:text-slate-200">{evt.prescriptionData.dosage} ({evt.prescriptionData.route})</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Frequency:</span>
                            <strong className="text-slate-800 dark:text-slate-200">{evt.prescriptionData.frequency}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Supply Duration:</span>
                            <strong className="text-slate-800 dark:text-slate-200">{evt.prescriptionData.duration}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">RxNorm Code:</span>
                            <strong className="font-mono text-purple-700 dark:text-purple-400">{evt.prescriptionData.rxNormCode || 'N/A'}</strong>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-purple-200/60 dark:border-purple-800/40 text-[11px] text-slate-600 dark:text-slate-400">
                          <strong>Pharmacy Instructions:</strong> {evt.prescriptionData.instructions}
                        </div>
                      </div>
                    )}

                    {/* Category 4: Imaging & ECG Impression Card */}
                    {evt.imagingData && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-950 dark:text-indigo-200 text-sm flex items-center gap-1.5">
                            <Scan className="w-4 h-4 text-indigo-600" />
                            {evt.imagingData.modality} • {evt.imagingData.bodySite}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 font-semibold">
                            Acc: {evt.imagingData.accessionNumber}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <p><strong className="text-slate-700 dark:text-slate-300">Findings:</strong> {evt.imagingData.findings}</p>
                          <p><strong className="text-indigo-900 dark:text-indigo-300 font-bold">Impression:</strong> {evt.imagingData.impression}</p>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-indigo-200/60 dark:border-indigo-800/40 text-[11px]">
                          <span className="text-slate-500">Interpreting Radiologist: <strong>{evt.imagingData.radiologist}</strong></span>
                          <button
                            onClick={() => alert(`Opening Hospital PACS viewer for accession #${evt.imagingData?.accessionNumber}`)}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> View DICOM in PACS Viewer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Category 5: Administrative / Billing Detail */}
                    {evt.adminData && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Insurance Claim: <strong className="font-mono">{evt.adminData.claimId}</strong>
                          </span>
                          <Badge variant="completed">Claim {evt.adminData.claimStatus}</Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Payer:</span>
                            <span className="font-semibold">{evt.adminData.insurancePayer}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Billed:</span>
                            <span className="font-mono font-bold">${evt.adminData.billedAmount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Covered:</span>
                            <span className="font-mono font-bold text-emerald-600">${evt.adminData.coveredAmount.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Patient Copay:</span>
                            <span className="font-mono font-bold">${evt.adminData.patientResponsibility.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Category 6: Care Plan Milestone */}
                    {evt.milestoneData && (
                      <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-600" />
                          <h5 className="font-bold text-amber-900 dark:text-amber-200">{evt.milestoneData.title}</h5>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{evt.milestoneData.clinicalImpact}</p>
                      </div>
                    )}

                    {/* Vitals Snapshot if attached to encounter */}
                    {evt.vitalsData && (
                      <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Encounter Telemetry Vitals Snapshot:
                        </span>
                        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                          <span>BP: <strong>{evt.vitalsData.bpSystolic}/{evt.vitalsData.bpDiastolic} mmHg</strong></span>
                          <span>•</span>
                          <span>HR: <strong>{evt.vitalsData.heartRate} bpm</strong></span>
                          <span>•</span>
                          <span>SpO₂: <strong>{evt.vitalsData.spo2}%</strong></span>
                          <span>•</span>
                          <span>Glucose: <strong>{evt.vitalsData.bloodGlucose} mg/dL</strong></span>
                          <span>•</span>
                          <span>BMI: <strong>{evt.vitalsData.bmi}</strong></span>
                        </div>
                      </div>
                    )}

                    {/* Integrity Hash & Compliance Audit Trail Footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">Cryptographic Integrity Hash: <strong className="text-slate-600 dark:text-slate-400">{evt.auditHash}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span>Timezone: {evt.timezone}</span>
                        {evt.attachments && evt.attachments.length > 0 && (
                          <button
                            onClick={() => alert(`Downloading attachment ${evt.attachments?.[0].name}`)}
                            className="text-blue-600 font-sans font-semibold hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> {evt.attachments[0].name}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
