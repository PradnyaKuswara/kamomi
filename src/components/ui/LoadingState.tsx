import React from 'react';
import { Spinner } from '@pradnyakuswara/ui';

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
      <Spinner size="lg" />
      <p className="text-xs text-[var(--text-muted)] font-medium">{message}</p>
    </div>
  );
}
