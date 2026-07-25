import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DoorClosed, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  LogOut, 
  Bell, 
  MessageSquare,
  QrCode
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCheckMeMutation, useLogoutMutation } from '../../rest/useCheckMe';
import ToastContainer from '../ToastContainer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
}

const queryClient = new QueryClient();

export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayoutContent {...props} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

function DashboardLayoutContent({ children, activeMenu }: DashboardLayoutProps) {
  const { user, setUserData, clearUserData } = useUserData();
  const ownerName = user.name || 'System';
  const ownerEmail = user.email || 'system@gmail.com';
  const [propertyName, setPropertyName] = useState('');
  const [activeNotification, setActiveNotification] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyInput, setPropertyInput] = useState('');

  const { mutateAsync: checkMe } = useCheckMeMutation();
  const { mutateAsync: logout } = useLogoutMutation();

  useEffect(() => {
    const initUser = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('AUTH_TOKEN');
      if (!token) {
        localStorage.removeItem('user_logged_in');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await checkMe();
        if (res.success && res.data) {
          setUserData({
            name: res.data.name,
            email: res.data.email,
            isLoggedIn: true
          });
          const storedProperty = localStorage.getItem('property_name');
          if (storedProperty) {
            setPropertyName(storedProperty);
            setShowPropertyModal(false);
          } else {
            setPropertyName('');
            setShowPropertyModal(true);
          }
          setIsVerifying(false);
        } else {
          throw new Error('Invalid session');
        }
      } catch {
        clearUserData();
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('user_logged_in');
        window.location.href = '/login?error=session_expired';
      }
    };

    initUser();
  }, []);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearUserData();
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('user_logged_in');
        window.location.href = '/';
      }
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Memeriksa autentikasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Banner Alert */}
      <div className="bg-orange-600 px-4 py-2.5 text-center text-xs font-bold text-white relative flex items-center justify-center gap-2">
        <span>💡 Tips Cetak: Gunakan kertas stiker tebal (Art Paper 260gsm) ukuran A6 untuk kualitas stiker pintu terbaik!</span>
        <a href="/dashboard/faq" className="hidden md:inline-block bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-all ml-4 text-white hover:text-white">
          Pelajari Selengkapnya
        </a>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full md:w-64 border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Kamomi Logo" 
                className="h-9 w-9 object-contain rounded-xl shadow-md"
              />
              <div>
                <span className="text-lg font-black tracking-tight text-cyan-600 dark:text-cyan-400 block">
                  Kamomi<span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">.id</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
                  Guestbook Manager
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {ownerName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{ownerName}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{ownerEmail}</p>
              </div>
            </div>

            {/* Menus */}
            <nav className="space-y-1">
              <a 
                href="/dashboard"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'dashboard'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>

              <a 
                href="/dashboard/rooms"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'rooms'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <DoorClosed className="h-4 w-4" />
                Daftar Kamar & QR
              </a>

              <a 
                href="/dashboard/rules"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'rules'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" />
                Tata Tertib (Rules)
              </a>

              <a 
                href="/dashboard/complaints"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'complaints'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                Laporan Keluhan
              </a>

              <a 
                href="/dashboard/faq"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === 'faq'
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                Bantuan & FAQ
              </a>
            </nav>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl transition-all w-full mt-6"
          >
            <LogOut className="h-4 w-4" />
            Keluar Akun
          </button>
        </aside>

        {/* MAIN CENTER CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {children}
        </main>

        {/* RIGHT SIDEBAR - NOTIFICATIONS & TIPS */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 space-y-6 shrink-0">
          
          {/* Smart Recommendation Card */}
          <div className="p-5 rounded-2xl bg-cyan-600 text-white shadow-lg space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <QrCode className="h-16 w-16" />
            </div>
            
            <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block">
              Rekomendasi Pintar
            </span>
            <div className="space-y-1.5 relative">
              <h4 className="font-extrabold text-sm">Cetak Tag Akrilik Pintu</h4>
              <p className="text-[11px] text-cyan-50/80 leading-relaxed">
                Pasang dudukan akrilik A6 di pintu kamar agar terlihat mewah dan profesional seperti hotel berbintang.
              </p>
            </div>
            <a 
              href="/dashboard/faq"
              className="w-full py-2 bg-white text-cyan-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all text-center block"
            >
              Lihat Panduan Cetak
            </a>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-cyan-500" />
                Notifikasi Terbaru
              </h4>
              {activeNotification && (
                <span className="h-2 w-2 rounded-full bg-rose-500" />
              )}
            </div>

            <div className="space-y-3">
              {activeNotification && (
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl space-y-1 relative">
                  <button 
                    onClick={() => setActiveNotification(false)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                  >
                    ×
                  </button>
                  <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block uppercase">
                    Keluhan Baru
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                    Kamar 102 melaporkan keluhan: "AC Tidak Dingin"
                  </p>
                  <span className="text-[9px] text-slate-400 block">2 jam yang lalu</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  Aktivitas QR
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Scan QR terdeteksi di <strong>Kamar 101</strong> oleh tamu baru.
                </p>
                <span className="text-[9px] text-slate-400 block">Kemarin</span>
              </div>
            </div>
            
            <a 
              href="/dashboard/complaints"
              className="w-full text-center text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline py-1 block"
            >
              Lihat Semua Notifikasi
            </a>
          </div>

        </aside>
      </div>

      {/* Floating WhatsApp Button for Support */}
      <a 
        href="https://wa.me/6281234567890?text=Halo%20Kamomi%2C%20saya%20butuh%20bantuan%20setup%20kost" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:scale-105 transition-all z-50 flex items-center justify-center"
        title="Hubungi Bantuan WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>

      {showPropertyModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden text-center">
            {/* Decorative blurs */}
            <div className="absolute -top-12 -left-12 h-24 w-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <h3 className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-2">
              Setup Nama Properti Anda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Sebelum melanjutkan ke dashboard, harap isi nama properti/hunian Anda (kost, homestay, atau kontrakan) terlebih dahulu.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!propertyInput.trim()) return;
                localStorage.setItem('property_name', propertyInput.trim());
                setPropertyName(propertyInput.trim());
                setShowPropertyModal(false);
              }}
              className="space-y-4"
            >
              <div className="text-left space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Nama Properti / Hunian
                </label>
                <input
                  type="text"
                  required
                  value={propertyInput}
                  onChange={(e) => setPropertyInput(e.target.value)}
                  placeholder="Contoh: Kost Adem Tentrem"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                Simpan & Lanjutkan
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
