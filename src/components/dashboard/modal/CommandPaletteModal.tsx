import React from "react";
import { Search } from "lucide-react";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMenuItems: any[];
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  filteredMenuItems,
  selectedIndex,
  setSelectedIndex,
  searchInputRef,
}: CommandPaletteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-slate-800/40 shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative border-b border-slate-200/40 dark:border-slate-800/40 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Ketik untuk mencari menu halaman..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((selectedIndex + 1) % Math.max(1, filteredMenuItems.length));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(
                  (selectedIndex - 1 + filteredMenuItems.length) %
                    Math.max(1, filteredMenuItems.length)
                );
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredMenuItems[selectedIndex]) {
                  window.location.href = filteredMenuItems[selectedIndex].href;
                }
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              }
            }}
            className="w-full pl-12 pr-4 py-4 bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-semibold"
          />
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Menu Halaman
          </div>
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/10"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] bg-cyan-700 text-cyan-100 px-1.5 py-0.5 rounded font-mono">
                      Enter
                    </span>
                  )}
                </a>
              );
            })
          ) : (
            <div className="px-3 py-8 text-center text-xs text-slate-400">
              Tidak ada menu halaman yang sesuai.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 shadow-sm">
                ↑↓
              </kbd>{" "}
              Navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 shadow-sm">
                Enter
              </kbd>{" "}
              Pilih
            </span>
          </div>
          <div>
            <span className="flex items-center gap-1">
              <kbd className="px-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 shadow-sm">
                Esc
              </kbd>{" "}
              Tutup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
