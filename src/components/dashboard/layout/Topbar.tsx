import React from "react";
import { Button, Kbd, Tooltip } from "@pradnyakuswara/ui";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";

interface TopbarProps {
  pageTitle: string;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

export default function Topbar({ pageTitle, setIsCommandPaletteOpen }: TopbarProps) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-base)] px-6 flex items-center justify-between shrink-0 relative z-40">
      <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
        {pageTitle}
      </h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-48 sm:w-64 md:w-80 flex items-center justify-between gap-2 px-3 py-2 bg-[var(--control-bg)] hover:bg-[var(--control-hover)] border border-[var(--border-color)] rounded-[var(--radius-md)] text-sm text-[var(--text-muted)] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Cari halaman...
          </span>
          <span className="hidden sm:inline-flex items-center gap-0.5">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <Tooltip content={darkMode ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"} placement="bottom">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            leftIcon={darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          />
        </Tooltip>
      </div>
    </header>
  );
}
