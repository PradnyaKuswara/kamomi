import React, { useState } from 'react';
import { Wifi, Copy, Check, Info } from 'lucide-react';
import { toast } from '../hooks/useToast';

export default function WiFiCard({ ssid = "AdemTentrem_102", password = "supersecurepass" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password Wi-Fi berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50 glow-card relative overflow-hidden transition-all duration-300">
      {/* Decorative Blur BG */}
      <div className="absolute -top-12 -right-12 h-24 w-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-950/50 rounded-xl text-cyan-600 dark:text-cyan-400">
            <Wifi className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Koneksi Wi-Fi Kamar</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Koneksi Cepat & Stabil
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Network Name */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nama Wi-Fi (SSID)</div>
          <div className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 select-all">{ssid}</div>
        </div>

        {/* Password */}
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/40">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Password</div>
            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5 select-all">{password}</div>
          </div>
          
          <button
            onClick={handleCopy}
            className={`px-4 rounded-xl flex items-center justify-center transition-all ${
              copied 
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/10'
            }`}
          >
            {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <p>Gunakan Wi-Fi dengan bijak. Dilarang mengunduh file ilegal atau konten bajakan.</p>
      </div>
    </div>
  );
}
