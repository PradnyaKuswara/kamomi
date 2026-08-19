import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  MessageSquareWarning,
  FileText,
  Users,
  QrCode,
  CheckCircle2,
  TrendingUp,
  Shield,
  Wifi,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Zap,
  Printer
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  badge?: string;
  accentColor: string;
  bgLight: string;
  borderLight: string;
}

const TABS: TabItem[] = [
  {
    id: 'overview',
    title: 'Ringkasan & Statistik',
    shortDesc: 'Pantau tingkat hunian, keluhan, dan performa dalam 1 layar',
    icon: LayoutDashboard,
    badge: 'Realtime',
    accentColor: 'text-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200 dark:border-emerald-800/50',
  },
  {
    id: 'rooms',
    title: 'Manajemen Kamar & QR',
    shortDesc: 'Kelola unit kamar, ekspor QR Code akrilik A6 siap cetak',
    icon: Building2,
    accentColor: 'text-cyan-500',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    borderLight: 'border-cyan-200 dark:border-cyan-800/50',
  },
  {
    id: 'complaints',
    title: 'Pusat Keluhan Tamu',
    shortDesc: 'Terima laporan kerusakan secara instan tanpa chat penumpukan',
    icon: MessageSquareWarning,
    badge: 'Otomatis',
    accentColor: 'text-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    borderLight: 'border-rose-200 dark:border-rose-800/50',
  },
  {
    id: 'rules',
    title: 'Tata Tertib & Panduan',
    shortDesc: 'Update aturan & panduan fasilitas digital tanpa cetak ulang',
    icon: FileText,
    accentColor: 'text-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderLight: 'border-indigo-200 dark:border-indigo-800/50',
  },
  {
    id: 'staff',
    title: 'Kelola Staff & Akses',
    shortDesc: 'Bagi peran Admin & Staff dengan hak akses kamar terpisah',
    icon: Users,
    accentColor: 'text-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    borderLight: 'border-amber-200 dark:border-amber-800/50',
  },
];

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <section id="dashboard-showcase" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Pengelolaan Dashboard Kamomi
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Kendali Penuh Operasional Hunian <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Dalam Satu Dashboard Intuitif
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Tidak perlu lagi mengelola kamar secara manual. Dashboard Kamomi dirancang modern, responsif, dan sangat mudah digunakan oleh siapapun.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/10 scale-[1.02] z-10'
                    : 'bg-white/60 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  {tab.badge && (
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-bold line-clamp-1 ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab.title}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
                  {tab.shortDesc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Preview Window Container */}
        <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Mock Browser Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400 dark:bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-400 dark:bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 hidden sm:inline-block">
                https://kamomi.id/dashboard/preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Demo Mode
              </span>
            </div>
          </div>

          {/* Dynamic Content Area based on Selected Tab */}
          <div className="p-4 sm:p-6 lg:p-8 min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'overview' && <OverviewTabContent />}
                {activeTab === 'rooms' && <RoomsTabContent />}
                {activeTab === 'complaints' && <ComplaintsTabContent />}
                {activeTab === 'rules' && <RulesTabContent />}
                {activeTab === 'staff' && <StaffTabContent />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Callout inside Preview */}
          <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Semua data dapat disesuaikan dan diakses via Laptop & Smartphone.</span>
            </div>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all shrink-0 active:scale-95"
            >
              Mulai Uji Coba Gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* TAB 1: OVERVIEW & STATS */}
function OverviewTabContent() {
  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-emerald-500/5 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold">Total Kamar Terisi</span>
            <Building2 className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">18 / 20</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 90% Tingkat Occupancy
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-rose-500/5 dark:bg-rose-950/20">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-bold">Keluhan Butuh Tindakan</span>
            <MessageSquareWarning className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">2</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
            Kamar 102 (AC) & Kamar 205 (Wi-Fi)
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-cyan-500/5 dark:bg-cyan-950/20">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-2">
            <span className="text-xs font-bold">Total Scan QR Tamu</span>
            <QrCode className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">342</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Bulan Ini (+24% dari bulan lalu)
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-indigo-500/5 dark:bg-indigo-950/20">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-bold">Status Sistem</span>
            <Shield className="h-4 w-4" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">Aktif & Aman</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            SSL 256-bit Encrypted
          </div>
        </div>
      </div>

      {/* Simulated Quick Action Panel & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Aktivitas Tamu Realtime (24 Jam Terakhir)
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Auto-sync
            </span>
          </div>
          <div className="space-y-3">
            {[
              { time: '14:20', room: 'Kamar 102', event: 'Mengisi laporan keluhan AC kurang dingin', icon: MessageSquareWarning, color: 'text-amber-500' },
              { time: '13:05', room: 'Kamar 201', event: 'Terhubung ke Wi-Fi via QR Code', icon: Wifi, color: 'text-emerald-500' },
              { time: '11:45', room: 'Kamar 304', event: 'Melihat Panduan Tata Tertib Kost', icon: FileText, color: 'text-cyan-500' },
            ].map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    <ActIcon className={`h-4 w-4 ${act.color}`} />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white mr-2">{act.room}</span>
                      <span className="text-slate-600 dark:text-slate-400">{act.event}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Zap className="h-3 w-3" /> Fitur Unggulan
            </div>
            <h4 className="text-lg font-bold mb-1">Cetak Akrilik QR Card</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Ekspor desain QR kamar siap pakai untuk stiker atau papan akrilik A6 mewah secara instant.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
            <span>Siap Cetak A6 PDF</span>
            <Printer className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

{/* TAB 2: ROOM MANAGEMENT */}
function RoomsTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Daftar Kamar & QR Card Pintu</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Atur nomor kamar, tipe hunian, dan ekspor QR Code akrilik</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900">
            <Printer className="h-3.5 w-3.5" /> Cetak Semua QR
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md">
            <Plus className="h-3.5 w-3.5" /> Tambah Kamar
          </button>
        </div>
      </div>

      {/* Mock Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">No. Kamar</th>
              <th className="p-3.5">Tipe & Lantai</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Wi-Fi Kamar</th>
              <th className="p-3.5 text-right">Aksi QR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {[
              { room: 'Kamar 101', type: 'Deluxe AC (Lt 1)', status: 'Terisi', wifi: 'Kost_Lt1_101', badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' },
              { room: 'Kamar 102', type: 'Executive (Lt 1)', status: 'Terisi', wifi: 'Kost_Lt1_102', badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' },
              { room: 'Kamar 103', type: 'Standard (Lt 1)', status: 'Kosong', wifi: 'Kost_Lt1_103', badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
              { room: 'Kamar 201', type: 'Deluxe AC (Lt 2)', status: 'Terisi', wifi: 'Kost_Lt2_201', badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/50 transition-colors">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">{row.room}</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">{row.type}</td>
                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.badgeColor}`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">{row.wifi}</td>
                <td className="p-3.5 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold cursor-pointer hover:bg-emerald-100">
                    <QrCode className="h-3 w-3" /> Unduh QR A6
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

{/* TAB 3: COMPLAINTS */}
function ComplaintsTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Pusat Tiket Keluhan & Laporan Tamu</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Laporan masuk otomatis begitu tamu memindai QR Code di kamar</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold">
          2 Laporan Membutuhkan Penanganan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
              Perlu Tindakan
            </span>
            <span className="text-[10px] font-mono text-slate-400">10 Menit yang lalu</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">AC Kurang Dingin & Menetes</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              "Kamar 102 - Permisi min, AC di kamar 102 seperti kurang dingin dan ada tetesan air sedikit."
            </p>
          </div>
          <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tugaskan ke: <strong className="text-slate-800 dark:text-slate-200">Pak Budi (Teknisi)</strong></span>
            <button className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-500">
              Proses Tiket
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
              Sedang Dikerjakan
            </span>
            <span className="text-[10px] font-mono text-slate-400">1 Jam yang lalu</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Koneksi Wi-Fi Lambat</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              "Kamar 205 - Sinyal Wi-Fi agak lemah di area pojok meja kerja."
            </p>
          </div>
          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-500">Petugas: <strong className="text-slate-800 dark:text-slate-200">Rian (Staff IT)</strong></span>
            <button className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 flex items-center gap-1">
              <Check className="h-3 w-3" /> Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* TAB 4: RULES & GUIDES */}
function RulesTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Pengaturan Tata Tertib & Panduan Digital</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ubah aturan kapan saja — tamu langsung melihat versi terbaru tanpa cetak ulang</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500">
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: 'Jam Malam & Tamu berkunjung', desc: 'Maksimal menerima tamu jam 22.00 WIB di area ruang tamu utama.', category: 'Tata Tertib', color: 'border-indigo-200 dark:border-indigo-900' },
          { title: 'Penggunaan AC & Listrik', desc: 'Matikan AC dan lampu ketika meninggalkan kamar untuk keamanan bersama.', category: 'Panduan Hemat', color: 'border-emerald-200 dark:border-emerald-900' },
          { title: 'Panduan Water Heater', desc: 'Putar tuas ke kiri untuk air hangat, tunggu 15 detik hingga indikator menyala.', category: 'Fasilitas', color: 'border-cyan-200 dark:border-cyan-900' },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${item.color} bg-white dark:bg-slate-950 space-y-2`}>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {item.category}
            </span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

{/* TAB 5: STAFF & ACCESS */}
function StaffTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Manajemen Staff & Pembagian Tugas</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Atur akun pengelola, teknisi, dan penjaga kost dengan role terpisah</p>
        </div>
        <button className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Tambah Staff Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: 'Gusti Mantra', email: 'owner@kamomi.id', role: 'Super Admin', access: 'Semua Kamar (101-304)', badge: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' },
          { name: 'Budi Santoso', email: 'budi.staff@kamomi.id', role: 'Staff Kebersihan', access: 'Lantai 1 & 2', badge: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
        ].map((staff, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm">
                {staff.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{staff.name}</h4>
                <p className="text-[10px] text-slate-400">{staff.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${staff.badge}`}>{staff.role}</span>
                  <span className="text-[10px] text-slate-500">{staff.access}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
