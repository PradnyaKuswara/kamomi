import React from 'react';

export default function FaqSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Bantuan & FAQ
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Pelajari cara mengoptimalkan kartu QR kamar untuk bisnis penginapan Anda.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">1. Di mana sebaiknya menempelkan QR Code?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tempelkan stiker QR di pintu bagian dalam kamar, tepat di atas slot kunci pintu, atau di meja kerja dekat router Wi-Fi agar mudah dipindai oleh tamu.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">2. Berapa ukuran cetak yang ideal?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kami merekomendasikan ukuran **A6 (105 x 148 mm)** agar muat banyak informasi penting namun tetap kompak di pintu.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200">3. Apakah tamu perlu download aplikasi?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tidak sama sekali. Kamomi dirancang sebagai Web App (MPA) super ringan. Tamu hanya perlu memindai QR menggunakan aplikasi kamera HP bawaan, lalu browser akan otomatis membuka link info kamar instan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
