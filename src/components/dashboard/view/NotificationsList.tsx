import React, { useState } from 'react';
import { Bell, Search, Filter, Trash2, ShieldAlert, QrCode, AlertTriangle, Info, Clock, Check } from 'lucide-react';

interface Notification {
  id: number;
  type: 'COMPLAINT' | 'QR_ACTIVITY' | 'SYSTEM';
  title: string;
  desc: string;
  time: string;
  isRead: boolean;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'COMPLAINT',
      title: 'Keluhan Baru - Kamar 102',
      desc: 'Tamu melaporkan keluhan fasilitas: "AC Tidak Dingin, remote tidak berfungsi".',
      time: '2 jam yang lalu',
      isRead: false,
    },
    {
      id: 2,
      type: 'QR_ACTIVITY',
      title: 'Aktivitas QR - Kamar 101',
      desc: 'Scan QR Code tamu terdeteksi untuk mengakses informasi ruangan.',
      time: 'Kemarin, 14:20',
      isRead: false,
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: 'Sistem Terkoneksi',
      desc: 'Integrasi WhatsApp notification untuk tenant baru berhasil dikonfigurasi.',
      time: '2 hari yang lalu',
      isRead: true,
    },
    {
      id: 4,
      type: 'COMPLAINT',
      title: 'Keluhan Selesai - Kamar 105',
      desc: 'Status keluhan: "Kran Air Bocor" ditandai selesai oleh pengelola.',
      time: '3 hari yang lalu',
      isRead: true,
    },
    {
      id: 5,
      type: 'QR_ACTIVITY',
      title: 'Aktivitas QR - Kamar 103',
      desc: 'Scan QR Code tamu terdeteksi oleh tamu berkebangsaan asing.',
      time: '4 hari yang lalu',
      isRead: true,
    }
  ]);

  const [filter, setFilter] = useState<'ALL' | 'COMPLAINT' | 'QR_ACTIVITY' | 'SYSTEM'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = notifications.filter(n => {
    const matchesFilter = filter === 'ALL' || n.type === filter;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'COMPLAINT':
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'QR_ACTIVITY':
        return <QrCode className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-cyan-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'COMPLAINT':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-500/10';
      case 'QR_ACTIVITY':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-500/10';
      default:
        return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-500/10';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-cyan-500" />
            Aktivitas Notifikasi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau semua aktivitas QR, keluhan penghuni, dan informasi sistem terbaru.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-500/10 text-xs font-bold hover:bg-cyan-100/50 transition-all self-start cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari notifikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-xs outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === 'ALL'
                ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('COMPLAINT')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === 'COMPLAINT'
                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
            }`}
          >
            Keluhan
          </button>
          <button
            onClick={() => setFilter('QR_ACTIVITY')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === 'QR_ACTIVITY'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
            }`}
          >
            Aktivitas QR
          </button>
          <button
            onClick={() => setFilter('SYSTEM')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === 'SYSTEM'
                ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
            }`}
          >
            Sistem
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Bell className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-350">Tidak ada notifikasi ditemukan</p>
            <p className="text-xs text-slate-400 max-w-xs">Silakan ganti kata kunci pencarian Anda atau pilih filter kategori yang lain.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 bg-white dark:bg-slate-900/30 border rounded-2xl flex gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-300/40 dark:hover:border-slate-800/80 ${
                n.isRead 
                  ? 'border-slate-200/60 dark:border-slate-800/60 opacity-80' 
                  : 'border-cyan-500/20 dark:border-cyan-400/20 shadow-[0_0_16px_rgba(6,182,212,0.02)]'
              }`}
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center border shrink-0 ${getBadgeColor(n.type)}`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-sm tracking-tight truncate ${n.isRead ? 'font-bold text-slate-700 dark:text-slate-300' : 'font-extrabold text-slate-800 dark:text-white'}`}>
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {n.desc}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold pt-1.5 font-sans">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{n.time}</span>
                </div>
              </div>

              <button
                onClick={() => deleteNotification(n.id)}
                title="Hapus"
                className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors self-start cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
