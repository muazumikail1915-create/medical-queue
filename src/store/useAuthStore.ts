import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockDoctors, mockPatients } from '../data/mockData';

const SESSION_STORAGE_KEY = 'medqueue-session';

const resolveStorage = (): Storage => {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const storage = window.localStorage;
      if (storage) {
        return storage;
      }
    }
  } catch {
    // Some test or sandbox environments do not expose browser storage.
  }

  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    length: store.size,
  } as Storage;
};

interface PersistedSession {
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  restoreSession: () => void;
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

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

const getExpectedCredentials = (role: UserRole) => {
  switch (role) {
    case 'patient':
      return { email: 'alexander.w@example.com', password: 'password123' };
    case 'receptionist':
      return { email: 'clara.reception@citycare.org', password: 'password123' };
    case 'doctor':
      return { email: 'sarah.jenkins@citycare.org', password: 'password123' };
    case 'admin':
      return { email: 'raymond.admin@citycare.org', password: 'password123' };
  }
};

const persistSession = (user: User, role: UserRole) => {
  const session: PersistedSession = { user, role, isAuthenticated: true };
  resolveStorage().setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  resolveStorage().removeItem(SESSION_STORAGE_KEY);
};

export const useAuthStore = create<AuthState>((set) => {
  const restoreFromStorage = () => {
    const raw = resolveStorage().getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return { user: null, role: 'patient' as UserRole, isAuthenticated: false };
    }

    try {
      const parsed = JSON.parse(raw) as PersistedSession;
      if (parsed?.user && parsed?.role && parsed?.isAuthenticated) {
        return {
          user: parsed.user,
          role: parsed.role,
          isAuthenticated: true,
        };
      }
    } catch {
      clearSession();
    }

    return { user: null, role: 'patient' as UserRole, isAuthenticated: false };
  };

  const restored = restoreFromStorage();

  return {
    user: restored.user,
    role: restored.role,
    isAuthenticated: restored.isAuthenticated,
    isLoading: false,
    login: (email, role, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
        return false;
      }

      const expected = getExpectedCredentials(role);
      const safePassword = password ?? '';

      const matchesSeededAccount =
        expected && normalizedEmail === expected.email && safePassword.length >= 6 && safePassword === expected.password;

      const isPatientSelfService =
        role === 'patient' &&
        safePassword.length >= 8 &&
        !expected?.email;

      if (!matchesSeededAccount && !isPatientSelfService) {
        return false;
      }

      const user = defaultUserForRole(role);
      user.email = normalizedEmail;

      if (role === 'patient') {
        user.name = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
      }

      persistSession(user, role);
      set({ user, role, isAuthenticated: true, isLoading: false });
      return true;
    },
    logout: () => {
      clearSession();
      set({ user: null, role: 'patient', isAuthenticated: false, isLoading: false });
    },
    switchRole: (role) => {
      const user = defaultUserForRole(role);
      persistSession(user, role);
      set({ user, role, isAuthenticated: true, isLoading: false });
    },
    restoreSession: () => {
      const restoredState = restoreFromStorage();
      set({
        user: restoredState.user,
        role: restoredState.role,
        isAuthenticated: restoredState.isAuthenticated,
        isLoading: false,
      });
    },
  };
});
