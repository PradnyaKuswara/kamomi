import React from "react";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-2xl bg-cyan-500/20 animate-ping"></div>
        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg relative z-10 animate-bounce">
          <img src="/logo.png" alt="Kamomi Logo" className="h-12 w-12 object-contain" />
        </div>
      </div>
      <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 tracking-widest uppercase animate-pulse">
        Menghubungkan ke Hunian Anda...
      </p>
    </div>
  );
}
