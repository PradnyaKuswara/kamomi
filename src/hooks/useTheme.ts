import { useState, useEffect } from 'react';

/** Sinkronkan class `dark` (Tailwind) dan `data-theme` (token @pradnyakuswara/ui). */
function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function useTheme() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    applyTheme(nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  };

  return { darkMode, toggleTheme };
}
