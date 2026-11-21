import React, { useState } from 'react';
import { Badge, Button, Card, Stat, Table, type ColumnDef } from '@pradnyakuswara/ui';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  MessageSquareWarning,
  FileText,
  Users,
  QrCode,
  CheckCircle2,
  Shield,
  Wifi,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Zap,
  Printer,
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    id: 'overview',
    title: 'Ringkasan & Statistik',
    shortDesc: 'Pantau tingkat hunian, keluhan, dan performa dalam 1 layar',
    icon: LayoutDashboard,
    badge: 'Realtime',
  },
  {
    id: 'rooms',
    title: 'Manajemen Kamar & QR',
    shortDesc: 'Kelola unit kamar, ekspor QR Code akrilik A6 siap cetak',
    icon: Building2,
  },
  {
    id: 'complaints',
    title: 'Pusat Keluhan Tamu',
    shortDesc: 'Terima laporan kerusakan secara instan tanpa chat penumpukan',
    icon: MessageSquareWarning,
    badge: 'Otomatis',
  },
  {
    id: 'rules',
    title: 'Tata Tertib & Panduan',
    shortDesc: 'Update aturan & panduan fasilitas digital tanpa cetak ulang',
    icon: FileText,
  },
  {
    id: 'staff',
    title: 'Kelola Staff & Akses',
    shortDesc: 'Bagi peran Admin & Staff dengan hak akses kamar terpisah',
    icon: Users,
  },
];

export default function DashboardShowcase() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <section id="dashboard-showcase" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-(--color-primary)/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <Badge variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />}>
            Pengelolaan Dashboard Kamomi
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-(--text-primary) leading-[1.15]">
            Kendali Penuh Operasional Hunian <br className="hidden sm:inline" />
            <span className="text-(--primary-accent)">Dalam Satu Dashboard Intuitif</span>
          </h2>
          <p className="text-sm sm:text-base text-(--text-secondary) leading-relaxed">
            Tidak perlu lagi mengelola kamar secara manual. Dashboard Kamomi dirancang modern, responsif, dan sangat mudah digunakan oleh siapapun.
          </p>
        </div>

        {/* Tab Selector */}
        <div role="tablist" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 sm:p-4 rounded-(--radius-lg) border transition-all cursor-pointer ${isActive
                    ? 'bg-(--color-primary-soft) dark:bg-(--ui-primary-subtle) border-(--color-primary) shadow-(--shadow-2)'
                    : 'bg-(--bg-surface) border-(--border-color) hover:border-(--border-strong) hover:bg-(--control-hover)'
                  }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`p-2 rounded-(--radius-md) transition-colors ${isActive
                        ? 'bg-(--color-primary) text-(--color-on-primary)'
                        : 'bg-(--bg-subtle) text-(--text-secondary)'
                      }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  {tab.badge && (
                    <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {tab.title}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5 hidden sm:block">{tab.shortDesc}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Window */}
        <Card className="overflow-hidden shadow-[var(--shadow-3)]">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[var(--color-ink-300)] inline-block" />
              <span className="h-3 w-3 rounded-full bg-[var(--color-ink-300)] inline-block" />
              <span className="h-3 w-3 rounded-full bg-[var(--color-ink-300)] inline-block" />
              <span className="ml-3 text-[11px] font-mono font-medium text-[var(--text-muted)] hidden sm:inline-block">
                https://kamomi.id/dashboard/preview
              </span>
            </div>
            <Badge variant="success" size="sm" dot ping>
              Live Demo Mode
            </Badge>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 min-h-[420px]">
            <AnimatePresence mode="wait" initial={false}>
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

          <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-success-text)] shrink-0" />
              <span>Semua data dapat disesuaikan dan diakses via Laptop & Smartphone.</span>
            </div>
            <a href="/register">
              <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Mulai Uji Coba Gratis
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* TAB 1: OVERVIEW & STATS */
function OverviewTabContent() {
  const activities = [
    { time: '14:20', room: 'Kamar 102', event: 'Mengisi laporan keluhan AC kurang dingin', icon: MessageSquareWarning, color: 'text-[var(--color-warning)]' },
    { time: '13:05', room: 'Kamar 201', event: 'Terhubung ke Wi-Fi via QR Code', icon: Wifi, color: 'text-[var(--primary-accent)]' },
    { time: '11:45', room: 'Kamar 304', event: 'Melihat Panduan Tata Tertib Kost', icon: FileText, color: 'text-[var(--primary-accent)]' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat
          label="Total Kamar Terisi"
          value="18 / 20"
          change="90% Tingkat Occupancy"
          trend="up"
          icon={<Building2 className="h-4 w-4" />}
        />
        <Stat
          label="Keluhan Butuh Tindakan"
          value="2"
          helper="Kamar 102 (AC) & Kamar 205 (Wi-Fi)"
          icon={<MessageSquareWarning className="h-4 w-4" />}
        />
        <Stat
          label="Total Scan QR Tamu"
          value="342"
          change="+24%"
          trend="up"
          helper="Bulan ini"
          icon={<QrCode className="h-4 w-4" />}
        />
        <Stat label="Status Sistem" value="Aktif & Aman" helper="SSL 256-bit Encrypted" icon={<Shield className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-[var(--bg-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Aktivitas Tamu Realtime (24 Jam Terakhir)
            </h4>
            <Badge variant="outline" size="sm">
              Auto-sync
            </Badge>
          </div>
          <div className="space-y-3">
            {activities.map((act) => {
              const ActIcon = act.icon;
              return (
                <div
                  key={act.time}
                  className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <ActIcon className={`h-4 w-4 ${act.color}`} />
                    <div>
                      <span className="font-bold text-[var(--text-primary)] mr-2">{act.room}</span>
                      <span className="text-[var(--text-secondary)]">{act.event}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">{act.time}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-[var(--color-on-primary)] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Zap className="h-3 w-3" /> Fitur Unggulan
            </div>
            <h4 className="text-lg font-bold mb-1">Cetak Akrilik QR Card</h4>
            <p className="text-xs text-white/80 leading-relaxed">
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

/* TAB 2: ROOM MANAGEMENT */
interface RoomRow {
  room: string;
  type: string;
  status: 'Terisi' | 'Kosong';
  wifi: string;
}

const ROOM_ROWS: RoomRow[] = [
  { room: 'Kamar 101', type: 'Deluxe AC (Lt 1)', status: 'Terisi', wifi: 'Kost_Lt1_101' },
  { room: 'Kamar 102', type: 'Executive (Lt 1)', status: 'Terisi', wifi: 'Kost_Lt1_102' },
  { room: 'Kamar 103', type: 'Standard (Lt 1)', status: 'Kosong', wifi: 'Kost_Lt1_103' },
  { room: 'Kamar 201', type: 'Deluxe AC (Lt 2)', status: 'Terisi', wifi: 'Kost_Lt2_201' },
];

const ROOM_COLUMNS: ColumnDef<RoomRow>[] = [
  { accessorKey: 'room', header: 'No. Kamar' },
  { accessorKey: 'type', header: 'Tipe & Lantai' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue<string>();
      return (
        <Badge variant={v === 'Terisi' ? 'success' : 'default'} size="sm">
          {v}
        </Badge>
      );
    },
  },
  { accessorKey: 'wifi', header: 'Wi-Fi Kamar' },
  {
    id: 'qr',
    header: 'Aksi QR',
    cell: () => (
      <Button variant="outline" size="sm" leftIcon={<QrCode className="h-3 w-3" />}>
        Unduh QR A6
      </Button>
    ),
  },
];

function RoomsTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Daftar Kamar & QR Card Pintu</h3>
          <p className="text-xs text-[var(--text-secondary)]">Atur nomor kamar, tipe hunian, dan ekspor QR Code akrilik</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Printer className="h-3.5 w-3.5" />}>
            Cetak Semua QR
          </Button>
          <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Tambah Kamar
          </Button>
        </div>
      </div>

      <Table<RoomRow> data={ROOM_ROWS} columns={ROOM_COLUMNS} enableSorting={false} hoverable size="sm" />
    </div>
  );
}

/* TAB 3: COMPLAINTS */
function ComplaintsTabContent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Pusat Tiket Keluhan & Laporan Tamu</h3>
          <p className="text-xs text-[var(--text-secondary)]">Laporan masuk otomatis begitu tamu memindai QR Code di kamar</p>
        </div>
        <Badge variant="danger">2 Laporan Membutuhkan Penanganan</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3 border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] dark:bg-transparent">
          <div className="flex items-center justify-between">
            <Badge variant="danger" size="sm">
              Perlu Tindakan
            </Badge>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">10 Menit yang lalu</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">AC Kurang Dingin & Menetes</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              "Kamar 102 - Permisi min, AC di kamar 102 seperti kurang dingin dan ada tetesan air sedikit."
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">
              Tugaskan ke: <strong className="text-[var(--text-primary)]">Pak Budi (Teknisi)</strong>
            </span>
            <Button variant="danger" size="sm">
              Proses Tiket
            </Button>
          </div>
        </Card>

        <Card className="p-4 space-y-3 border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] dark:bg-transparent">
          <div className="flex items-center justify-between">
            <Badge variant="warning" size="sm">
              Sedang Dikerjakan
            </Badge>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">1 Jam yang lalu</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Koneksi Wi-Fi Lambat</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-1">"Kamar 205 - Sinyal Wi-Fi agak lemah di area pojok meja kerja."</p>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)]">
              Petugas: <strong className="text-[var(--text-primary)]">Rian (Staff IT)</strong>
            </span>
            <Button size="sm" leftIcon={<Check className="h-3 w-3" />}>
              Tandai Selesai
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* TAB 4: RULES & GUIDES */
function RulesTabContent() {
  const items = [
    { title: 'Jam Malam & Tamu berkunjung', desc: 'Maksimal menerima tamu jam 22.00 WIB di area ruang tamu utama.', category: 'Tata Tertib' },
    { title: 'Penggunaan AC & Listrik', desc: 'Matikan AC dan lampu ketika meninggalkan kamar untuk keamanan bersama.', category: 'Panduan Hemat' },
    { title: 'Panduan Water Heater', desc: 'Putar tuas ke kiri untuk air hangat, tunggu 15 detik hingga indikator menyala.', category: 'Fasilitas' },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Pengaturan Tata Tertib & Panduan Digital</h3>
          <p className="text-xs text-[var(--text-secondary)]">Ubah aturan kapan saja — tamu langsung melihat versi terbaru tanpa cetak ulang</p>
        </div>
        <Button size="sm">Simpan Perubahan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <Card key={item.title} className="p-4 space-y-2">
            <Badge variant="secondary" size="sm">
              {item.category}
            </Badge>
            <h4 className="font-bold text-xs text-[var(--text-primary)]">{item.title}</h4>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* TAB 5: STAFF & ACCESS */
function StaffTabContent() {
  const staff = [
    { name: 'Gusti Mantra', email: 'owner@kamomi.id', role: 'Super Admin', access: 'Semua Kamar (101-304)', variant: 'primary' as const },
    { name: 'Budi Santoso', email: 'budi.staff@kamomi.id', role: 'Staff Kebersihan', access: 'Lantai 1 & 2', variant: 'secondary' as const },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">Manajemen Staff & Pembagian Tugas</h3>
          <p className="text-xs text-[var(--text-secondary)]">Atur akun pengelola, teknisi, dan penjaga kost dengan role terpisah</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
          Tambah Staff Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {staff.map((s) => (
          <Card key={s.email} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] flex items-center justify-center font-bold text-[var(--text-primary)] text-sm shrink-0">
              {s.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-[var(--text-primary)]">{s.name}</h4>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{s.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={s.variant} size="sm">
                  {s.role}
                </Badge>
                <span className="text-[10px] text-[var(--text-secondary)]">{s.access}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
