import React from "react";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface TopbarProps {
  pageTitle: string;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

export default function Topbar({ pageTitle, setIsCommandPaletteOpen }: TopbarProps) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 relative z-40">
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="relative w-48 sm:w-64 md:w-80 text-left flex items-center justify-between pl-3 pr-14 py-1.5 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-500 transition-all outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Cari halaman...</span>
          </div>
          <kbd className="absolute right-3 top-2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-1.5 font-mono text-[9px] font-medium text-slate-400 dark:text-slate-500 shadow-sm pointer-events-none select-none">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center shrink-0"
          title={darkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-cyan-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}

