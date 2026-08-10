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
  Tag,
  Smartphone,
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

    // Close dropdown on click outside
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

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Kamomi Logo"
                className="h-9 w-9 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-400">
                Kamomi
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">
                  .id
                </span>
              </span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
            >
              Beranda
            </a>
            
            {/* Product Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors focus:outline-hidden cursor-pointer"
              >
                Produk
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-cyan-500' : ''}`} />
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-3 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 origin-top-left"
                  >
                    <a
                      href="/features"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-all">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          Fitur Utama
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Eksplorasi layanan terbaik kami
                        </div>
                      </div>
                    </a>
                    <a
                      href="/guest"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-all">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          Demo Tampilan Tamu
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Lihat simulasi web portal hunian
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/pricing"
              className="text-sm font-medium text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
            >
              Harga
            </a>

            <a
              href="/blog"
              className="text-sm font-medium text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400 transition-colors"
            >
              Blog
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-cyan-400" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>

            {isLoading ? (
              <div className="h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 text-white hover:opacity-90 shadow-md shadow-cyan-500/10 transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Masuk
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:opacity-90 transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Daftar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
