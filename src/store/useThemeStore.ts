import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('medqueue-theme') : null;
  const initialDark = storedTheme ? storedTheme === 'dark' : true;
  if (typeof window !== 'undefined') {
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    isDarkMode: initialDark,
    toggleTheme: () =>
      set((state) => {
        const nextMode = !state.isDarkMode;
        if (typeof window !== 'undefined') {
          if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('medqueue-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('medqueue-theme', 'light');
          }
        }
        return { isDarkMode: nextMode };
      }),
    setDarkMode: (isDark) =>
      set(() => {
        if (typeof window !== 'undefined') {
          if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('medqueue-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('medqueue-theme', 'light');
          }
        }
        return { isDarkMode: isDark };
      }),
  };
});
