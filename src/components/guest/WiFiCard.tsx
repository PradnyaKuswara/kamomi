import React, { useState } from 'react';
import { Wifi, Copy, Check, Info } from 'lucide-react';
import { toast } from '../../hooks/useToast';

export default function WiFiCard({ ssid = "AdemTentrem_102", password = "supersecurepass" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password Wi-Fi berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl p-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs relative overflow-hidden transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950/60 rounded-xl text-cyan-600 shrink-0">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-base">Koneksi Wi-Fi</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-cyan-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
              Internet Aktif
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Network Name */}
        <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Nama Wi-Fi (SSID)</div>
          <div className="font-semibold text-[var(--text-primary)] text-sm mt-0.5 select-all truncate">{ssid}</div>
        </div>

        {/* Password */}
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] min-w-0">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Password</div>
            <div className="font-mono font-semibold text-[var(--text-primary)] text-sm mt-0.5 select-all truncate">{password}</div>
          </div>
          
          <button
            onClick={handleCopy}
            title="Salin Password"
            className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              copied 
                ? 'bg-cyan-600 text-white' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
