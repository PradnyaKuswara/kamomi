import React from "react";
import { QrCode, Bell, MessageSquare } from "lucide-react";

interface RightSidebarProps {
  activeNotification: boolean;
  setActiveNotification: (active: boolean) => void;
}

export default function RightSidebar({ activeNotification, setActiveNotification }: RightSidebarProps) {
  return (
    <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 space-y-6 shrink-0">
      {/* Smart Recommendation Card */}
      <div className="p-5 rounded-2xl bg-cyan-600 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <QrCode className="h-16 w-16" />
        </div>
        <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block">
          Rekomendasi Pintar
        </span>
        <div className="space-y-1.5 relative">
          <h4 className="font-extrabold text-sm">Cetak Tag Akrilik Pintu</h4>
          <p className="text-[11px] text-cyan-50/80 leading-relaxed">
            Pasang dudukan akrilik A6 di pintu kamar agar terlihat mewah dan profesional seperti
            hotel berbintang.
          </p>
        </div>
        <a
          href="/dashboard/faq"
          className="w-full py-2 bg-white text-cyan-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all text-center block"
        >
          Lihat Panduan Cetak
        </a>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-cyan-500" />
            Notifikasi Terbaru
          </h4>
          {activeNotification && <span className="h-2 w-2 rounded-full bg-rose-500" />}
        </div>

        <div className="space-y-3">
          {activeNotification && (
            <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl space-y-1 relative">
              <button
                onClick={() => setActiveNotification(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ×
              </button>
              <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block uppercase">
                Keluhan Baru
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                Kamar 102 melaporkan keluhan: "AC Tidak Dingin"
              </p>
              <span className="text-[9px] text-slate-400 block">2 jam yang lalu</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl space-y-1">
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
              Aktivitas QR
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Scan QR terdeteksi di <strong>Kamar 101</strong> oleh tamu baru.
            </p>
            <span className="text-[9px] text-slate-400 block">Kemarin</span>
          </div>
        </div>

        <a
          href="/dashboard/complaints"
          className="w-full text-center text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline py-1 block"
        >
          Lihat Semua Notifikasi
        </a>
      </div>
    </aside>
  );
}
