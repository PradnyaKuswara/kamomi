import React from 'react';
import {
  DoorOpen,
  Wifi,
  HeartHandshake,
  Edit2,
  Trash2,
  QrCode,
  ExternalLink
} from 'lucide-react';
import type { Room } from '../../types/room';

interface RoomCardProps {
  room: Room;
  onEdit: () => void;
  onDelete: () => void;
  formatDate?: (d: string) => string;
}

export default function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const ruleCount = room.rules?.length ?? 0;

  return (
    <div className="group relative flex flex-col bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-cyan-400/40 dark:hover:border-cyan-500/30 transition-all duration-200 backdrop-blur-sm">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Room number row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
              <DoorOpen className="h-3.5 w-3.5 text-cyan-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">Kamar</p>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate leading-tight">
                {room.roomNumber}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shrink-0">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Aktif
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <Wifi className="h-3 w-3 text-indigo-400 shrink-0" />
            <span className="font-mono truncate">{room.wifiSsid || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
            <HeartHandshake className="h-3 w-3 text-rose-400 shrink-0" />
            <span>
              {ruleCount > 0
                ? <>{ruleCount} aturan</>
                : <span className="italic">Belum ada aturan</span>
              }
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold text-[9px] transition-all cursor-pointer"
          >
            <Edit2 className="h-2.5 w-2.5" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 py-1 rounded-lg border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 dark:text-rose-400 font-bold text-[9px] transition-all cursor-pointer"
          >
            <Trash2 className="h-2.5 w-2.5" />
            Hapus
          </button>

          <a
            href={`/editor?room=${room.id}`}
            className="flex items-center justify-center gap-1 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-[9px] transition-all"
          >
            <QrCode className="h-2.5 w-2.5" />
            QR &amp; Edit
          </a>

          <a
            href={`/guest?room=${room.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] transition-all"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            Tamu
          </a>
        </div>
      </div>
    </div>
  );
}
