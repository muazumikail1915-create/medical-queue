import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLHRStore } from '../../store/useLHRStore';
import { useAuthStore } from '../../store/useAuthStore';
import { DoctorLHRPage } from './DoctorLHRPage';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Users, FolderHeart } from 'lucide-react';
import { mockPatients } from '../../data/mockData';
import { PatientCard } from '../../components/cards/PatientCard';

export const DoctorPatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedPatient, selectedPatientId } = useLHRStore();
  const { user, role } = useAuthStore();

  useEffect(() => {
    if (id) {
      setSelectedPatient(id, user ? { id: user.id, name: user.name, role } : undefined);
    }
  }, [id, user, role, setSelectedPatient]);

  // If no specific patient ID is provided in route, show directory lookup
  if (!id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-blue-600" />
              Patient Longitudinal Health Records (LHR) Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a patient record to inspect multi-year clinical timelines, diagnostic lab trajectories, and active regimens.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPatients.map((pat) => (
            <div key={pat.id} className="relative group">
              <PatientCard patient={pat} />
              <div className="mt-2 flex justify-end">
                <Link
                  to={`/doctor/patient/${pat.id}`}
                  className="w-full text-center py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold text-xs transition border border-blue-200 dark:border-blue-900 shadow-2xs"
                >
                  Open Longitudinal Health Record (LHR) →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/doctor/patient')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Patient Directory
        </Button>
      </div>

      <DoctorLHRPage />
    </div>
  );
};
