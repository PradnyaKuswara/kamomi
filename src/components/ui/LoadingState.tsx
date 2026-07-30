import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  minHeight?: string;
}

export default function LoadingState({
  message = 'Memuat data...',
  minHeight = 'min-h-[300px]'
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} space-y-3`}>
      <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{message}</p>
    </div>
  );
}
