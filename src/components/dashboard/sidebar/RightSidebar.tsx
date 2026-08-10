import React from "react";
import { QrCode, Bell } from "lucide-react";
import { useNotificationsQuery } from "../../../rest/useNotification";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../../rest/queryClient";

interface RightSidebarProps {
  activeNotification: boolean;
  setActiveNotification: (active: boolean) => void;
}

export default function RightSidebar(props: RightSidebarProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RightSidebarContent {...props} />
    </QueryClientProvider>
  );
}

function RightSidebarContent({ activeNotification, setActiveNotification }: RightSidebarProps) {
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

  const { data: response } = useNotificationsQuery(0, 3);
  const notifications = response?.data?.content || [];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = banners[currentBanner];

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

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
            {banners.map((b, idx) => (
              <span
                key={b.id}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentBanner ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <h4 className="font-extrabold text-sm tracking-tight leading-tight">
            {activeBanner.title}
          </h4>
          <p className="text-[11px] text-white/90 leading-relaxed font-medium">
            {activeBanner.desc}
          </p>
        </div>

        <a
          href={activeBanner.buttonHref}
          className="inline-flex items-center gap-1 bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
        >
          {activeBanner.buttonText} →
        </a>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-cyan-500" />
            Notifikasi Terbaru
          </h4>
          {notifications.some(n => !n.isRead) && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400">
              Belum ada notifikasi
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border rounded-xl space-y-1 relative ${n.isRead
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'
                    : 'bg-cyan-500/5 border-cyan-500/20'
                  }`}
              >
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block uppercase">
                  {n.title}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold leading-tight">
                  {n.message}
                </p>
                <span className="text-[9px] text-slate-400 block font-sans">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>

        <a
          href="/dashboard/notifications"
          className="w-full text-center text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline py-1 block"
        >
          Lihat Semua Notifikasi
        </a>
      </div>
    </aside>
  );
}
