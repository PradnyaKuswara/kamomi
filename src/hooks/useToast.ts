import { useSyncExternalStore } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

let toasts: ToastMessage[] = [];
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((l) => l());
};

export const toastStore = {
  getSnapshot() {
    return toasts;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  add(message: string, type: ToastMessage['type'] = 'info', duration = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type, duration };
    toasts = [...toasts, newToast];
    emit();

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }
};

export const toast = {
  success(message: string, duration?: number) {
    toastStore.add(message, 'success', duration);
  },
  error(message: string, duration?: number) {
    toastStore.add(message, 'error', duration);
  },
  info(message: string, duration?: number) {
    toastStore.add(message, 'info', duration);
  },
  warning(message: string, duration?: number) {
    toastStore.add(message, 'warning', duration);
  }
};

const emptyToasts: ToastMessage[] = [];
const getServerSnapshot = () => emptyToasts;

export function useToasts() {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    getServerSnapshot
  );
}
