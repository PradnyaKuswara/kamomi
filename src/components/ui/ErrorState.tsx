import React from 'react';
import { Alert } from '@pradnyakuswara/ui';

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
    <div className={`flex items-center justify-center ${minHeight} p-6`}>
      <Alert variant="danger" title={title} className="max-w-md">
        {message}
      </Alert>
    </div>
  );
}
