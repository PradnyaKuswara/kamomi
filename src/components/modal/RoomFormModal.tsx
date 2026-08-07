import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { FormInput } from '../input/FormInput';
import type { Room } from '../../types/room';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { roomNumber: string; wifiSsid: string; wifiPassword?: string; isActive?: boolean }) => Promise<void>;
  editingRoom: Room | null;
  isLoading: boolean;
}

export default function RoomFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingRoom,
  isLoading
}: RoomFormModalProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editingRoom) {
      setRoomNumber(editingRoom.roomNumber);
      setWifiSsid(editingRoom.wifiSsid);
      setWifiPassword(editingRoom.wifiPassword || '');
      setIsActive(editingRoom.isActive !== false);
    } else {
      setRoomNumber('');
      setWifiSsid('');
      setWifiPassword('');
      setIsActive(true);
    }
  }, [editingRoom, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ roomNumber, wifiSsid, wifiPassword, isActive });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
            {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Isi informasi Wi-Fi kamar di bawah ini. Info ini akan tersambung ke QR code kamar secara otomatis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nomor Kamar"
            placeholder="Contoh: 101"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
          <FormInput
            label="Wi-Fi SSID"
            placeholder="Contoh: Prompt_Indo_101"
            value={wifiSsid}
            onChange={(e) => setWifiSsid(e.target.value)}
            required
          />
          <FormInput
            label="Wi-Fi Password (Opsional)"
            placeholder="Password Wi-Fi Kamar..."
            type="password"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
          />

          {editingRoom && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/55 dark:border-slate-800/50">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Status Aktif Kamar</span>
                <p className="text-[9px] text-slate-450 dark:text-slate-500">Sembunyikan informasi dari halaman tamu</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isActive ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-205 ease-in-out ${
                    isActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
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
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              Simpan Kamar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
