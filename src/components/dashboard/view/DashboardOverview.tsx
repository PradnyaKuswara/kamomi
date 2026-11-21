import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useUserData } from '../../../hooks/useUserData';
import { useActiveSubscriptionPlansQuery } from '../../../rest/useSubscriptionPlans';
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
    <div className="relative min-h-150 space-y-8">
      {/* Blurred Dashboard Content Container for Free Plan */}
      <div className={`space-y-8 transition-all duration-300 ${isFreePlan ? 'blur-md select-none pointer-events-none opacity-40' : ''}`}>

        {/* Subscription Banner */}
        <div className="bg-cyan-950/40 border border-[var(--color-primary)]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3.5 z-10">
            <div className="px-3 py-1 rounded-full text-xs font-black bg-[var(--color-primary-soft)] text-[var(--primary-accent)] border border-[var(--color-primary)]/30 uppercase tracking-wider">
              Paket {planName}
            </div>
            <div>
              <p className="text-xs text-slate-300">
                Penggunaan Kuota Kamar: <strong className={isRoomLimitReached ? 'text-[var(--color-danger)]' : 'text-white'}>{stats.totalRooms}</strong> / {isUnlimited ? '∞' : maxRooms} kamar
              </p>
              {isRoomLimitReached && (
                <p className="text-[11px] text-[var(--color-danger)] font-semibold mt-0.5">
                  Anda telah mencapai batas maksimal kamar paket ini.
                </p>
              )}
            </div>
          </div>
          <a
            href="/pricing"
            className="z-10 px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs shadow-lg transition-all self-start sm:self-auto"
          >
            {planName === 'Free' ? 'Upgrade Paket' : 'Kelola Langganan'}
          </a>
        </div>

        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--primary-accent)] uppercase tracking-widest block">
              {propertyName}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] mt-1">
              Halo, {ownerName.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Pantau akses Wi-Fi, tata tertib, dan keluhan kost Anda dengan praktis.
            </p>
          </div>

          <a
            href="/dashboard/rooms"
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all self-start sm:self-center"
          >
            Kelola Kamar
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-color)] shadow-xs">
            <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Total Kamar</div>
            <div className="text-3xl font-black mt-2 text-[var(--text-primary)]">
              {stats.totalRooms} <span className="text-xs font-normal text-[var(--text-muted)]">/ {isUnlimited ? '∞' : maxRooms}</span>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-color)] shadow-xs">
            <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Kamar Aktif QR</div>
            <div className="text-3xl font-black mt-2 text-[var(--primary-accent)]">{stats.activeQrs}</div>
          </div>
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-color)] shadow-xs">
            <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Total Scan Bulanan</div>
            <div className="text-3xl font-black mt-2 text-blue-500">{stats.monthlyScans}</div>
          </div>
          <div className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-color)] shadow-xs">
            <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Keluhan Aktif</div>
            <div className="text-3xl font-black mt-2 text-[var(--color-danger)]">{stats.activeComplaints}</div>
          </div>
        </div>

        {/* Progress Setup Card */}
        <div className="bg-[var(--bg-surface)] rounded-3xl p-6 border border-[var(--border-color)] shadow-xs flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden">
          <div className="space-y-4 w-full md:max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[var(--text-primary)] text-base">Progres Setup Kost</h3>
              <span className="text-sm font-black text-[var(--primary-accent)]">{progressPercentage}%</span>
            </div>

            <div className="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-[var(--text-muted)]">
              Selesaikan langkah tersisa untuk mengunduh tag pintu QR Anda.
            </p>
          </div>

          <div className="w-full md:max-w-xs space-y-3.5 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-4 md:pt-0 md:pl-6">
            <h4 className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Langkah Setup:</h4>
            <div className="space-y-2.5">
              {setupSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${step.completed ? 'text-[var(--color-success-text)]' : 'text-slate-200 dark:text-slate-800'}`} />
                  <span className={step.completed ? 'text-[var(--text-secondary)] line-through dark:text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Room List */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Review Aktivitas Kamar Terakhir</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold tracking-wider text-[var(--text-muted)] bg-[var(--bg-subtle)] border-b border-[var(--border-color)]">
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
                    <td className="px-5 py-3.5 font-bold text-[var(--text-primary)]">{room.name}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] font-mono">{room.ssid}</td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)] font-semibold">{room.scans} kali</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 ">
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
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-slate-650/80 backdrop-blur-sm rounded-3xl min-h-125">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl text-center space-y-5 relative overflow-hidden">

            <div className="h-16 w-16 mx-auto rounded-3xl bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl shadow-xl">
              🔒
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[var(--color-warning)] bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
                Fitur Dashboard Dibatasi untuk Paket Free
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)]">
                Buka Akses Dashboard Lengkap
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                Paket <strong>Free</strong> hanya mencakup kebutuhan dasar tanpa akses panel analitik dashboard. Upgrade ke <strong>Paket Starter</strong> atau <strong>Pro</strong> untuk mengelola hingga 10-30 kamar, notifikasi WhatsApp, dan analitik scan real-time.
              </p>
            </div>

            {/* Price Preview Card */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex justify-between items-center text-left">
              <div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Rekomendasi Paket</span>
                <p className="text-sm font-extrabold text-[var(--text-primary)]">
                  Paket {recommendedPlan.name}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[var(--primary-accent)] block">
                  Rp {recommendedPlan.price.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-[var(--text-muted)]">/ bulan</span>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <a
                href="/pricing"
                className="w-full py-3.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-extrabold text-xs shadow-lg transition-all hover:scale-[1.02] block text-center"
              >
                Upgrade Ke Paket {recommendedPlan.name} Sekarang ✨
              </a>
              <a
                href="/pricing"
                className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--primary-accent)] block transition-colors"
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
