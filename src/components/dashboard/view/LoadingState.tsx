import React from "react";
import { LogoMark } from '../../brand/Logo';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex flex-col items-center justify-center font-sans">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-2xl bg-cyan-500/20 animate-ping"></div>
        <div className="h-16 w-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shadow-lg relative z-10 animate-bounce">
          <LogoMark className="h-12 w-12" />
        </div>
      </div>
      <p className="text-xs font-black text-[var(--primary-accent)] tracking-widest uppercase animate-pulse">
        Menghubungkan ke Hunian Anda...
      </p>
    </div>
  );
}
