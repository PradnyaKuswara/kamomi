import React from 'react';
import { X, History, User, Clock, Info } from 'lucide-react';
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

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-500/10';
      case 'UPDATE':
        return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-500/10';
      case 'DELETE':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-500/10';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border-slate-500/10';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 dark:bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white/95 dark:bg-slate-900/95 border-l border-slate-250/50 dark:border-slate-800/60 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                <History className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Log Kamar {roomNumber || ''}</h3>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Histori perubahan data kamar ini</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Logs List Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-3">
                <div className="h-8 w-8 border-4 border-cyan-550 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Memuat log aktivitas...</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                <Info className="h-8 w-8 text-rose-450" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Gagal memuat log</p>
                <button
                  onClick={() => refetch()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-[10px] font-bold"
                >
                  Coba Lagi
                </button>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                <Info className="h-8 w-8 text-slate-350" />
                <p className="text-xs font-medium text-slate-400">Belum ada riwayat aktivitas kamar.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-400">
                      KAMAR {log.roomNumber || '—'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold border uppercase ${getActionBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {getLogMessage(log)}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[9px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-455" />
                      <span className="truncate max-w-32.5 font-bold" title={log.createdByEmail}>
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
        </div>
      </div>
    </>
  );
}
