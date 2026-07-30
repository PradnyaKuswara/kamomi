import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  minHeight?: string;
}

export default function ErrorState({
  title = 'Gagal memuat data.',
  message = 'Coba refresh halaman atau periksa koneksi internet Anda.',
  minHeight = 'min-h-[300px]'
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} text-center space-y-2.5 p-6`}>
      <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <p className="text-sm font-extrabold text-rose-500 dark:text-rose-400">{title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}
