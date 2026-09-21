import { create } from 'zustand';
import { 
  LHREvent, 
  LHRCategory, 
  LHRAuditLogEntry, 
  LHRPatientSummary, 
  LHRVitalsTrajectoryPoint, 
  LHRComparativeMetric 
} from '../types/lhr';
import { UserRole } from '../types';
import { 
  mockLHREvents, 
  mockLHRAuditLogs, 
  mockLHRSummaries, 
  mockLHRVitalsTrajectory, 
  mockComparativeMetrics 
} from '../data/lhrMockData';

export type LHRTimeGranularity = '7d' | '30d' | '12m' | 'all' | 'custom';
export type LHRStatusFilter = 'all' | 'active_only' | 'pending_only' | 'abnormal_only';
export type LHRComparativePeriod = 'baseline' | 'yoy' | 'mom';

interface LHRState {
  events: LHREvent[];
  auditLogs: LHRAuditLogEntry[];
  summaries: Record<string, LHRPatientSummary>;
  selectedPatientId: string;
  selectedCategory: LHRCategory | 'all';
  timeGranularity: LHRTimeGranularity;
  dateRange: { start: string; end: string };
  searchQuery: string;
  statusFilter: LHRStatusFilter;
  comparativePeriod: LHRComparativePeriod;
  isIngesting: boolean;
  selectedEventForModal: LHREvent | null;

  // Actions
  setSelectedPatient: (patientId: string, actor?: { id: string; name: string; role: UserRole }) => void;
  setSelectedCategory: (category: LHRCategory | 'all') => void;
  setTimeGranularity: (granularity: LHRTimeGranularity) => void;
  setDateRange: (start: string, end: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: LHRStatusFilter) => void;
  setComparativePeriod: (period: LHRComparativePeriod) => void;
  setSelectedEventForModal: (event: LHREvent | null) => void;
  
  ingestNewEvent: (
    event: Omit<LHREvent, 'id' | 'timestampUtc' | 'localTimestamp' | 'timezone' | 'auditHash'>,
    actor: { id: string; name: string; role: UserRole }
  ) => LHREvent;

  logAuditEvent: (
    action: LHRAuditLogEntry['action'],
    details: string,
    actor: { id: string; name: string; role: UserRole }
  ) => void;

  exportRecords: (
    format: 'fhir_json' | 'clinical_pdf' | 'csv_audit',
    actor: { id: string; name: string; role: UserRole }
  ) => string;

  // Computed Selectors
  getFilteredEvents: () => LHREvent[];
  getVitalsTrajectory: () => LHRVitalsTrajectoryPoint[];
  getComparativeMetrics: () => LHRComparativeMetric[];
  getActiveSummary: () => LHRPatientSummary | undefined;
}

// Helper to calculate pseudo SHA-256 hash for audit immutability demo
const generateAuditHash = (payload: string): string => {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${Date.now().toString(16)}fa8b0c2e4f6a1d3f5a7b9c1d3e5f7a9b`;
};

export const useLHRStore = create<LHRState>((set, get) => ({
  events: mockLHREvents,
  auditLogs: mockLHRAuditLogs,
  summaries: mockLHRSummaries,
  selectedPatientId: 'pat-1',
  selectedCategory: 'all',
  timeGranularity: 'all',
  dateRange: { start: '', end: '' },
  searchQuery: '',
  statusFilter: 'all',
  comparativePeriod: 'baseline',
  isIngesting: false,
  selectedEventForModal: null,

  setSelectedPatient: (patientId, actor) => {
    set({ selectedPatientId: patientId });
    if (actor) {
      get().logAuditEvent(
        'VIEW_LHR_TIMELINE',
        `Switched active longitudinal review to patient ID ${patientId}`,
        actor
      );
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  setTimeGranularity: (granularity) => {
    set({ timeGranularity: granularity });
  },

  setDateRange: (start, end) => {
    set({ dateRange: { start, end }, timeGranularity: 'custom' });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter });
  },

  setComparativePeriod: (period) => {
    set({ comparativePeriod: period });
  },

  setSelectedEventForModal: (event) => {
    set({ selectedEventForModal: event });
  },

  ingestNewEvent: (eventPayload, actor) => {
    const now = new Date();
    const utcIso = now.toISOString();
    const localStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' EDT';

    const newId = `lhr-evt-${Date.now().toString().slice(-6)}`;
    const auditHash = generateAuditHash(JSON.stringify(eventPayload) + utcIso);

    const newEvent: LHREvent = {
      ...eventPayload,
      id: newId,
      timestampUtc: utcIso,
      localTimestamp: localStr,
      timezone: 'America/New_York (UTC-4)',
      auditHash,
    };

    set((state) => ({
      events: [newEvent, ...state.events],
    }));

    get().logAuditEvent(
      'INGEST_RECORD',
      `Automated record ingestion: [${newEvent.category.toUpperCase()}] ${newEvent.title}`,
      actor
    );

    return newEvent;
  },

  logAuditEvent: (action, details, actor) => {
    const now = new Date();
    const utcIso = now.toISOString();
    const localStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' EDT';

    const currentPatient = get().summaries[get().selectedPatientId];
    const newEntry: LHRAuditLogEntry = {
      id: `audit-log-${Date.now().toString().slice(-6)}`,
      timestampUtc: utcIso,
      localTimestamp: localStr,
      userId: actor.id,
      userName: actor.name,
      userRole: actor.role,
      patientId: get().selectedPatientId,
      patientMrn: currentPatient?.mrn || 'MRN-UNKNOWN',
      action,
      details,
      ipAddress: '10.240.12.84 (Hospital Intranet / TLS 1.3)',
      complianceHash: generateAuditHash(action + details + utcIso),
      isVerified: true,
    };

    set((state) => ({
      auditLogs: [newEntry, ...state.auditLogs],
    }));
  },

  exportRecords: (format, actor) => {
    const currentPatient = get().summaries[get().selectedPatientId];
    const filtered = get().getFilteredEvents();

    let exportAction: LHRAuditLogEntry['action'] = 'EXPORT_CLINICAL_PDF';
    if (format === 'fhir_json') exportAction = 'EXPORT_FHIR_JSON';

    get().logAuditEvent(
      exportAction,
      `Exported ${filtered.length} longitudinal records in ${format.toUpperCase()} format`,
      actor
    );

    if (format === 'fhir_json') {
      const fhirBundle = {
        resourceType: 'Bundle',
        type: 'collection',
        id: `bundle-${Date.now()}`,
        timestamp: new Date().toISOString(),
        entry: filtered.map((e) => ({
          resource: {
            resourceType: e.category === 'encounter' ? 'Encounter' : e.category === 'lab_result' ? 'Observation' : 'DiagnosticReport',
            id: e.id,
            status: e.status,
            subject: { reference: `Patient/${e.patientId}`, identifier: { value: e.mrn } },
            effectiveDateTime: e.timestampUtc,
            code: { text: e.title },
            performer: [{ display: e.provider.name, specialty: e.provider.specialty }],
          },
        })),
      };
      return JSON.stringify(fhirBundle, null, 2);
    }

    return `Longitudinal Health Record Export for ${currentPatient?.name || 'Patient'} (${currentPatient?.mrn || ''})\nExport Timestamp: ${new Date().toISOString()}\nTotal Records: ${filtered.length}`;
  },

  getFilteredEvents: () => {
    const { events, selectedPatientId, selectedCategory, timeGranularity, dateRange, searchQuery, statusFilter } = get();

    return events.filter((evt) => {
      // Patient Filter
      if (evt.patientId !== selectedPatientId) return false;

      // Category Filter
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) return false;

      // Status / Acuity Filter
      if (statusFilter === 'active_only') {
        if (evt.status !== 'active') return false;
      } else if (statusFilter === 'pending_only') {
        if (evt.status !== 'pending') return false;
      } else if (statusFilter === 'abnormal_only') {
        const hasAbnormalLab = evt.labData?.some((l) => l.flag && l.flag !== 'NORMAL');
        const isAbnormalImaging = evt.imagingData?.isAbnormal;
        const isElevatedAcuity = evt.clinicalAcuity === 'critical' || evt.clinicalAcuity === 'elevated';
        if (!hasAbnormalLab && !isAbnormalImaging && !isElevatedAcuity) return false;
      }

      // Time Granularity Filter
      const evtTime = new Date(evt.timestampUtc).getTime();
      const now = new Date('2026-09-21T12:00:00.000Z').getTime(); // System reference anchor

      if (timeGranularity === '7d') {
        const cutoff = now - 7 * 24 * 60 * 60 * 1000;
        if (evtTime < cutoff) return false;
      } else if (timeGranularity === '30d') {
        const cutoff = now - 30 * 24 * 60 * 60 * 1000;
        if (evtTime < cutoff) return false;
      } else if (timeGranularity === '12m') {
        const cutoff = now - 365 * 24 * 60 * 60 * 1000;
        if (evtTime < cutoff) return false;
      } else if (timeGranularity === 'custom' && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start).getTime();
        const end = new Date(dateRange.end).getTime() + 24 * 60 * 60 * 1000;
        if (evtTime < start || evtTime > end) return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesSummary = evt.summary.toLowerCase().includes(q);
        const matchesProvider = evt.provider.name.toLowerCase().includes(q) || evt.provider.specialty.toLowerCase().includes(q);
        const matchesTags = evt.tags.some((t) => t.toLowerCase().includes(q));
        const matchesLab = evt.labData?.some((l) => l.testName.toLowerCase().includes(q));
        const matchesRx = evt.prescriptionData?.drugName.toLowerCase().includes(q);

        if (!matchesTitle && !matchesSummary && !matchesProvider && !matchesTags && !matchesLab && !matchesRx) {
          return false;
        }
      }

      return true;
    });
  },

  getVitalsTrajectory: () => {
    return mockLHRVitalsTrajectory;
  },

  getComparativeMetrics: () => {
    return mockComparativeMetrics;
  },

  getActiveSummary: () => {
    const { summaries, selectedPatientId } = get();
    return summaries[selectedPatientId];
  },
}));
