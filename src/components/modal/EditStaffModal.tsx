import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@pradnyakuswara/ui';
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
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title="Ubah Data Staff / Pengelola"
      description="Ubah nama, email, nomor telepon, password, atau hak akses akun staff ini."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" form="edit-staff-form" isLoading={isLoading}>Simpan Perubahan</Button>
        </>
      }
    >
      <form id="edit-staff-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Nama Lengkap" placeholder="Nama staff..." value={name} onChange={(e) => setName(e.target.value)} required />
        <InputEmail label="Alamat Email" placeholder="staff@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <InputPassword label="Password Baru (Kosongkan jika tidak diubah)" placeholder="Masukkan password baru jika ingin mengubah..." value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputPhone label="Nomor Telepon (Opsional)" placeholder="81234567890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <SelectRole label="Pilih Role Akses" value={roleName} onChange={setRoleName} required />
      </form>
    </Modal>
  );
}
