import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Printer,
  Palette,
  RefreshCw,
  Layout,
  Type,
  Eye,
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

interface QRExporterProps {
  propertyName?: string;
  roomNumber?: string;
  guestUrl?: string;
  roomId?: number | null;
  cardColor?: string;
  setCardColor?: (c: string) => void;
  template?: 'modern' | 'minimal' | 'luxury' | 'glass' | 'neon' | 'retro';
  setTemplate?: (t: 'modern' | 'minimal' | 'luxury' | 'glass' | 'neon' | 'retro') => void;
  customTitle?: string;
  setCustomTitle?: (t: string) => void;
  labelRoom?: string;
  setLabelRoom?: (t: string) => void;
  customInstruction?: string;
  setCustomInstruction?: (t: string) => void;
  showLogo?: boolean;
  setShowLogo?: (b: boolean) => void;
}

export default function QRExporter({
  propertyName = 'Kost Adem Tentrem',
  roomNumber = '102',
  guestUrl = 'https://kamomi.id/guest?room=102',
  roomId = null,
  cardColor: propCardColor,
  setCardColor: propSetCardColor,
  template: propTemplate,
  setTemplate: propSetTemplate,
  customTitle: propCustomTitle,
  setCustomTitle: propSetCustomTitle,
  labelRoom: propLabelRoom,
  setLabelRoom: propSetLabelRoom,
  customInstruction: propCustomInstruction,
  setCustomInstruction: propSetCustomInstruction,
  showLogo: propShowLogo,
  setShowLogo: propSetShowLogo,
}: QRExporterProps) {
  const { subscriptionInfo } = useUserData();
  const isFreePlan = subscriptionInfo?.isFreePlan ?? true;

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  
  // Local fallbacks if props are not provided
  const [localCardColor, setLocalCardColor] = useState('cyan');
  const [localTemplate, setLocalTemplate] = useState<'modern' | 'minimal' | 'luxury' | 'glass' | 'neon' | 'retro'>('modern');
  const [localCustomTitle, setLocalCustomTitle] = useState(propertyName || 'KAMOMI GUESTBOOK');
  const [localLabelRoom, setLocalLabelRoom] = useState('NOMOR KAMAR');
  const [localCustomInstruction, setLocalCustomInstruction] = useState('Scan QR Code untuk Informasi Fasilitas');
  const [localShowLogo, setLocalShowLogo] = useState(true);

  // Active state choices (prop || local fallback)
  const cardColor = propCardColor || localCardColor;
  const setCardColor = propSetCardColor || setLocalCardColor;
  
  const template = propTemplate || localTemplate;
  const setTemplate = propSetTemplate || setLocalTemplate;
  
  const customTitle = propCustomTitle || localCustomTitle;
  const setCustomTitle = propSetCustomTitle || setLocalCustomTitle;
  
  const labelRoom = propLabelRoom || localLabelRoom;
  const setLabelRoom = propSetLabelRoom || setLocalLabelRoom;
  
  const customInstruction = propCustomInstruction || localCustomInstruction;
  const setCustomInstruction = propSetCustomInstruction || setLocalCustomInstruction;
  
  const showLogo = propShowLogo !== undefined ? propShowLogo : localShowLogo;
  const setShowLogo = propSetShowLogo || setLocalShowLogo;
  
  const printRef = useRef<HTMLDivElement | null>(null);

  // Set watermark defaults based on subscription plan
  useEffect(() => {
    setShowLogo(isFreePlan ? true : showLogo);
  }, [isFreePlan]);

  const getThemeClasses = (colorName: string) => {
    switch (colorName) {
      case 'indigo':
        return {
          gradient: 'from-indigo-500 to-purple-600',
          text: 'text-indigo-600',
          border: 'border-indigo-500',
          bg: 'bg-indigo-50/50',
          qrDark: '#4f46e5',
          neonGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)] border-indigo-500',
          neonText: 'text-indigo-400',
        };
      case 'emerald':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          text: 'text-emerald-600',
          border: 'border-emerald-500',
          bg: 'bg-emerald-50/50',
          qrDark: '#059669',
          neonGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-500',
          neonText: 'text-emerald-400',
        };
      case 'amber':
        return {
          gradient: 'from-amber-500 to-orange-600',
          text: 'text-amber-600',
          border: 'border-amber-500',
          bg: 'bg-amber-50/50',
          qrDark: '#d97706',
          neonGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)] border-amber-500',
          neonText: 'text-amber-400',
        };
      case 'rose':
        return {
          gradient: 'from-rose-500 to-pink-600',
          text: 'text-rose-600',
          border: 'border-rose-500',
          bg: 'bg-rose-50/50',
          qrDark: '#e11d48',
          neonGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)] border-rose-500',
          neonText: 'text-rose-400',
        };
      case 'violet':
        return {
          gradient: 'from-violet-500 to-fuchsia-600',
          text: 'text-violet-600',
          border: 'border-violet-500',
          bg: 'bg-violet-50/50',
          qrDark: '#7c3aed',
          neonGlow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)] border-violet-500',
          neonText: 'text-violet-400',
        };
      case 'teal':
        return {
          gradient: 'from-teal-500 to-emerald-600',
          text: 'text-teal-600',
          border: 'border-teal-500',
          bg: 'bg-teal-50/50',
          qrDark: '#0d9488',
          neonGlow: 'shadow-[0_0_20px_rgba(20,184,166,0.5)] border-teal-500',
          neonText: 'text-teal-400',
        };
      case 'slate':
        return {
          gradient: 'from-slate-500 to-slate-700',
          text: 'text-slate-600',
          border: 'border-slate-500',
          bg: 'bg-slate-50/50',
          qrDark: '#475569',
          neonGlow: 'shadow-[0_0_20px_rgba(100,116,139,0.5)] border-slate-500',
          neonText: 'text-slate-400',
        };
      default: // cyan
        return {
          gradient: 'from-cyan-500 to-blue-600',
          text: 'text-cyan-600',
          border: 'border-cyan-500',
          bg: 'bg-cyan-50/50',
          qrDark: '#0891b2',
          neonGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)] border-cyan-500',
          neonText: 'text-cyan-400',
        };
    }
  };

  const colors = getThemeClasses(cardColor);

  useEffect(() => {
    // Generate QR code with customized dark/light color based on template and theme
    let darkColor = colors.qrDark;
    let lightColor = '#ffffff';

    if (template === 'luxury') {
      darkColor = '#fbbf24'; // gold
      lightColor = '#0f172a'; // dark background for luxury
    } else if (template === 'neon') {
      darkColor = 
        cardColor === 'cyan' ? '#22d3ee' : 
        cardColor === 'indigo' ? '#818cf8' : 
        cardColor === 'emerald' ? '#34d399' : 
        cardColor === 'amber' ? '#fbbf24' : 
        cardColor === 'rose' ? '#fda4af' : 
        cardColor === 'violet' ? '#c084fc' : 
        cardColor === 'teal' ? '#2dd4bf' : 
        '#cbd5e1'; // slate
      lightColor = '#0f172a'; // dark background for neon
    } else if (template === 'retro') {
      darkColor = '#1c1917'; // warm charcoal
      lightColor = '#fdfaf2'; // cream/beige bg
    } else if (template === 'glass') {
      darkColor = '#0f172a'; // deep navy/dark slate
      lightColor = '#ffffff';
    }

    QRCode.toDataURL(guestUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err));
  }, [guestUrl, cardColor, template]);

  const handlePrint = () => {
    const printContent = printRef.current?.outerHTML;

    const printWindow = window.open('', '_blank', 'width=800,height=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Kartu Kamomi - ${roomNumber}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
              body { font-family: 'Outfit', sans-serif; }
              
              /* Force background colors and gradients to be printed */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              @media print {
                @page {
                  margin: 0; /* Hides default browser header and footer */
                }
                body { margin: 0; padding: 0; background: white; }
                .no-print { display: none; }
                
                /* Center the card on the page during print */
                body, html {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  width: 100vw;
                  overflow: hidden;
                }
                
                /* Set card to standard A6 physical size (105mm x 148mm) */
                /* The ratio is 1:1.4, identical to A4/A5/A6 papers, so it scales perfectly */
                .rounded-3xl {
                  width: 105mm !important;
                  height: 148mm !important;
                  box-shadow: none !important;
                  transform: none !important;
                  page-break-inside: avoid;
                }
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

  const renderCardInterior = () => {
    switch (template) {
      case 'minimal':
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-slate-900">
            {/* QR Code at the Top */}
            <div className="relative p-3 bg-slate-50 border border-slate-200/60 rounded-3xl mt-2">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-38 w-38" />
              ) : (
                <div className="h-38 w-38 flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Room number as a solid pill at the center */}
            <div className="text-center my-1 w-full">
              <div className="inline-block px-5 py-1.5 rounded-full bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
                {labelRoom} {roomNumber}
              </div>
            </div>

            {/* Footer and Property at the Bottom */}
            <div className="text-center w-full px-2">
              <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-slate-600 truncate max-w-60 mb-0.5">
                {customTitle}
              </h4>
              <p className="text-[10px] font-bold text-slate-400">
                {customInstruction}
              </p>
              {showLogo ? (
                <div className="flex items-center gap-1 justify-center opacity-70 mt-1">
                  <img src="/logo.png" alt="Logo" className="h-3.5 w-3.5 object-contain rounded-md" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">kamomi.id</span>
                </div>
              ) : (
                <p className="text-[7px] opacity-0 select-none">Spacer</p>
              )}
            </div>
          </div>
        );

      case 'retro':
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-[#1c1917] p-2 relative">
            {/* Double Border Inset */}
            <div className="absolute inset-1.5 border border-[#1c1917] pointer-events-none" />
            
            {/* Top Brand Info with decorative line underneath */}
            <div className="text-center mt-3 w-full">
              <span className="text-[12px] font-serif italic font-bold tracking-wider">
                {customTitle}
              </span>
              <div className="w-16 h-px bg-[#1c1917] mx-auto mt-1.5" />
            </div>

            {/* Center Room Number Badge inside a classic circle/oval */}
            {labelRoom || roomNumber ? (
              <div className="text-center my-1 flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-widest font-serif italic opacity-85">{labelRoom}</span>
                <div className="min-w-20 px-3 py-1 border border-[#1c1917] rounded-full text-3xl font-serif font-bold mt-1 bg-[#fdfaf2]">
                  {roomNumber}
                </div>
              </div>
            ) : (
              <div className="h-6" />
            )}

            {/* QR Code Container */}
            <div className="relative p-2 bg-[#fdfaf2] border border-[#1c1917] shadow-xs">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-32 w-32 object-contain" />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div className="text-center mb-1 w-full px-2">
              <div className="w-16 h-px bg-[#1c1917] mx-auto mb-1.5" />
              <p className="text-[10px] font-serif italic font-bold">
                {customInstruction}
              </p>
              {showLogo && (
                <div className="flex items-center gap-1 justify-center opacity-90 mt-1">
                  <span className="text-[8px] font-serif font-black tracking-widest border-t border-[#1c1917] pt-0.5">KAMOMI.ID</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'neon':
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-white">
            {/* Top Brand Info */}
            <div className="text-center mt-3 w-full">
              <span className={`text-[12px] font-black uppercase tracking-widest ${colors.neonText} drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]`}>
                {customTitle}
              </span>
            </div>

            {/* Center Room Number inside a glowing badge */}
            <div className="text-center my-1 w-full">
              <div className={`inline-block px-6 py-2 border rounded-2xl bg-slate-950/80 ${colors.neonGlow}`}>
                <div className="text-[8px] uppercase tracking-widest font-black opacity-70 mb-0.5">{labelRoom}</div>
                <div className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                  {roomNumber}
                </div>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="relative p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-32 w-32" />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div className="text-center mb-1 w-full px-2">
              <p className="text-[10px] font-black tracking-tight text-white/90">
                {customInstruction}
              </p>
              {showLogo ? (
                <div className="flex flex-col items-center justify-center mt-1">
                  <div className="flex items-center gap-1 justify-center opacity-85">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${colors.neonText}`}>kamomi.id</span>
                  </div>
                  <p className="text-[7px] tracking-wide font-medium text-slate-500">
                    Powered by kamomi.id
                  </p>
                </div>
              ) : (
                <p className="text-[7px] opacity-0 select-none">Spacer</p>
              )}
            </div>
          </div>
        );

      case 'glass':
        return (
          <div className="w-full h-full flex flex-col justify-between items-start text-slate-850 relative z-10">
            {/* Top Row: Asymmetrical Brand on left, Room Number in small badge on right */}
            <div className="flex justify-between items-center w-full mt-2">
              <div className="text-left max-w-[60%]">
                <span className={`text-[8px] font-black uppercase tracking-wider ${colors.text} block`}>PROPERTI</span>
                <span className="text-xs font-black truncate block text-slate-800">{customTitle}</span>
              </div>
              <div className="bg-white/80 border border-white/60 shadow-sm px-3.5 py-1 rounded-xl text-center shrink-0">
                <span className={`text-[7px] font-bold uppercase tracking-wider ${colors.text} block`}>{labelRoom}</span>
                <span className="text-lg font-black text-slate-900 block leading-tight">{roomNumber}</span>
              </div>
            </div>

            {/* Centered QR Code floating on glass card */}
            <div className="self-center my-2 p-2.5 bg-white/90 border border-white/80 shadow-lg rounded-2xl">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-34 w-34" />
              ) : (
                <div className="h-34 w-34 flex items-center justify-center text-slate-300"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Bottom Row: Call to action with modern asymmetric spacing */}
            <div className="w-full text-left pt-2 border-t border-slate-900/5">
              <p className="text-[10px] font-extrabold text-slate-800 tracking-tight leading-snug">
                {customInstruction}
              </p>
              {showLogo ? (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-80">
                  <img src="/logo.png" alt="Logo" className="h-3.5 w-3.5 object-contain rounded-md" />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${colors.text}`}>kamomi.id</span>
                  <span className="text-[7px] text-slate-400 font-medium">• Powered by Kamomi</span>
                </div>
              ) : (
                <p className="text-[7px] opacity-0 select-none">Spacer</p>
              )}
            </div>
          </div>
        );

      case 'luxury':
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-white">
            {/* Top Brand Info inside elegant gold frame */}
            <div className="text-center mt-3 w-full border-b border-amber-500/20 pb-2">
              <span className="text-[12px] font-black uppercase tracking-widest text-amber-400">
                {customTitle}
              </span>
            </div>

            {/* Center Room Number Badge */}
            {labelRoom || roomNumber ? (
              <div className="text-center my-1">
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-500/70">{labelRoom}</div>
                <div className="text-6xl font-black tracking-tighter mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                  {roomNumber}
                </div>
              </div>
            ) : (
              <div className="h-6" />
            )}

            {/* QR Code Container with gold border offset */}
            <div className="relative p-2.5 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-md">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-32 w-32" />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-slate-300"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div className="text-center mb-1 w-full px-2 border-t border-amber-500/10 pt-2">
              <p className="text-[11px] font-extrabold tracking-tight text-amber-300">
                {customInstruction}
              </p>
              {showLogo ? (
                <div className="flex flex-col items-center gap-0.5 justify-center mt-1">
                  <div className="flex items-center gap-1 justify-center opacity-85">
                    <img src="/logo.png" alt="Logo" className="h-3.5 w-3.5 object-contain rounded-md" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">kamomi.id</span>
                  </div>
                  <p className="text-[7px] tracking-wide font-medium text-slate-500">
                    Powered by kamomi.id
                  </p>
                </div>
              ) : (
                <p className="text-[7px] opacity-0 select-none">Spacer</p>
              )}
            </div>
          </div>
        );

      case 'modern':
      default:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-slate-900">
            {/* Top Brand Info */}
            <div className="text-center mt-3 w-full">
              <span className={`text-[12px] font-black uppercase tracking-widest ${colors.text}`}>
                {customTitle}
              </span>
            </div>

            {/* Center Room Number Badge */}
            {labelRoom || roomNumber ? (
              <div className="text-center my-2">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400">{labelRoom}</div>
                <div className="text-6xl font-black tracking-tighter mt-0.5 text-slate-900">
                  {roomNumber}
                </div>
              </div>
            ) : (
              <div className="h-6" />
            )}

            {/* QR Code Container */}
            <div className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="Room QR Code" className="h-36 w-36" />
              ) : (
                <div className="h-36 w-36 flex items-center justify-center text-slate-300"><RefreshCw className="h-6 w-6 animate-spin" /></div>
              )}
            </div>

            {/* Bottom Call to Action */}
            <div className="text-center mb-1 w-full px-2 mt-2">
              <p className="text-[11px] font-extrabold tracking-tight text-slate-800">
                {customInstruction}
              </p>
              {showLogo ? (
                <div className="flex flex-col items-center gap-0.5 justify-center mt-1">
                  <div className="flex items-center gap-1 justify-center opacity-85">
                    <img src="/logo.png" alt="Logo" className="h-3.5 w-3.5 object-contain rounded-md" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-cyan-600">kamomi.id</span>
                  </div>
                  <p className="text-[7px] tracking-wide font-medium text-slate-400">
                    Powered by kamomi.id
                  </p>
                </div>
              ) : (
                <p className="text-[7px] opacity-0 select-none">Spacer</p>
              )}
            </div>
          </div>
        );
    }
  };

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

        {/* Template Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layout className="h-4 w-4" />
            Pilih Gaya / Templat Kartu (6 Pilihan)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'modern', label: 'Modern' },
              { id: 'minimal', label: 'Minimalis' },
              { id: 'luxury', label: 'Luxury Dark' },
              { id: 'glass', label: 'Glassmorphic' },
              { id: 'neon', label: 'Cyber Neon' },
              { id: 'retro', label: 'Retro Vintage' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id as any)}
                className={`py-2 px-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  template === t.id
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/10'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Theme Selector (Disabled if Luxury or Retro) */}
        {template !== 'luxury' && template !== 'retro' && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Palette className="h-4 w-4" />
              Tema Warna Kartu
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'cyan', color: 'bg-cyan-500' },
                { id: 'indigo', color: 'bg-indigo-500' },
                { id: 'emerald', color: 'bg-emerald-500' },
                { id: 'amber', color: 'bg-amber-500' },
                { id: 'rose', color: 'bg-rose-500' },
                { id: 'violet', color: 'bg-violet-500' },
                { id: 'teal', color: 'bg-teal-500' },
                { id: 'slate', color: 'bg-slate-500' },
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
        )}

        {/* Text Customization Inputs */}
        <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Type className="h-4 w-4" />
            Sesuaikan Tulisan Kartu
          </label>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                Tagline Atas
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Contoh: KAMOMI GUESTBOOK"
                className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                Label Nomor Kamar
              </label>
              <input
                type="text"
                value={labelRoom}
                onChange={(e) => setLabelRoom(e.target.value)}
                placeholder="Contoh: NOMOR KAMAR atau MEJA"
                className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className='mt-2'>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">
                Petunjuk Aksi Bawah
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Contoh: Scan QR Code untuk info Wi-Fi & Fasilitas"
                className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Watermark Selector */}
        <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Watermark Kamomi.id
              </label>
              <p className="text-[10px] text-slate-400">
                {isFreePlan 
                  ? "Watermark wajib untuk paket FREE" 
                  : "Aktifkan/nonaktifkan branding Kamomi di kartu"}
              </p>
            </div>
            
            {isFreePlan ? (
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-800 select-none">
                Selalu Aktif (FREE)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogo(!showLogo)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showLogo ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showLogo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
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
          className={`rounded-3xl p-8 shadow-2xl border-4 w-75 h-105 flex flex-col justify-between items-center relative overflow-hidden transition-all duration-300 ${
            template === 'luxury'
              ? 'bg-slate-950 text-white border-amber-400'
              : template === 'minimal'
              ? 'bg-white text-slate-900 border-slate-100 shadow-lg'
              : template === 'glass'
              ? 'bg-gradient-to-br from-slate-100/80 via-slate-50/70 to-slate-100/80 border-white/70 shadow-2xl backdrop-blur-md text-slate-900'
              : template === 'neon'
              ? 'bg-slate-950 text-white ' + colors.neonGlow
              : template === 'retro'
              ? 'bg-[#fdfaf2] text-[#1c1917] border-4 border-double border-[#1c1917]'
              : 'bg-white text-slate-900 border-slate-900'
          }`}
        >
          {/* Glassmorphic inner background overlay for glass preview */}
          {template === 'glass' && (
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-20 -z-10`} />
          )}

          {/* Theme Stripes / Headers based on templates */}
          {template === 'modern' && (
            <div
              className={`absolute top-0 left-0 w-full h-4 bg-gradient-to-r ${colors.gradient}`}
            />
          )}

          {template === 'luxury' && (
            <div
              className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"
            />
          )}

          {template === 'neon' && (
            <div
              className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${colors.gradient}`}
            />
          )}

          {renderCardInterior()}
        </div>
      </div>
    </div>
  );
}
