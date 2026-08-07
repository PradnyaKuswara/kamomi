import React from "react";
import { ShieldAlert, LogOut } from "lucide-react";

interface AccessBlockedScreenProps {
  handleLogout: () => void;
}

export default function AccessBlockedScreen({ handleLogout }: AccessBlockedScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-rose-500" />
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            Akses Belum Aktif
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Akun Anda belum terhubung ke properti manapun. Harap hubungi Admin
            atau Pengelola properti Anda untuk mendaftarkan email Anda ke
            hunian dan kamar yang sesuai.
          </p>
        </div>
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar Akun
          </button>
        </div>
      </div>
    </div>
  );
}
