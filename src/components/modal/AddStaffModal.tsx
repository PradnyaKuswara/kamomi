import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FormInput } from '../ui/FormInput';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password?: string; phoneNumber?: string }) => Promise<void>;
  isLoading: boolean;
}

export default function AddStaffModal({ isOpen, onClose, onSubmit, isLoading }: AddStaffModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password, phoneNumber });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
            Tambah Staff / Pengelola Baru
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Akun staff akan didaftarkan ke sistem dan dapat ditugaskan untuk mengelola kamar setelahnya.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nama Lengkap"
            placeholder="Nama staff..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            label="Alamat Email"
            placeholder="staff@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Password Akun"
            placeholder="Masukkan password staff..."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormInput
            label="Nomor Telepon (Opsional)"
            placeholder="Contoh: 081234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

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
              Simpan Akun Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
