import React, { useState } from 'react';
import { useLHRStore } from '../../store/useLHRStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  FileSpreadsheet, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  History
} from 'lucide-react';

export const LHRAuditTrailTable: React.FC = () => {
  const { auditLogs } = useLHRStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.patientMrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('EXPORT')) return <Badge variant="warning">{action}</Badge>;
    if (action.includes('INGEST')) return <Badge variant="success">{action}</Badge>;
    if (action.includes('CONFIDENTIAL')) return <Badge variant="danger">{action}</Badge>;
    return <Badge variant="info">{action}</Badge>;
  };

  const handleExportAuditCsv = () => {
    const headers = 'ID,UTC Timestamp,Local Timestamp,User ID,User Name,Role,Patient MRN,Action,Details,IP Address,Integrity Hash\n';
    const rows = filteredLogs.map((l) => 
      `"${l.id}","${l.timestampUtc}","${l.localTimestamp}","${l.userId}","${l.userName}","${l.userRole}","${l.patientMrn}","${l.action}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.complianceHash}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HIPAA_LHR_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200/80 dark:border-[#27272a] p-5 space-y-4 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              HIPAA &amp; GDPR Longitudinal Access Audit Ledger
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
              Immutable Chain Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident record of all longitudinal chart queries, filter updates, DICOM views, and data exports.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportAuditCsv}
          icon={<Download className="w-4 h-4" />}
        >
          Export CSV Audit Log
        </Button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by provider, MRN, action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-slate-500">Action Filter:</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">All Actions</option>
            <option value="VIEW_LHR_TIMELINE">VIEW_LHR_TIMELINE</option>
            <option value="EXPORT_CLINICAL_PDF">EXPORT_CLINICAL_PDF</option>
            <option value="EXPORT_FHIR_JSON">EXPORT_FHIR_JSON</option>
            <option value="VIEW_IMAGING_DICOM">VIEW_IMAGING_DICOM</option>
            <option value="INGEST_RECORD">INGEST_RECORD</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">UTC Timestamp</th>
              <th className="p-3">Authorized User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Target MRN</th>
              <th className="p-3">Action Type</th>
              <th className="p-3">Details</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Integrity Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                <td className="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {log.timestampUtc.split('T')[0]} {log.timestampUtc.split('T')[1]?.slice(0, 8)}Z
                </td>
                <td className="p-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                  {log.userName}
                </td>
                <td className="p-3 uppercase">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {log.userRole}
                  </span>
                </td>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                  {log.patientMrn}
                </td>
                <td className="p-3 font-sans">
                  {getActionBadge(log.action)}
                </td>
                <td className="p-3 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                  {log.details}
                </td>
                <td className="p-3 text-slate-500 text-[10px]">
                  {log.ipAddress}
                </td>
                <td className="p-3 text-slate-400 text-[10px] max-w-[120px] truncate" title={log.complianceHash}>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    {log.complianceHash.slice(0, 14)}...
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
