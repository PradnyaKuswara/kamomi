import React from 'react';
import {
  DoorOpen,
  Wifi,
  HeartHandshake,
  Edit2,
  Trash2,
  QrCode,
  ExternalLink,
  History
} from 'lucide-react';
import type { Room } from '../../types/room';
import { useUpdateRoomMutation } from '../../rest/useRoom';
import { toast } from '../../hooks/useToast';

interface RoomCardProps {
  room: Room;
  propertyId: number;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
  formatDate?: (d: string) => string;
}

export default function RoomCard({ room, propertyId, onEdit, onDelete, onViewLogs }: RoomCardProps) {
  const ruleCount = room.rules?.length ?? 0;
  const updateMutation = useUpdateRoomMutation(propertyId);

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const nextActive = room.isActive === false ? true : false;
      await updateMutation.mutateAsync({
        roomId: room.id,
        data: {
          roomNumber: room.roomNumber,
          wifiSsid: room.wifiSsid,
          wifiPassword: room.wifiPassword,
          ruleIds: room.rules?.map(r => r.id),
          isActive: nextActive
        }
      });
      toast.success(`Kamar ${room.roomNumber} ${nextActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status kamar.');
    }
  };

  return (
    <div className={`group relative flex flex-col bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-cyan-500/5 hover:border-cyan-500/30 dark:hover:border-cyan-400/20 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md ${room.isActive === false ? 'opacity-70 grayscale-30 hover:grayscale-0' : ''}`}>
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${room.isActive === false ? 'from-slate-400 via-slate-500 to-slate-650' : 'from-cyan-500 via-indigo-500 to-purple-500'} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Action buttons on top-right (Edit/Delete/Logs) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onViewLogs}
          title="Lihat Log Perubahan"
          className="p-1 rounded-md bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-cyan-950/40 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 border border-slate-200/30 dark:border-slate-700/30 transition-colors cursor-pointer"
        >
          <History className="h-2.5 w-2.5" />
        </button>
        <button
          onClick={onEdit}
          title="Edit Kamar"
          className="p-1 rounded-md bg-slate-100 hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-cyan-950/40 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 border border-slate-200/30 dark:border-slate-700/30 transition-colors cursor-pointer"
        >
          <Edit2 className="h-2.5 w-2.5" />
        </button>
        <button
          onClick={onDelete}
          title="Hapus Kamar"
          className="p-1 rounded-md bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/30 dark:border-slate-700/30 transition-colors cursor-pointer"
        >
          <Trash2 className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        {/* Room Header Info */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <DoorOpen className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Kamar</p>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {room.roomNumber}
                </h3>
              </div>
            </div>
          </div>

          {/* Status Toggle Button */}
          <button
            onClick={handleToggleActive}
            disabled={updateMutation.isPending}
            title={room.isActive === false ? "Klik untuk mengaktifkan" : "Klik untuk menonaktifkan"}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 ${
              room.isActive !== false
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/40'
                : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {room.isActive !== false ? (
              <>
                <span className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                </span>
                Aktif
              </>
            ) : (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                Nonaktif
              </>
            )}
          </button>

          {/* Info Details Section */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="p-0.5 rounded-md bg-indigo-500/5 dark:bg-indigo-400/5">
                <Wifi className="h-3 w-3 text-indigo-500 dark:text-indigo-450 shrink-0" />
              </div>
              <span className="font-medium truncate max-w-[120px]" title={room.wifiSsid || 'Belum diatur'}>
                {room.wifiSsid || <span className="text-slate-400 italic">Wi-Fi tidak diatur</span>}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="p-0.5 rounded-md bg-rose-500/5 dark:bg-rose-400/5">
                <HeartHandshake className="h-3 w-3 text-rose-500 dark:text-rose-450 shrink-0" />
              </div>
              <span className="font-medium">
                {ruleCount > 0 ? (
                  <span>{ruleCount} Aturan</span>
                ) : (
                  <span className="text-slate-400 italic">Belum ada aturan</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-2">
          <a
            href={`/editor?room=${room.id}`}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500 hover:to-indigo-500 text-cyan-700 hover:text-white dark:text-cyan-400 dark:hover:text-white font-bold text-[10px] border border-cyan-500/10 hover:border-transparent transition-all shadow-xs hover:shadow-md hover:shadow-cyan-500/20 active:scale-95 duration-200"
          >
            <QrCode className="h-3 w-3" />
            QR &amp; Edit
          </a>

          <a
            href={room.code ? `/r/${room.code}` : `/guest?room=${room.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] transition-all border border-slate-200/50 dark:border-slate-700/50 active:scale-95 duration-200"
          >
            <ExternalLink className="h-3 w-3" />
            Tamu
          </a>
        </div>
      </div>
    </div>
  );
}
