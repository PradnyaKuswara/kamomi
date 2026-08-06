import React, { useState, useEffect } from 'react';
import WiFiCard from './WiFiCard.tsx';
import HouseRules from './HouseRules.tsx';
import FacilityGuides from './FacilityGuides.tsx';
import QuickContact from './QuickContact.tsx';
import ReportIssue from './ReportIssue.tsx';
import { AlertCircle, ShieldAlert, Lock, RefreshCw } from 'lucide-react';
import type { PublicRoomData } from '../types/public-room';

interface GuestRoomPublicProps {
  code: string;
}

export default function GuestRoomPublic({ code }: GuestRoomPublicProps) {
  const [data, setData] = useState<PublicRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (!code) {
      setError('Kode kamar tidak valid');
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/public/rooms/${code}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data kamar');
        }
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.message || 'Gagal memuat data');
        }
      })
      .catch((err) => {
        setError(err.message || 'Terjadi kesalahan koneksi');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
        <p className="text-sm text-slate-400">Memuat info kamar...</p>
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
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || 'Data kamar tidak dapat ditemukan atau link tidak valid.'}
        </p>
      </div>
    );
  }

  if (data.isSuspended) {
    return (
      <div className="glassmorphic rounded-3xl p-8 border border-amber-500/30 text-center max-w-md mx-auto space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
            Layanan Ditangguhkan
          </span>
          <h2 className="text-xl font-black text-white tracking-tight pt-2">
            Akses Kamar {data.roomNumber} Terkunci
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            Layanan guestbook digital untuk properti **{data.propertyName}** saat ini sedang dinonaktifkan sementara karena masa berlangganan pemilik properti telah berakhir (H+7 Grace Period).
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
          <p className="text-[11px] text-slate-300 font-semibold">Bagi Tamu / Penghuni:</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">
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
    <div className="max-w-md mx-auto space-y-6">
      {/* Welcome Banner with Custom QR Design */}
      <div className="glassmorphic rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 text-center relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none"></div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-600 dark:text-cyan-400">
          {data.customTitle || 'Selamat Datang di'}
        </span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">
          {data.propertyName}
        </h2>
        <div className="inline-flex mt-4 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-extrabold text-xs tracking-wider uppercase">
          Kamar {data.roomNumber}
        </div>
        {data.customInstruction && (
          <p className="text-[10px] text-slate-400 mt-3 italic">
            "{data.customInstruction}"
          </p>
        )}
      </div>

      {/* Wifi Info */}
      <WiFiCard ssid={data.wifiSsid} password={data.wifiPassword} />

      {/* House Rules */}
      <HouseRules rules={mappedRules} />

      {/* Facility Instructions */}
      <FacilityGuides />

      {/* Support & Quick Contact */}
      <QuickContact onOpenReport={() => setReportOpen(true)} />

      {/* Issue Report Modal */}
      <ReportIssue
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        roomNumber={data.roomNumber}
      />
    </div>
  );
}
