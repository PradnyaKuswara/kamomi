import React, { useState, useEffect } from 'react';
import { Button, Modal, Switch } from '@pradnyakuswara/ui';
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
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title={editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
      description="Isi informasi Wi-Fi kamar di bawah ini. Info ini akan tersambung ke QR code kamar secara otomatis."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" form="room-form" isLoading={isLoading}>Simpan Kamar</Button>
        </>
      }
    >
      <form id="room-form" onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Nomor Kamar" placeholder="Contoh: 101" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
        <FormInput label="Wi-Fi SSID" placeholder="Contoh: Prompt_Indo_101" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} required />
        <FormInput label="Wi-Fi Password (Opsional)" placeholder="Password Wi-Fi Kamar..." type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />

        {editingRoom && (
          <Switch
            label="Status Aktif Kamar"
            description="Sembunyikan informasi dari halaman tamu"
            checked={isActive}
            onChange={setIsActive}
          />
        )}
      </form>
    </Modal>
  );
}
