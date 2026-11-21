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
import { Badge, Button, Card, Tooltip } from '@pradnyakuswara/ui';
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

  const isActive = room.isActive !== false;

  return (
    <Card className={`group relative flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-card-hover)] ${!isActive ? 'opacity-70' : ''}`}>
      <div className={`h-1 w-full ${isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-ink-300)]'}`} />

      {/* Aksi: Log / Edit / Hapus */}
      <div className="absolute top-3 right-2 flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Tooltip content="Lihat Log Perubahan">
          <Button variant="ghost" size="sm" onClick={onViewLogs} aria-label="Lihat Log Perubahan" leftIcon={<History className="h-3.5 w-3.5" />} />
        </Tooltip>
        <Tooltip content="Edit Kamar">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Edit Kamar" leftIcon={<Edit2 className="h-3.5 w-3.5" />} />
        </Tooltip>
        <Tooltip content="Hapus Kamar">
          <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Hapus Kamar" leftIcon={<Trash2 className="h-3.5 w-3.5 text-[var(--color-danger)]" />} />
        </Tooltip>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] flex items-center justify-center shrink-0">
              <DoorOpen className="h-4.5 w-4.5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] leading-none">Kamar</p>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-0.5 leading-tight">{room.roomNumber}</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleActive}
            disabled={updateMutation.isPending}
            title={isActive ? 'Klik untuk menonaktifkan' : 'Klik untuk mengaktifkan'}
            className="cursor-pointer disabled:opacity-50"
          >
            <Badge variant={isActive ? 'success' : 'default'} size="sm" dot ping={isActive}>
              {isActive ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </button>

          <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />
              <span className="font-medium truncate max-w-[140px]" title={room.wifiSsid || 'Belum diatur'}>
                {room.wifiSsid || <span className="text-[var(--text-muted)] italic">Wi-Fi tidak diatur</span>}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />
              <span className="font-medium">
                {ruleCount > 0 ? `${ruleCount} Aturan` : <span className="text-[var(--text-muted)] italic">Belum ada aturan</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-2">
          <a href={`/editor?room=${room.id}`}>
            <Button variant="primary" size="sm" fullWidth leftIcon={<QrCode className="h-3.5 w-3.5" />}>QR &amp; Edit</Button>
          </a>
          <a href={room.code ? `/r/${room.code}` : `/guest?room=${room.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" fullWidth leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>Tamu</Button>
          </a>
        </div>
      </div>
    </Card>
  );
}
