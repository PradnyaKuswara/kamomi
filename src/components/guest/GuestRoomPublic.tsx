import { useState } from 'react';
import { LogoMark } from '../brand/Logo';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../rest/queryClient';
import WiFiCard from './WiFiCard.tsx';
import HouseRules from './HouseRules.tsx';
import FacilityGuides from './FacilityGuides.tsx';
import QuickContact from './QuickContact.tsx';
import ReportIssue from './ReportIssue.tsx';
import { AlertCircle, Lock, RefreshCw } from 'lucide-react';
import { usePublicRoomQuery } from '../../rest/useRoom';

interface GuestRoomPublicProps {
  code: string;
}

function GuestRoomPublicInner({ code }: GuestRoomPublicProps) {
  const [reportOpen, setReportOpen] = useState(false);

  const { data: response, isLoading: loading, isError, error: queryError } = usePublicRoomQuery(code);

  const data = response?.data;
  const error = isError ? (queryError?.message || 'Gagal memuat data') : (!code ? 'Kode kamar tidak valid' : null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 space-y-4">
        <RefreshCw className="h-8 w-8 text-[var(--primary-accent)] animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Memuat info kamar...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glassmorphic rounded-3xl p-8 border border-red-500/20 text-center max-w-md mx-auto space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Oops! Gagal Memuat Halaman</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {error || 'Data kamar tidak dapat ditemukan atau link tidak valid.'}
        </p>
      </div>
    );
  }

  if (data.isSuspended) {
    return (
      <div className="glassmorphic rounded-3xl p-8 border border-amber-500/30 text-center max-w-md mx-auto space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center text-[var(--color-warning)] animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-warning)] bg-amber-500/10 px-3 py-1 rounded-full">
            Layanan Ditangguhkan
          </span>
          <h2 className="text-xl font-black text-white tracking-tight pt-2">
            Akses Kamar {data.roomNumber} Terkunci
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1">
            Layanan guestbook digital untuk properti **{data.propertyName}** saat ini sedang dinonaktifkan sementara karena masa berlangganan pemilik properti telah berakhir (H+7 Grace Period).
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-left space-y-2">
          <p className="text-[11px] text-[var(--text-secondary)] font-semibold">Bagi Tamu / Penghuni:</p>
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
            Silakan hubungi pengelola kost/penginapan Anda secara langsung untuk menanyakan informasi Wi-Fi atau tata tertib kamar.
          </p>
        </div>
      </div>
    );
  }

  const mappedRules = data.rules ? data.rules.map((r: any) => ({
    id: r.id,
    title: r.title,
    desc: r.description,
    category: r.category
  })) : null;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-cyan-600 to-cyan-700 p-6 sm:p-7 text-white shadow-md">
        <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            {/* Kamomi Logo / Branding header if showLogo is true */}
            {(data.qrDesign?.showLogo ?? true) && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <LogoMark tone="inverse" className="h-5 w-5" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Kamomi.id
                </span>
              </div>
            )}

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-100/90">
              {data.qrDesign?.customTitle || 'Selamat Datang'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {data.propertyName}
            </h2>
            {data.qrDesign?.customInstruction && (
              <p className="text-xs sm:text-sm text-cyan-100/90 italic pt-0.5">
                "{data.qrDesign?.customInstruction}"
              </p>
            )}
          </div>
          <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white font-extrabold text-sm sm:text-base tracking-wide shrink-0 border border-white/25 shadow-sm">
            Kamar {data.roomNumber}
          </div>
        </div>
      </div>

      {/* Grid Layout for wider screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Wifi Info */}
          <WiFiCard ssid={data.wifiSsid} password={data.wifiPassword} />

          {/* Support & Quick Contact */}
          <QuickContact contacts={data.contacts} onOpenReport={() => setReportOpen(true)} />
        </div>

        <div className="space-y-6">
          {/* House Rules */}
          <HouseRules rules={mappedRules} />

          {/* Facility Instructions */}
          <FacilityGuides guides={data.facilityGuides} />
        </div>
      </div>

      {/* Powered by Footer when logo is hidden or subtle footer */}
      <div className="pt-2 text-center">
        <p className="text-xs text-[var(--text-muted)] font-medium">
          Powered by <a href="https://kamomi.id" target="_blank" rel="noreferrer" className="font-semibold text-[var(--primary-accent)] hover:underline">Kamomi.id</a>
        </p>
      </div>

      {/* Issue Report Modal */}
      <ReportIssue
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        roomNumber={data.roomNumber}
        roomCode={code}
      />
    </div>
  );
}

export default function GuestRoomPublic(props: GuestRoomPublicProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GuestRoomPublicInner {...props} />
    </QueryClientProvider>
  );
}
