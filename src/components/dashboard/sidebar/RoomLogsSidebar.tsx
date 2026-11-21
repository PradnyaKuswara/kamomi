import React from 'react';
import { Badge, Button, Drawer, Spinner } from '@pradnyakuswara/ui';
import { User, Clock, Info } from 'lucide-react';
import { useRoomLogsByRoomQuery } from '../../../rest/useRoom';
import type { RoomLog } from '../../../types/room';

interface RoomLogsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  roomId: number | null;
  roomNumber: string | null;
}

export default function RoomLogsSidebar({ isOpen, onClose, propertyId, roomId, roomNumber }: RoomLogsSidebarProps) {
  const { data: response, isLoading, isError, refetch } = useRoomLogsByRoomQuery(
    propertyId,
    roomId || undefined,
    isOpen && roomId !== null
  );
  const logs = response?.data || [];

  const getLogMessage = (log: RoomLog) => {
    if (log.action === 'CREATE') {
      let wifi = '';
      try {
        if (log.newData) {
          const parsed = JSON.parse(log.newData);
          wifi = parsed.wifiSsid ? ` dengan Wi-Fi "${parsed.wifiSsid}"` : '';
        }
      } catch (e) { }
      return `Membuat kamar baru${wifi}`;
    }
    if (log.action === 'DELETE') {
      return 'Menghapus kamar';
    }
    if (log.action === 'UPDATE') {
      try {
        if (log.oldData && log.newData) {
          const oldP = JSON.parse(log.oldData);
          const newP = JSON.parse(log.newData);
          const changes: string[] = [];

          if (oldP.roomNumber !== newP.roomNumber) {
            changes.push(`Nomor Kamar "${oldP.roomNumber}" → "${newP.roomNumber}"`);
          }
          if (oldP.wifiSsid !== newP.wifiSsid) {
            changes.push(`SSID Wi-Fi "${oldP.wifiSsid || 'Kosong'}" → "${newP.wifiSsid || 'Kosong'}"`);
          }
          if (oldP.wifiPassword !== newP.wifiPassword) {
            changes.push(`Password Wi-Fi diperbarui`);
          }
          if (oldP.isActive !== newP.isActive) {
            changes.push(`Status ${oldP.isActive !== false ? 'Aktif' : 'Nonaktif'} → ${newP.isActive !== false ? 'Aktif' : 'Nonaktif'}`);
          }

          // Check rule changes
          if (JSON.stringify(oldP.ruleIds) !== JSON.stringify(newP.ruleIds)) {
            const oldRules = oldP.ruleNames || [];
            const newRules = newP.ruleNames || [];
            changes.push(`Tata Tertib: [${oldRules.join(', ') || 'Kosong'}] → [${newRules.join(', ') || 'Kosong'}]`);
          }

          // Check QR design changes
          if (oldP.qrDesign && newP.qrDesign) {
            const oldQr = oldP.qrDesign;
            const newQr = newP.qrDesign;
            const qrChanges: string[] = [];
            if (oldQr.customTitle !== newQr.customTitle) {
              qrChanges.push(`Judul "${oldQr.customTitle || ''}" → "${newQr.customTitle || ''}"`);
            }
            if (oldQr.customInstruction !== newQr.customInstruction) {
              qrChanges.push(`Instruksi "${oldQr.customInstruction || ''}" → "${newQr.customInstruction || ''}"`);
            }
            if (oldQr.cardColor !== newQr.cardColor) {
              qrChanges.push(`Warna "${oldQr.cardColor || ''}" → "${newQr.cardColor || ''}"`);
            }
            if (oldQr.template !== newQr.template) {
              qrChanges.push(`Template "${oldQr.template || ''}" → "${newQr.template || ''}"`);
            }
            if (oldQr.labelRoom !== newQr.labelRoom) {
              qrChanges.push(`Label "${oldQr.labelRoom || ''}" → "${newQr.labelRoom || ''}"`);
            }
            if (oldQr.showLogo !== newQr.showLogo) {
              qrChanges.push(`Logo: ${oldQr.showLogo ? 'Tampil' : 'Sembunyi'} → ${newQr.showLogo ? 'Tampil' : 'Sembunyi'}`);
            }
            if (qrChanges.length > 0) {
              changes.push(`Desain QR (${qrChanges.join(', ')})`);
            }
          } else if (!oldP.qrDesign && newP.qrDesign) {
            changes.push('Menambahkan desain QR kustom');
          }

          if (changes.length > 0) {
            return changes.join(', ');
          }
        }
      } catch (e) { }
      return 'Memperbarui data kamar';
    }
    return `Melakukan aksi ${log.action}`;
  };

  const formatLogDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getActionVariant = (action: string): 'success' | 'primary' | 'danger' | 'default' => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'primary';
      case 'DELETE':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      side="right"
      size="md"
      title={`Log Kamar ${roomNumber || ''}`}
      description="Histori perubahan data kamar ini"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-3">
            <Spinner size="lg" />
            <span className="text-xs text-[var(--text-muted)]">Memuat log aktivitas...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
            <Info className="h-8 w-8 text-[var(--color-danger)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Gagal memuat log</p>
            <Button size="sm" onClick={() => refetch()}>Coba Lagi</Button>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
            <Info className="h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Belum ada riwayat aktivitas kamar.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[var(--text-muted)]">
                  KAMAR {log.roomNumber || '—'}
                </span>
                <Badge variant={getActionVariant(log.action)} size="sm">{log.action}</Badge>
              </div>

              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{getLogMessage(log)}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-32.5 font-semibold" title={log.createdByEmail}>
                    {log.createdByName || log.createdByEmail || 'Sistem'}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{formatLogDate(log.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}
