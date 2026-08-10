import { useEffect } from 'react';
import { queryClient } from './queryClient';
import { toast } from '../hooks/useToast';

const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080';

export function useNotificationSse() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) return;

    const sseUrl = `${BASE_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('NOTIFICATION', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        const title = data.title || 'Notifikasi Baru';
        const message = data.message ? `\n${data.message}` : '';
        toast.info(`🔔 ${title}${message}`, 6000);

        queryClient.invalidateQueries({ queryKey: ['complaints'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({
          queryKey: ['unreadNotificationCount'],
        });
      } catch (err) {
        console.error('Gagal parsing data notifikasi SSE:', err);
      }
    });

    eventSource.onerror = () => {
      // EventSource auto-reconnects automatically
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
