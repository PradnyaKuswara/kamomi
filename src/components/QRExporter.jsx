import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Palette,
  RefreshCw,
  LayoutGrid,
  Eye,
} from 'lucide-react';

export default function QRExporter({
  propertyName = 'Kost Adem Tentrem',
  roomNumber = '102',
  guestUrl = 'https://kamomi.id/guest?room=102',
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [cardColor, setCardColor] = useState('cyan'); // cyan, indigo, emerald, amber
  const printRef = useRef(null);

  useEffect(() => {
    // Generate QR code
    QRCode.toDataURL(guestUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err));
  }, [guestUrl]);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create iframe or simple print window to print only the card
    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Kartu Kamomi - ${roomNumber}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { font-family: 'Outfit', sans-serif; }
              @media print {
                body { margin: 0; padding: 0; background: white; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body class="flex items-center justify-center min-h-screen bg-slate-100">
            <div class="p-8">${printContent}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getThemeClasses = () => {
    switch (cardColor) {
      case 'indigo':
        return {
          gradient: 'from-indigo-500 to-purple-600',
          text: 'text-indigo-600',
          border: 'border-indigo-500',
          bg: 'bg-indigo-50/50',
        };
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          text: 'text-emerald-600',
          border: 'border-emerald-500',
          bg: 'bg-emerald-50/50',
        };
      case 'amber':
        return {
          gradient: 'from-amber-500 to-orange-600',
          text: 'text-amber-600',
          border: 'border-amber-500',
          bg: 'bg-amber-50/50',
        };
      default:
        return {
          gradient: 'from-cyan-500 to-blue-600',
          text: 'text-cyan-600',
          border: 'border-cyan-500',
          bg: 'bg-cyan-50/50',
        };
    }
  };

  const colors = getThemeClasses();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Editor & Customizer Controls */}
      <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">
            Sesuaikan Desain Papan Pintu
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Atur tampilan kartu fisik untuk dicetak dan ditempel di kamar.
          </p>
        </div>

        {/* Color Theme Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Palette className="h-4 w-4" />
            Tema Warna Kartu
          </label>
          <div className="flex gap-3">
            {[
              { id: 'cyan', color: 'bg-cyan-500' },
              { id: 'indigo', color: 'bg-indigo-500' },
              { id: 'emerald', color: 'bg-emerald-500' },
              { id: 'amber', color: 'bg-amber-500' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCardColor(c.id)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${c.color} ${
                  cardColor === c.id
                    ? 'border-slate-900 dark:border-white scale-110 shadow-lg'
                    : 'border-transparent hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Exporter Actions */}
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Printer className="h-4 w-4" />
            Cetak Kartu (Print)
          </button>

          <a
            href={qrCodeDataUrl}
            download={`QR-Card-Kamar-${roomNumber}.png`}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="h-4 w-4" />
            Unduh QR Saja
          </a>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-400 space-y-1">
          <span className="font-bold block">💡 Rekomendasi Ukuran Cetak:</span>
          <p>
            Cetaklah di kertas tebal (Art Paper 260gsm) dengan ukuran A6 (10.5 x
            14.8 cm) lalu masukkan ke dalam dudukan Akrilik atau jadikan Stiker
            pintu.
          </p>
        </div>
      </div>

      {/* Preview Card Design */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Eye className="h-3.5 w-3.5" />
          Preview Desain Cetak (A6 Hang Card)
        </div>

        {/* Printable Card Area */}
        <div
          ref={printRef}
          className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-900 w-75 h-105 flex flex-col justify-between items-center relative overflow-hidden transition-all duration-300"
        >
          {/* Accent Header Stripe */}
          <div
            className={`absolute top-0 left-0 w-full h-4 bg-linear-to-r ${colors.gradient}`}
          />

          {/* Top Brand Info */}
          <div className="text-center mt-3">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest ${colors.text}`}
            >
              KAMOMI GUESTBOOK
            </span>
            <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-60">
              {propertyName}
            </h4>
          </div>

          {/* Center Room Number Badge */}
          <div className="text-center my-2">
            <div
              className={`text-[10px] uppercase font-bold tracking-wider text-slate-400`}
            >
              Nomor Kamar
            </div>
            <div className="text-6xl font-black tracking-tight text-slate-900 mt-1">
              {roomNumber}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative p-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="Room QR Code"
                className="h-36 w-36"
              />
            ) : (
              <div className="h-36 w-36 flex items-center justify-center text-slate-300">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          {/* Bottom Call to Action */}
          <div className="text-center mb-1">
            <p className="text-xs font-bold text-slate-800">
              Scan QR Code untuk info Wi-Fi & Fasilitas
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Asisten Pintar Kamar Kamu • Powered by kamomi.id
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
