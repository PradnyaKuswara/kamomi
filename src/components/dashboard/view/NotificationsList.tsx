import { useState } from 'react';
import { Button, FilterChip, Input } from '@pradnyakuswara/ui';
import { Bell, Search, Trash2, QrCode, AlertTriangle, Info, Clock, Check, RefreshCw } from 'lucide-react';
import {
  useNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from '../../../rest/useNotification';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../rest/queryClient';

import { NOTIFICATION_TYPES, type NotificationType } from '../../../types/notification';

export default function NotificationsList() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsListContent />
    </QueryClientProvider>
  );
}

function NotificationsListContent() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<'ALL' | NotificationType>('ALL');
  const [search, setSearch] = useState('');

  const { data: response, isLoading } = useNotificationsQuery(page, 20);
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();

  const notifications = response?.data?.content || [];

  const filtered = notifications.filter((n) => {
    const matchesFilter = filter === 'ALL' || n.type === filter;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.NEW_COMPLAINT:
      case NOTIFICATION_TYPES.COMPLAINT_UPDATED:
        return <AlertTriangle className="h-4 w-4 text-[var(--color-danger)]" />;
      case NOTIFICATION_TYPES.QR_ACTIVITY:
        return <QrCode className="h-4 w-4 text-[var(--color-success-text)]" />;
      case NOTIFICATION_TYPES.RULE_VIOLATION:
        return <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />;
      case NOTIFICATION_TYPES.SUBSCRIPTION:
        return <Info className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-[var(--primary-accent)]" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.NEW_COMPLAINT:
      case NOTIFICATION_TYPES.COMPLAINT_UPDATED:
        return 'bg-rose-50 text-[var(--color-danger)] dark:bg-rose-950/20  border-rose-500/10';
      case NOTIFICATION_TYPES.QR_ACTIVITY:
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20  border-emerald-500/10';
      case NOTIFICATION_TYPES.RULE_VIOLATION:
        return 'bg-amber-50 text-[var(--color-warning)] dark:bg-amber-950/20 dark:text-amber-400 border-amber-500/10';
      case NOTIFICATION_TYPES.SUBSCRIPTION:
        return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-500/10';
      default:
        return 'bg-cyan-50 text-[var(--primary-accent)] dark:bg-cyan-950/20  border-[var(--color-primary)]/10';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="h-6 w-6 text-[var(--primary-accent)]" />
            Aktivitas Notifikasi
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Pantau semua keluhan penghuni dan informasi sistem terbaru secara real-time.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            isLoading={markAllAsReadMutation.isPending}
            leftIcon={<Check className="h-3.5 w-3.5" />}
          >
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[var(--bg-surface)] p-3 rounded-2xl border border-[var(--border-color)] shadow-xs">
        <div className="relative flex-1">
          <Input size="sm" leftIcon={<Search className="h-4 w-4" />} placeholder="Cari notifikasi..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'ALL', label: 'Semua' },
            { key: NOTIFICATION_TYPES.NEW_COMPLAINT, label: 'Keluhan' },
            { key: NOTIFICATION_TYPES.QR_ACTIVITY, label: 'Aktivitas QR' },
            { key: NOTIFICATION_TYPES.RULE_VIOLATION, label: 'Tata Tertib' },
            { key: NOTIFICATION_TYPES.SUBSCRIPTION, label: 'Langganan' },
            { key: NOTIFICATION_TYPES.SYSTEM, label: 'Sistem' },
          ].map((btn) => (
            <FilterChip
              key={btn.key}
              label={btn.label}
              size="sm"
              active={filter === btn.key}
              onChange={() => setFilter(btn.key as any)}
            />
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-8 w-8 text-[var(--primary-accent)] animate-spin" />
            <p className="text-xs text-[var(--text-muted)]">Memuat riwayat notifikasi...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Bell className="h-10 w-10 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-[var(--text-primary)]">Tidak ada notifikasi ditemukan</p>
            <p className="text-xs text-[var(--text-muted)] max-w-xs">Silakan ganti kata kunci pencarian Anda atau pilih filter kategori yang lain.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) markAsReadMutation.mutate(n.id);
              }}
              className={`p-3.5 sm:p-4 bg-[var(--bg-surface)] border rounded-2xl flex gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md hover:border-slate-300/40 dark:hover:border-slate-800/80 cursor-pointer ${n.isRead
                  ? 'border-[var(--border-color)] opacity-80'
                  : 'border-[var(--color-primary)]/20 '
                }`}
            >
              <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center border shrink-0 ${getBadgeColor(n.type)}`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-xs sm:text-sm tracking-tight wrap-break-word font-extrabold ${n.isRead ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium wrap-break-word">
                  {n.message}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold pt-1 font-sans">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{formatDate(n.createdAt)}</span>
                </div>
              </div>

              <Button variant="secondary" size="sm" aria-label="Hapus"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(n.id);
                }}
                title="Hapus" leftIcon={<Trash2 className="h-4 w-4" />} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
