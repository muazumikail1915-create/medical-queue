import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './useAuthStore';

const createMockStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    length: store.size,
  } as Storage;
};

describe('useAuthStore', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createMockStorage(),
      configurable: true,
    });

    useAuthStore.setState({
      user: null,
      role: 'patient',
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('rejects invalid credentials without creating a session', () => {
    expect(useAuthStore.getState().login('', 'patient', '')).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(window.localStorage.getItem('medqueue-session')).toBeNull();
  });

  it('persists a valid login for the selected role', () => {
    expect(useAuthStore.getState().login('alexander.w@example.com', 'patient', 'password123')).toBe(true);

    const session = window.localStorage.getItem('medqueue-session');
    expect(session).not.toBeNull();
    expect(JSON.parse(session as string).user.email).toBe('alexander.w@example.com');
    expect(useAuthStore.getState().role).toBe('patient');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
