import { useEffect } from 'react';
import { ToastProvider, useToast as useUiToast } from '@pradnyakuswara/ui';
import { useToasts, toastStore, type ToastMessage } from '../../hooks/useToast';

const VARIANT: Record<ToastMessage['type'], 'default' | 'success' | 'warning' | 'danger'> = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'default',
};

const TITLE: Record<ToastMessage['type'], string> = {
  success: 'Berhasil',
  error: 'Gagal',
  warning: 'Peringatan',
  info: 'Informasi',
};

/**
 * Jembatan: `toast.success(...)` dst. (src/hooks/useToast.ts) tetap menjadi API imperatif,
 * sedangkan tampilannya dirender oleh ToastProvider dari @pradnyakuswara/ui.
 */
function ToastBridge() {
  const { toast } = useUiToast();
  const pending = useToasts();

  useEffect(() => {
    pending.forEach((t) => {
      toast({
        title: TITLE[t.type],
        description: t.message,
        variant: VARIANT[t.type],
        duration: t.duration,
      });
      toastStore.remove(t.id);
    });
  }, [pending, toast]);

  return null;
}

export default function ToastContainer() {
  return (
    <ToastProvider position="top-right">
      <ToastBridge />
    </ToastProvider>
  );
}
