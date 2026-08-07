import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { FormInput } from '../input/FormInput';
import { InputEmail } from '../input/InputEmail';
import { InputPassword } from '../input/InputPassword';
import { InputPhone } from '../input/InputPhone';
import SelectRole from '../input/SelectRole';
import type { UserRoomAccess } from '../../rest/usePropertyUsers';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRoomAccess | null;
  onSubmit: (data: { name?: string; email?: string; password?: string; phoneNumber?: string; roleName?: 'ADMIN' | 'USER' }) => Promise<void>;
  isLoading: boolean;
}

export default function EditStaffModal({ isOpen, onClose, user, onSubmit, isLoading }: EditStaffModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleName, setRoleName] = useState<'ADMIN' | 'USER'>('USER');

  useEffect(() => {
    if (user) {
      setName(user.userName || '');
      setEmail(user.userEmail || '');
      setPassword(''); // Password should remain empty unless edited
      
      // Clean leading country code or zero for InputPhone matching +62 prefix
      const rawPhone = user.phoneNumber || '';
      const cleanPhone = rawPhone.replace(/^62|^0/, '');
      setPhoneNumber(cleanPhone);
      
      setRoleName(user.roleName || 'USER');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct request payload. Only pass password if it was filled
    const payload: { name: string; email: string; password?: string; phoneNumber: string; roleName: 'ADMIN' | 'USER' } = {
      name,
      email,
      phoneNumber: phoneNumber ? `62${phoneNumber}` : '',
      roleName,
    };
    
    if (password.trim()) {
      payload.password = password;
    }
    
    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
            Ubah Data Staff / Pengelola
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Ubah nama, email, nomor telepon, password, atau hak akses akun staff ini.
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
          <InputEmail
            label="Alamat Email"
            placeholder="staff@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputPassword
            label="Password Baru (Kosongkan jika tidak diubah)"
            placeholder="Masukkan password baru jika ingin mengubah..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputPhone
            label="Nomor Telepon (Opsional)"
            placeholder="81234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <SelectRole
            label="Pilih Role Akses"
            value={roleName}
            onChange={setRoleName}
            required
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
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
