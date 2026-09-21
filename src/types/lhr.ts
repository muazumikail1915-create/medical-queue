import { UserRole } from './index';

export type LHRCategory = 
  | 'encounter' 
  | 'lab_result' 
  | 'prescription' 
  | 'imaging' 
  | 'vitals' 
  | 'administrative' 
  | 'milestone';

export type LHRStatus = 
  | 'completed' 
  | 'active' 
  | 'pending' 
  | 'discontinued' 
  | 'critical' 
  | 'normal';

export type LHRAcuity = 'normal' | 'elevated' | 'critical';

export interface LHRProvider {
  id: string;
  name: string;
  role: string;
  specialty: string;
  facility: string;
  department: string;
}

export interface LHRLabValue {
  testName: string;
  code?: string; // LOINC code
  value: number | string;
  unit?: string;
  referenceRange?: string;
  flag?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';
  interpretation?: string;
}

export interface LHRPrescriptionDetail {
  drugName: string;
  rxNormCode?: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'Sublingual' | 'Topical' | 'Inhalation';
  frequency: string;
  duration: string;
  status: 'active' | 'completed' | 'discontinued' | 'titrated';
  changeType?: 'new' | 'refill' | 'dosage_increase' | 'dosage_decrease' | 'stopped';
  prescribedBy: string;
  instructions: string;
}

export interface LHRImagingDetail {
  modality: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound' | 'ECG / EKG' | 'Echocardiogram';
  bodySite: string;
  accessionNumber: string;
  findings: string;
  impression: string;
  radiologist: string;
  pacsThumbnailUrl?: string;
  isAbnormal: boolean;
}

export interface LHRVitalsDetail {
  bpSystolic?: number;
  bpDiastolic?: number;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
  bloodGlucose?: number; // mg/dL
  weightKg?: number;
  bmi?: number;
  respiratoryRate?: number;
}

export interface LHREncounterDetail {
  visitType: 'Emergency' | 'Inpatient' | 'Outpatient Clinic' | 'Telehealth' | 'Follow-up';
  chiefComplaint: string;
  soapNotes?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  icd10Codes: { code: string; description: string }[];
  carePlan?: string;
}

export interface LHRAdminBillingDetail {
  claimId: string;
  encounterType: string;
  insurancePayer: string;
  billedAmount: number;
  coveredAmount: number;
  patientResponsibility: number;
  claimStatus: 'Paid' | 'Pending' | 'Adjudicated' | 'In Review';
  authorizationCode?: string;
}

export interface LHRMilestoneDetail {
  milestoneType: 'Diagnosis' | 'Surgery' | 'Care Plan Goal' | 'Immunization' | 'Allergy Flag';
  title: string;
  clinicalImpact: string;
  targetResolutionDate?: string;
}

export interface LHRAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'dicom' | 'image' | 'lab_report';
  size: string;
  url: string;
}

export interface LHREvent {
  id: string;
  patientId: string;
  mrn: string;
  timestampUtc: string; // ISO 8601 UTC
  localTimestamp: string;
  timezone: string;
  category: LHRCategory;
  title: string;
  summary: string;
  provider: LHRProvider;
  status: LHRStatus;
  clinicalAcuity?: LHRAcuity;
  isConfidential?: boolean; // HIPAA sensitive flag for restricted view
  
  // Specific category payload
  labData?: LHRLabValue[];
  prescriptionData?: LHRPrescriptionDetail;
  imagingData?: LHRImagingDetail;
  vitalsData?: LHRVitalsDetail;
  encounterData?: LHREncounterDetail;
  adminData?: LHRAdminBillingDetail;
  milestoneData?: LHRMilestoneDetail;
  
  attachments?: LHRAttachment[];
  tags: string[];
  auditHash: string; // SHA-256 integrity hash
}

export interface LHRVitalsTrajectoryPoint {
  date: string;
  timestampUtc: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  spo2: number;
  bloodGlucose?: number;
  weightKg?: number;
  hba1c?: number;
  eventRefId?: string;
}

export interface LHRComparativeMetric {
  metricName: string;
  unit: string;
  currentValue: number;
  previousValue: number;
  deltaPercent: number;
  trend: 'improving' | 'worsening' | 'stable';
  isFavorable: boolean;
  benchmarkRange: string;
  periodLabel: string;
}

export interface LHRAuditLogEntry {
  id: string;
  timestampUtc: string;
  localTimestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  patientId: string;
  patientMrn: string;
  action: 
    | 'VIEW_LHR_TIMELINE' 
    | 'APPLY_FILTER' 
    | 'VIEW_CONFIDENTIAL_SOAP' 
    | 'VIEW_IMAGING_DICOM' 
    | 'EXPORT_FHIR_JSON' 
    | 'EXPORT_CLINICAL_PDF' 
    | 'INGEST_RECORD';
  details: string;
  ipAddress: string;
  complianceHash: string;
  isVerified: boolean;
}

export interface LHRPatientSummary {
  patientId: string;
  mrn: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: { name: string; icd10: string; diagnosedDate: string; status: 'active' | 'managed' | 'resolved' }[];
  activePrescriptionsCount: number;
  pendingDiagnosticsCount: number;
  lastEncounterDate: string;
  riskScore: 'Low' | 'Moderate' | 'High' | 'Critical';
}
