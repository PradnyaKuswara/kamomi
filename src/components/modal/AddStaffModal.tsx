import React, { useState } from 'react';
import { Button, Modal } from '@pradnyakuswara/ui';
import { FormInput } from '../input/FormInput';
import { InputEmail } from '../input/InputEmail';
import { InputPassword } from '../input/InputPassword';
import { InputPhone } from '../input/InputPhone';
import SelectRole from '../input/SelectRole';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password?: string; phoneNumber?: string; roleName: 'ADMIN' | 'USER' }) => Promise<void>;
  isLoading: boolean;
}

export default function AddStaffModal({ isOpen, onClose, onSubmit, isLoading }: AddStaffModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleName, setRoleName] = useState<'ADMIN' | 'USER'>('USER');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password, phoneNumber, roleName });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title="Tambah Staff / Pengelola Baru"
      description="Akun staff akan didaftarkan ke sistem dan dapat ditugaskan untuk mengelola kamar setelahnya."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" form="add-staff-form" isLoading={isLoading}>Simpan Akun Staff</Button>
        </>
      }
    >
      <form id="add-staff-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Nama Lengkap" placeholder="Nama staff..." value={name} onChange={(e) => setName(e.target.value)} required />
        <InputEmail label="Alamat Email" placeholder="staff@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <InputPassword label="Password Akun" placeholder="Masukkan password staff..." value={password} onChange={(e) => setPassword(e.target.value)} required />
        <InputPhone label="Nomor Telepon (Opsional)" placeholder="81234567890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <SelectRole label="Pilih Role Akses" value={roleName} onChange={setRoleName} required />
      </form>
    </Modal>
  );
}
