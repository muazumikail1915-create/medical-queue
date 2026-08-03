import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockDoctors, mockPatients } from '../data/mockData';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultUserForRole = (role: UserRole): User => {
  switch (role) {
    case 'patient':
      return {
        id: mockPatients[0].id,
        name: mockPatients[0].name,
        email: mockPatients[0].email,
        role: 'patient',
        avatar: mockPatients[0].avatar,
        phone: mockPatients[0].phone,
      };
    case 'receptionist':
      return {
        id: 'rec-1',
        name: 'Clara Oswald',
        email: 'clara.reception@citycare.org',
        role: 'receptionist',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        phone: '+1 (555) 000-1122',
        hospitalId: 'hosp-1',
      };
    case 'doctor':
      return {
        id: mockDoctors[0].id,
        name: mockDoctors[0].name,
        email: mockDoctors[0].email,
        role: 'doctor',
        avatar: mockDoctors[0].avatar,
        phone: mockDoctors[0].phone,
        specialization: mockDoctors[0].specialty,
        departmentId: mockDoctors[0].departmentId,
        hospitalId: mockDoctors[0].hospitalId,
      };
    case 'admin':
      return {
        id: 'adm-1',
        name: 'Dr. Raymond Holt',
        email: 'raymond.admin@citycare.org',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        phone: '+1 (555) 999-0000',
        hospitalId: 'hosp-1',
      };
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialRole: UserRole = 'patient';
  const initialUser = defaultUserForRole(initialRole);

  return {
    user: initialUser,
    role: initialRole,
    isAuthenticated: true,
    login: (email, role) => {
      const u = defaultUserForRole(role);
      u.email = email;
      set({ user: u, role, isAuthenticated: true });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
    switchRole: (role) => {
      const u = defaultUserForRole(role);
      set({ user: u, role, isAuthenticated: true });
    },
  };
});
