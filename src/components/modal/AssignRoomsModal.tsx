import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Room } from '../../types/room';

interface AssignRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  rooms: Room[];
  initialRoomIds: number[];
  onSave: (roomIds: number[]) => Promise<void>;
  isLoadingRooms: boolean;
  isSaving: boolean;
}

export default function AssignRoomsModal({
  isOpen,
  onClose,
  userName,
  rooms,
  initialRoomIds,
  onSave,
  isLoadingRooms,
  isSaving
}: AssignRoomsModalProps) {
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

  useEffect(() => {
    setSelectedRoomIds(initialRoomIds);
  }, [initialRoomIds]);

  if (!isOpen) return null;

  const handleToggleRoom = (roomId: number) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const handleSave = async () => {
    await onSave(selectedRoomIds);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
            Atur Akses Kamar: {userName}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Pilih kamar mana saja yang dapat diakses dan dikelola oleh staff ini.
          </p>
        </div>

        {isLoadingRooms ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 text-cyan-500 animate-spin" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center p-6 text-xs text-slate-400">
            Belum ada kamar terdaftar di properti ini. Tambahkan kamar terlebih dahulu.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-950/40">
            {rooms.map((room) => {
              const isChecked = selectedRoomIds.includes(room.id);
              return (
                <label
                  key={room.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer select-none transition-all"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleRoom(room.id)}
                    className="rounded text-cyan-600 focus:ring-cyan-500 h-4 w-4 border-slate-300"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Kamar {room.roomNumber}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">
                      SSID: {room.wifiSsid || '—'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 font-bold text-xs transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
            Simpan Akses
          </button>
        </div>
      </div>
    </div>
  );
}
