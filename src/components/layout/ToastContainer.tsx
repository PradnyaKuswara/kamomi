import { motion, AnimatePresence } from 'framer-motion';
import { useToasts, toastStore } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useToasts();

  return (
    <div className="fixed top-4 sm:top-5 left-3 right-3 sm:left-auto sm:right-5 z-9999 flex flex-col gap-2.5 sm:gap-3.5 w-auto sm:w-full sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`pointer-events-auto relative flex items-start gap-3 p-3.5 sm:pl-4 sm:pr-5 sm:py-4 rounded-2xl border backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 bg-white/95 dark:bg-slate-900/95 ${t.type === 'success'
              ? 'border-emerald-500/25 border-l-4 border-l-emerald-500 shadow-emerald-500/5'
              : t.type === 'error'
                ? 'border-rose-500/25 border-l-4 border-l-rose-500 shadow-rose-500/5'
                : t.type === 'warning'
                  ? 'border-amber-500/25 border-l-4 border-l-amber-500 shadow-amber-500/5'
                  : 'border-cyan-500/25 border-l-4 border-l-cyan-500 shadow-cyan-500/5'
              }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-cyan-500" />}
            </div>

            {/* Content text */}
            <div className="flex-1 flex flex-col gap-0.5 min-w-0 pr-1 sm:pr-2">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase opacity-50 text-slate-500 dark:text-slate-400">
                {t.type === 'success' && 'Berhasil'}
                {t.type === 'error' && 'Gagal'}
                {t.type === 'warning' && 'Peringatan'}
                {t.type === 'info' && 'Informasi'}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100 whitespace-pre-line wrap-break-word">
                {t.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => toastStore.remove(t.id)}
              className="shrink-0 p-1 -mr-2 rounded-xl text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Countdown Progress Bar */}
            {t.duration && t.duration > 0 ? (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: t.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${t.type === 'success'
                  ? 'bg-emerald-500'
                  : t.type === 'error'
                    ? 'bg-rose-500'
                    : t.type === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
              />
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
