import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';

export default function DashboardOverview() {
  const { user } = useUserData();
  const ownerName = user.name || 'User';
  const [propertyName, setPropertyName] = useState('Kost Adem Tentrem');

  const [stats, setStats] = useState({
    totalRooms: 12,
    activeQrs: 8,
    monthlyScans: 348,
    activeComplaints: 1
  });

  const [rooms, setRooms] = useState([
    { id: '101', name: 'Kamar 101', ssid: 'AdemTentrem_101', scans: 42, status: 'Aktif' },
    { id: '102', name: 'Kamar 102', ssid: 'AdemTentrem_102', scans: 89, status: 'Aktif' },
    { id: '103', name: 'Kamar 103', ssid: 'AdemTentrem_103', scans: 12, status: 'Aktif' }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProperty = localStorage.getItem('property_name');
      if (storedProperty) setPropertyName(storedProperty);
    }
  }, []);

  const setupSteps = [
    { id: 1, title: 'Buat Akun & Profil Kost', completed: true },
    { id: 2, title: 'Tambah Kamar Pertama', completed: true },
    { id: 3, title: 'Sesuaikan Tata Tertib Kamar', completed: false },
    { id: 4, title: 'Unduh & Cetak Kartu QR Pintu', completed: false },
    { id: 5, title: 'Scan Pertama dari Tamu', completed: false },
  ];

  const completedStepsCount = setupSteps.filter((s) => s.completed).length;
  const progressPercentage = Math.round((completedStepsCount / setupSteps.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">
            {propertyName}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white mt-1">
            Halo, {ownerName.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Pantau akses Wi-Fi, tata tertib, dan keluhan kost Anda dengan praktis.
          </p>
        </div>
        
        <a 
          href="/dashboard/rooms"
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all self-start sm:self-center"
        >
          Kelola Kamar
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Kamar</div>
          <div className="text-3xl font-black mt-2 text-slate-800 dark:text-white">{stats.totalRooms}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kamar Aktif QR</div>
          <div className="text-3xl font-black mt-2 text-cyan-500">{stats.activeQrs}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Scan Bulanan</div>
          <div className="text-3xl font-black mt-2 text-blue-500">{stats.monthlyScans}</div>
        </div>
        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-xs">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Keluhan Aktif</div>
          <div className="text-3xl font-black mt-2 text-rose-500">{stats.activeComplaints}</div>
        </div>
      </div>

      {/* Progress Setup Card */}
      <div className="bg-white dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xs flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4 w-full md:max-w-md">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Progres Setup Kost</h3>
            <span className="text-sm font-black text-cyan-500">{progressPercentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Selesaikan langkah tersisa untuk mengunduh tag pintu QR Anda.
          </p>

          <a
            href="/dashboard/rooms"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-cyan-500/10"
          >
            Lanjutkan Setup
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Checklist Steps */}
        <div className="w-full md:max-w-xs space-y-3.5 border-t md:border-t-0 md:border-l border-slate-200/50 dark:border-slate-800/50 pt-4 md:pt-0 md:pl-6">
          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Langkah Setup:</h4>
          <div className="space-y-2.5">
            {setupSteps.map((step) => (
              <div key={step.id} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${step.completed ? 'text-emerald-500' : 'text-slate-200 dark:text-slate-800'}`} />
                <span className={step.completed ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Room List */}
      <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Review Aktivitas Kamar Terakhir</h3>
          <a href="/dashboard/rooms" className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
            Lihat Semua Kamar
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                <th className="px-5 py-3.5">Kamar</th>
                <th className="px-5 py-3.5">SSID Wi-Fi</th>
                <th className="px-5 py-3.5">Total Scan</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">{room.name}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{room.ssid}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-semibold">{room.scans} kali</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400">
                      {room.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a href={`/editor?room=${room.id}`} className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold transition-all text-[10px]">
                      Edit & Cetak
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
