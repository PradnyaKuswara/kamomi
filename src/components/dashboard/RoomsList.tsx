import React, { useMemo, useState } from 'react';
import {
  Plus,
  HelpCircle,
  DoorOpen,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserData } from '../../hooks/useUserData';
import {
  useRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../rest/useRoom';
import ConfirmationModal from '../ui/ConfirmationModal';
import Pagination from '../ui/Pagination';
import { toast } from '../../hooks/useToast';
import type { Room, RoomRequest } from '../../types/room';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';
import RoomFormModal from '../modal/RoomFormModal';
import RoomCard from '../card/RoomCard';

const defaultQueryClient = new QueryClient();

export default function RoomsList() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <RoomsListContent />
    </QueryClientProvider>
  );
}

function RoomsListContent() {
  const { user, subscriptionInfo } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  const [page, setPage] = useState(0);
  const [size] = useState(20);

  const { data: response, isLoading: isLoadingRooms, isError } = useRoomsQuery(propertyId, page, size);
  const roomsPage = response?.data;
  const rooms = roomsPage?.content || [];

  const createMutation = useCreateRoomMutation(propertyId);
  const updateMutation = useUpdateRoomMutation(propertyId);
  const deleteMutation = useDeleteRoomMutation(propertyId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null);

  const isMaxRoom = useMemo(() => {
    return rooms.length >= (subscriptionInfo?.plan?.maxRooms || 1);
  }, [rooms, subscriptionInfo])

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Anda harus memiliki setidaknya satu hunian (property) untuk dapat mengelola kamar.
        </p>
      </div>
    );
  }

  const handleOpenCreate = () => {
    if(isMaxRoom) {
      toast.error('Anda telah mencapai batas maksimum kamar. Silakan upgrade paket Anda.');
      return;
    }
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: { roomNumber: string; wifiSsid: string; wifiPassword?: string }) => {
    if (!data.roomNumber.trim() || !data.wifiSsid.trim()) {
      toast.error('Nomor Kamar dan SSID Wi-Fi wajib diisi.');
      return;
    }

    const payload: RoomRequest = {
      roomNumber: data.roomNumber,
      wifiSsid: data.wifiSsid,
      wifiPassword: data.wifiPassword || undefined,
    };

    try {
      if (editingRoom) {
        await updateMutation.mutateAsync({ roomId: editingRoom.id, data: payload });
        toast.success('Kamar berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Kamar baru berhasil ditambahkan!');
        setPage(0);
      }
      setIsFormOpen(false);
      setEditingRoom(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan kamar.');
    }
  };

  const handleDelete = async () => {
    if (!deleteRoomId) return;
    try {
      await deleteMutation.mutateAsync(deleteRoomId);
      toast.success('Kamar berhasil dihapus!');
      setDeleteRoomId(null);
      if (rooms.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus kamar.');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Daftar Kamar &amp; Link QR
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Kelola informasi Wi-Fi, tata tertib, dan ekspor stiker QR untuk setiap kamar.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Kamar Baru
        </button>
      </div>

      {/* Loading */}
      {isLoadingRooms && <LoadingState message="Memuat data kamar..." />}

      {/* Error */}
      {isError && !isLoadingRooms && <ErrorState title="Gagal memuat data kamar." />}

      {/* Empty State */}
      {!isLoadingRooms && !isError && rooms.length === 0 && (
        <EmptyState
          icon={DoorOpen}
          title="Belum ada kamar"
          description="Tambahkan kamar pertama Anda untuk mulai membuat QR code tamu yang interaktif."
          actionLabel="Tambah Kamar Pertama"
          onAction={handleOpenCreate}
        />
      )}

      {/* Card Grid */}
      {!isLoadingRooms && !isError && rooms.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={() => handleOpenEdit(room)}
                onDelete={() => setDeleteRoomId(room.id)}
                formatDate={formatDate}
              />
            ))}
          </div>

          {roomsPage && (
            <Pagination
              page={page}
              size={size}
              totalPages={roomsPage.totalPages}
              totalElements={roomsPage.totalElements}
              onPageChange={setPage}
              itemName="kamar"
            />
          )}
        </>
      )}

      {/* Form Modal */}
      <RoomFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        editingRoom={editingRoom}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteRoomId !== null}
        onClose={() => setDeleteRoomId(null)}
        onConfirm={handleDelete}
        title="Hapus Kamar?"
        message="Kamar ini beserta QR code-nya akan dihapus secara soft-delete. Tindakan ini tidak dapat dibatalkan dari user panel."
        confirmText="Hapus Kamar"
        cancelText="Batal"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
