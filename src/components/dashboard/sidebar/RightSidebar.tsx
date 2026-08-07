import React from "react";
import { QrCode, Bell, MessageSquare } from "lucide-react";

interface RightSidebarProps {
  activeNotification: boolean;
  setActiveNotification: (active: boolean) => void;
}

export default function RightSidebar({ activeNotification, setActiveNotification }: RightSidebarProps) {
  const banners = [
    {
      id: 1,
      tag: "Rekomendasi Pintar",
      title: "Cetak Tag Akrilik Pintu",
      desc: "Pasang dudukan akrilik A6 di pintu kamar agar terlihat mewah dan profesional seperti hotel berbintang.",
      bgClass: "bg-emerald-600 dark:bg-emerald-700",
      buttonText: "Lihat Panduan Cetak",
      buttonHref: "/dashboard/faq",
    },
    {
      id: 2,
      tag: "Tips Efisiensi",
      title: "Kelola Tamu Realtime",
      desc: "Update tata tertib & Wi-Fi kamar kapan saja. Tamu dapat langsung memindai QR untuk info terbaru.",
      bgClass: "bg-cyan-600 dark:bg-cyan-700",
      buttonText: "Pelajari Fitur",
      buttonHref: "/dashboard/faq",
    },
    {
      id: 3,
      tag: "Info Upgrade",
      title: "Upgrade Premium",
      desc: "Nikmati cetak QR tak terbatas, kustomisasi desain QR, dan kelola banyak properti dalam satu akun.",
      bgClass: "bg-indigo-600 dark:bg-indigo-700",
      buttonText: "Upgrade Akun",
      buttonHref: "/dashboard/settings",
    }
  ];

  const [currentBanner, setCurrentBanner] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = banners[currentBanner];

  return (
    <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 space-y-6 shrink-0 md:h-full md:overflow-y-auto no-scrollbar">
      {/* Banner Carousel Container */}
      <div className={`p-5 rounded-2xl ${activeBanner.bgClass} text-white shadow-lg space-y-4 relative overflow-hidden transition-all duration-550 ease-in-out`}>
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <QrCode className="h-16 w-16" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[8px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md tracking-wider">
            {activeBanner.tag}
          </span>
          <div className="flex gap-1">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1 w-1.5 rounded-full transition-all duration-300 ${
                  idx === currentBanner ? "bg-white w-3" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-1.5 relative z-10 min-h-[64px]">
          <h4 className="font-extrabold text-sm tracking-tight">{activeBanner.title}</h4>
          <p className="text-[11px] text-white/90 leading-relaxed font-medium">
            {activeBanner.desc}
          </p>
        </div>
        <a
          href={activeBanner.buttonHref}
          className="w-full py-2 bg-white text-slate-800 dark:bg-slate-950 dark:text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all text-center block relative z-10 shadow-xs"
        >
          {activeBanner.buttonText}
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
