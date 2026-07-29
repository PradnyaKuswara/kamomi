import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { useActiveSubscriptionPlansQuery } from '../../rest/useSubscriptionPlans';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

export default function DashboardOverview() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <DashboardOverviewContent />
    </QueryClientProvider>
  );
}

function DashboardOverviewContent() {
  const { user, subscriptionInfo } = useUserData();
  const ownerName = user.name || 'User';
  const userProp = user.properties && user.properties.length > 0 ? user.properties[0].name : null;
  const [propertyName, setPropertyName] = useState(userProp || 'Kost Adem Tentrem');

  const { data: plansResponse, isLoading: isLoadingPlans } = useActiveSubscriptionPlansQuery();
  const plansFromDb = plansResponse?.data || [];

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
    if (userProp) {
      setPropertyName(userProp);
    }
  }, [userProp]);

  const setupSteps = [
    { id: 1, title: 'Buat Akun & Profil Kost', completed: true },
    { id: 2, title: 'Tambah Kamar Pertama', completed: true },
    { id: 3, title: 'Sesuaikan Tata Tertib Kamar', completed: false },
    { id: 4, title: 'Unduh & Cetak Kartu QR Pintu', completed: false },
    { id: 5, title: 'Scan Pertama dari Tamu', completed: false },
  ];

  const completedStepsCount = setupSteps.filter((s) => s.completed).length;
  const progressPercentage = Math.round((completedStepsCount / setupSteps.length) * 100);

  // Parse subscription data using subscriptionInfo
  const { planName, maxRooms, isUnlimited, isFreePlan } = subscriptionInfo;
  const isRoomLimitReached = !isUnlimited && stats.totalRooms >= maxRooms;

  const recommendedPlan = plansFromDb.find((p) => p.name === 'Starter' || p.name === 'Pro') || {
    name: 'Starter',
    price: 49000
  };

  return (
    <div className="relative min-h-[600px] space-y-8">
      {/* Blurred Dashboard Content Container for Free Plan */}
      <div className={`space-y-8 transition-all duration-300 ${isFreePlan ? 'blur-md select-none pointer-events-none opacity-40' : ''}`}>
        
        {/* Subscription Banner */}
        <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3.5 z-10">
            <div className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
              Paket {planName}
            </div>
            <div>
              <p className="text-xs text-slate-300">
                Penggunaan Kuota Kamar: <strong className={isRoomLimitReached ? 'text-rose-400' : 'text-white'}>{stats.totalRooms}</strong> / {isUnlimited ? '∞' : maxRooms} kamar
              </p>
              {isRoomLimitReached && (
                <p className="text-[11px] text-rose-400 font-semibold mt-0.5">
                  Anda telah mencapai batas maksimal kamar paket ini.
                </p>
              )}
            </div>
          </div>
          <a
            href="/pricing"
            className="z-10 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
          >
            {planName === 'Free' ? 'Upgrade Paket' : 'Kelola Langganan'}
          </a>
        </div>

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
            <div className="text-3xl font-black mt-2 text-slate-800 dark:text-white">
              {stats.totalRooms} <span className="text-xs font-normal text-slate-400">/ {isUnlimited ? '∞' : maxRooms}</span>
            </div>
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
          <div className="space-y-4 w-full md:max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Progres Setup Kost</h3>
              <span className="text-sm font-black text-cyan-500">{progressPercentage}%</span>
            </div>

            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Selesaikan langkah tersisa untuk mengunduh tag pintu QR Anda.
            </p>
          </div>

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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50">
                <tr>
                  <th className="px-5 py-3.5">Kamar</th>
                  <th className="px-5 py-3.5">SSID Wi-Fi</th>
                  <th className="px-5 py-3.5">Total Scan</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">{room.name}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">{room.ssid}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-semibold">{room.scans} kali</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400">
                        {room.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lock Overlay Modal for Free Plan Users */}
      {isFreePlan && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-slate-650/80 backdrop-blur-sm rounded-3xl min-h-[500px]">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 relative overflow-hidden">

            <div className="h-16 w-16 mx-auto rounded-3xl bg-cyan-600 flex items-center justify-center text-white text-2xl shadow-xl">
              🔒
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
                Fitur Dashboard Dibatasi untuk Paket Free
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                Buka Akses Dashboard Lengkap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                Paket <strong>Free</strong> hanya mencakup kebutuhan dasar tanpa akses panel analitik dashboard. Upgrade ke <strong>Paket Starter</strong> atau <strong>Pro</strong> untuk mengelola hingga 10-30 kamar, notifikasi WhatsApp, dan analitik scan real-time.
              </p>
            </div>

            {/* Price Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rekomendasi Paket</span>
                <p className="text-sm font-extrabold text-slate-800 dark:text-white">
                  Paket {recommendedPlan.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-cyan-500 block">
                  Rp {recommendedPlan.price.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-slate-400">/ bulan</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <a
                href="/pricing"
                className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02] block text-center"
              >
                Upgrade Ke Paket {recommendedPlan.name} Sekarang ✨
              </a>
              <a
                href="/pricing"
                className="text-[11px] font-semibold text-slate-400 hover:text-cyan-400 block transition-colors"
              >
                Lihat Perbandingan Semua Paket →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
