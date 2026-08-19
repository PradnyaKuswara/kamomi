import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Smartphone,
  Play,
  Menu,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCheckMeMutation, useLogoutMutation } from '../../rest/useCheckMe';
import ToastContainer from './ToastContainer';
import { useTheme } from '../../hooks/useTheme';

const queryClient = new QueryClient();

export default function Navbar() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavbarContent />
      <ToastContainer />
    </QueryClientProvider>
  );
}

function NavbarContent() {
  const { darkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const checkMeMutation = useCheckMeMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('AUTH_TOKEN');
      if (!token) {
        setIsLoggedIn(false);
        localStorage.removeItem('user_logged_in');
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(localStorage.getItem('user_logged_in') === 'true');

      try {
        const res = await checkMeMutation.mutateAsync();
        if (res.success && res.data) {
          setIsLoggedIn(true);
          localStorage.setItem('user_logged_in', 'true');
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('AUTH_TOKEN');
          localStorage.removeItem('user_logged_in');
        }
      } catch (err) {
        setIsLoggedIn(false);
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('user_logged_in');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Make Navbar immediately visible on pages without splash screen (e.g. /guest)
    const splashEl = document.getElementById('splash-screen');
    const navEl = document.getElementById('main-navbar');
    if (!splashEl && navEl) {
      navEl.classList.remove('opacity-0', '-translate-y-6');
      navEl.classList.add('opacity-100', 'translate-y-0');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('user_logged_in');
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  const isHomePage = typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '');

  return (
    <nav
      id="main-navbar"
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-6xl z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl transition-all duration-500 ${isHomePage ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
        }`}
    >
      <div className="px-4 sm:px-7">
        <div className="flex items-center justify-between h-14 sm:h-15">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Kamomi Logo"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Kamomi
                <span className="text-emerald-500 ml-0.5">.id</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 font-bold text-xs uppercase tracking-wider">
            <a
              href="/"
              className="text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Beranda
            </a>

            {/* Product Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:outline-hidden cursor-pointer"
              >
                PRODUK
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-0 mt-3 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl p-3 z-50"
                  >
                    <a
                      href="/features"
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-all">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold normal-case text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          Fitur Utama
                        </div>
                        <div className="text-[10px] normal-case text-slate-400 mt-0.5">
                          Eksplorasi layanan terbaik kami
                        </div>
                      </div>
                    </a>
                    {/* <a
                      href="/features#dashboard-showcase"
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-all">
                        <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold normal-case text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors flex items-center gap-1.5">
                          Pengelolaan Dashboard
                          <span className="px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 text-[9px] font-extrabold">Baru</span>
                        </div>
                        <div className="text-[10px] normal-case text-slate-400 mt-0.5">
                          Simulasi & panduan sistem pengelola
                        </div>
                      </div>
                    </a> */}
                    <a
                      href="/guest"
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-all">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold normal-case text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                          Demo Tamu
                        </div>
                        <div className="text-[10px] normal-case text-slate-400 mt-0.5">
                          Simulasi web portal hunian
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/pricing"
              className="text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Harga
            </a>

            <a
              href="/blog"
              className="text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              Blog
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-emerald-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {isLoading ? (
              <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Dashboard</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href="/guest"
                  className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all"
                >
                  <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                  <span>Demo</span>
                </a>
                <a
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Masuk
                </a>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-b-2xl px-5 py-4 space-y-3"
          >
            <a
              href="/"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </a>
            <a
              href="/features"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fitur Utama
            </a>
            <a
              href="/features#dashboard-showcase"
              className="flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Pengelolaan Dashboard</span>
              <span className="px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 text-[9px] font-extrabold lowercase">baru</span>
            </a>
            <a
              href="/guest"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo Tamu
            </a>
            <a
              href="/pricing"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Harga
            </a>
            <a
              href="/blog"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </a>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <a
                href="/login"
                className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </a>
              <a
                href="/register"
                className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

