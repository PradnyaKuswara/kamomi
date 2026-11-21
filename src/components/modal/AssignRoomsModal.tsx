import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Modal, Spinner } from '@pradnyakuswara/ui';
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
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title={`Atur Akses Kamar: ${userName}`}
      description="Pilih kamar mana saja yang dapat diakses dan dikelola oleh staff ini."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="button" onClick={handleSave} isLoading={isSaving}>Simpan Akses</Button>
        </>
      }
    >
      {isLoadingRooms ? (
        <div className="flex justify-center p-6">
          <Spinner size="lg" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center p-6 text-sm text-[var(--text-muted)]">
          Belum ada kamar terdaftar di properti ini. Tambahkan kamar terlebih dahulu.
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-1 border border-[var(--border-color)] rounded-[var(--radius-lg)] p-2 bg-[var(--bg-subtle)]">
          {rooms.map((room) => (
            <Checkbox
              key={room.id}
              checked={selectedRoomIds.includes(room.id)}
              onChange={() => handleToggleRoom(room.id)}
              label={`Kamar ${room.roomNumber}`}
              description={`SSID: ${room.wifiSsid || '—'}`}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
