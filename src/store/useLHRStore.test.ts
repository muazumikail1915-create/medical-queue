import { describe, it, expect, beforeEach } from 'vitest';
import { useLHRStore } from './useLHRStore';

describe('useLHRStore - Longitudinal Health Record Engine', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLHRStore.setState({
      selectedPatientId: 'pat-1',
      selectedCategory: 'all',
      timeGranularity: 'all',
      searchQuery: '',
      statusFilter: 'all',
    });
  });

  it('should initialize with mock longitudinal events and active patient summary', () => {
    const state = useLHRStore.getState();
    expect(state.events.length).toBeGreaterThan(0);
    expect(state.selectedPatientId).toBe('pat-1');

    const summary = state.getActiveSummary();
    expect(summary).toBeDefined();
    expect(summary?.mrn).toBe('MRN-90821');
    expect(summary?.chronicConditions.length).toBeGreaterThan(0);
  });

  it('should filter events by category properly', () => {
    const { setSelectedCategory, getFilteredEvents } = useLHRStore.getState();
    
    setSelectedCategory('encounter');
    const encounterEvents = getFilteredEvents();
    expect(encounterEvents.every((e) => e.category === 'encounter')).toBe(true);

    setSelectedCategory('lab_result');
    const labEvents = getFilteredEvents();
    expect(labEvents.every((e) => e.category === 'lab_result')).toBe(true);
  });

  it('should filter events by time granularity', () => {
    const { setTimeGranularity, getFilteredEvents } = useLHRStore.getState();
    
    setTimeGranularity('30d');
    const recentEvents = getFilteredEvents();
    expect(recentEvents.length).toBeGreaterThan(0);
  });

  it('should filter events by free-text search query', () => {
    const { setSearchQuery, getFilteredEvents } = useLHRStore.getState();
    
    setSearchQuery('Lisinopril');
    const searchResults = getFilteredEvents();
    expect(searchResults.length).toBeGreaterThan(0);
    expect(
      searchResults.some(
        (e) =>
          e.title.toLowerCase().includes('lisinopril') ||
          e.prescriptionData?.drugName.toLowerCase().includes('lisinopril')
      )
    ).toBe(true);
  });

  it('should ingest a new record and generate cryptographic audit hash & UTC timestamp', () => {
    const { ingestNewEvent, getFilteredEvents } = useLHRStore.getState();
    const actor = { id: 'doc-test', name: 'Dr. Test Physician', role: 'doctor' as const };

    const initialCount = getFilteredEvents().length;

    const newEvent = ingestNewEvent(
      {
        patientId: 'pat-1',
        mrn: 'MRN-90821',
        category: 'vitals',
        title: 'Bedside Continuous Telemetry Check',
        summary: 'Routine stable vitals logged',
        provider: {
          id: 'doc-test',
          name: 'Dr. Test Physician',
          role: 'Attending',
          specialty: 'Internal Medicine',
          facility: 'City Care Hospital',
          department: 'OPD',
        },
        status: 'completed',
        clinicalAcuity: 'normal',
        tags: ['Telemetry', 'Vitals'],
      },
      actor
    );

    expect(newEvent.id).toBeDefined();
    expect(newEvent.timestampUtc).toBeDefined();
    expect(newEvent.auditHash).toBeDefined();
    expect(newEvent.auditHash.startsWith('0x')).toBe(true);

    const updatedEvents = useLHRStore.getState().getFilteredEvents();
    expect(updatedEvents.length).toBe(initialCount + 1);
  });

  it('should log an immutable audit event upon LHR export', () => {
    const { exportRecords, auditLogs } = useLHRStore.getState();
    const actor = { id: 'doc-1', name: 'Dr. Sarah Jansen', role: 'doctor' as const };

    const initialAuditLength = auditLogs.length;
    const fhirJson = exportRecords('fhir_json', actor);

    expect(fhirJson).toContain('"resourceType": "Bundle"');
    
    const currentAudits = useLHRStore.getState().auditLogs;
    expect(currentAudits.length).toBe(initialAuditLength + 1);
    expect(currentAudits[0].action).toBe('EXPORT_FHIR_JSON');
    expect(currentAudits[0].isVerified).toBe(true);
  });
});
