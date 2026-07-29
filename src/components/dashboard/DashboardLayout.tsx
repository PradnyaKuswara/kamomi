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
  QrCode,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCheckMeMutation, useLogoutMutation } from '../../rest/useCheckMe';
import ToastContainer from '../ToastContainer';
import PropertyWizardModal from './PropertyWizardModal';

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
  const { user, subscriptionInfo, setUserData, clearUserData } = useUserData();
  const ownerName = user.name || 'System';
  const ownerEmail = user.email || 'system@gmail.com';
  const [activeNotification, setActiveNotification] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { mutateAsync: checkMe } = useCheckMeMutation();
  const { mutateAsync: logout } = useLogoutMutation();

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('AUTH_TOKEN');
      if (!token) {
        clearUserData();
        localStorage.removeItem('user_logged_in');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await checkMe();
        if (res.success && res.data) {
          const userProperties = res.data.properties || [];
          setUserData({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            avatarUrl: res.data.avatarUrl,
            roleName: res.data.roleName,
            isEmailVerified: res.data.isEmailVerified ?? false,
            isActive: res.data.isActive ?? true,
            subscription: res.data.subscription,
            properties: userProperties,
            isLoggedIn: true
          });

          const hasProperty = userProperties.length > 0;
          if (hasProperty) {
            setShowPropertyModal(false);
          } else {
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
        window.location.href = '/login';
      }
    }

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearUserData();
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('user_logged_in');
      window.location.href = '/login';
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="relative mb-4 flex items-center justify-center">
          {/* Efek radar luar */}
          <div className="absolute h-16 w-16 rounded-2xl bg-cyan-500/20 animate-ping"></div>
          
          {/* Logo Vektor SVG Kamomi (Langsung ter-render instan) */}
          <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg relative z-10 animate-bounce">
            <img 
              src="/logo.png" 
              alt="Kamomi Logo" 
              className="h-12 w-12 object-contain" 
            />
          </div>
        </div>
        <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 tracking-widest uppercase animate-pulse">Menghubungkan ke Hunian Anda...</p>
      </div>
    );
  }

  const currentPlanName = subscriptionInfo.planName;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      
      {!subscriptionInfo.isActive && subscriptionInfo.planName !== 'Free' ? (
        <div className="bg-amber-600 px-4 py-2.5 text-center text-xs font-bold text-white relative flex items-center justify-center gap-2 shadow-sm">
          <span>⚠️ Masa aktif langganan **Paket {subscriptionInfo.planName}** Anda telah berakhir {subscriptionInfo.endDate ? `pada ${new Date(subscriptionInfo.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}. Layanan diturunkan ke paket Free sementara.</span>
          <a href="/pricing" className="inline-flex items-center gap-1 bg-white text-amber-900 hover:bg-slate-50 px-3 py-1 rounded-lg transition-all ml-3 font-extrabold text-[11px] shadow-sm">
            Perpanjang Sekarang →
          </a>
        </div>
      ) : (
        currentPlanName === 'Free' && (
          <div className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-700 px-4 py-2.5 text-center text-xs font-bold text-white relative flex items-center justify-center gap-2 shadow-sm">
            <span>🚀 Anda saat ini menggunakan <strong>Paket Free</strong>. Upgrade ke <strong>Starter</strong> atau <strong>Pro</strong> untuk buka fitur kustomisasi QR, WhatsApp notification & kuota kamar lebih besar!</span>
            <a href="/pricing" className="hidden md:inline-flex items-center gap-1 bg-white text-cyan-800 hover:bg-cyan-50 px-3 py-1 rounded-lg transition-all ml-3 font-extrabold text-[11px] shadow-sm">
              Upgrade Sekarang →
            </a>
          </div>
        )
      )}

      <div className="flex-1 flex flex-col md:flex-row  w-full mx-auto">
        
        <aside className={`relative transition-all duration-300 border-r border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 flex flex-col justify-between shrink-0 ${
          isCollapsed ? 'w-full md:w-20' : 'w-full md:w-64'
        }`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3.5 top-7 z-30 h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-cyan-500 shadow-md transition-all cursor-pointer"
            title={isCollapsed ? 'Perlebar Sidebar' : 'Kecilkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className="space-y-6">
            
            {/* Brand Logo */}
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <img 
                src="/logo.png" 
                alt="Kamomi Logo" 
                className="h-9 w-9 object-contain rounded-xl shadow-md shrink-0"
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="text-lg font-black tracking-tight text-cyan-600 dark:text-cyan-400 block truncate">
                    Kamomi<span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">.id</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block truncate">
                    Guestbook Manager
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className={`p-2.5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all ${
              isCollapsed ? 'flex justify-center' : 'space-y-2'
            }`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0" title={ownerName}>
                  {ownerName.charAt(0)}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{ownerName}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{ownerEmail}</p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">Paket Aktif:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                    {currentPlanName}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Menus */}
            <nav className="space-y-1.5">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                { id: 'rooms', label: 'Daftar Kamar & QR', icon: DoorClosed, href: '/dashboard/rooms' },
                { id: 'rules', label: 'Tata Tertib (Rules)', icon: FileText, href: '/dashboard/rules' },
                { id: 'complaints', label: 'Laporan Keluhan', icon: AlertTriangle, href: '/dashboard/complaints' },
                { id: 'settings', label: 'Pengaturan Akun', icon: Settings, href: '/dashboard/settings' },
                { id: 'faq', label: 'Bantuan & FAQ', icon: HelpCircle, href: '/dashboard/faq' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/15'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            title={isCollapsed ? 'Keluar Akun' : undefined}
            className={`flex items-center gap-3 px-3.5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 rounded-xl transition-all w-full mt-6 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </button>
        </aside>

        {/* MAIN CENTER CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {children}
        </main>

        {/* RIGHT SIDEBAR - NOTIFICATIONS & TIPS */}
        {activeMenu === 'dashboard' && (
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
        )}
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
        <PropertyWizardModal
          onComplete={() => {
            setShowPropertyModal(false);
          }}
        />
      )}
      
    </div>
  );
}
