import React, { useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  Wifi,
  QrCode,
  ExternalLink,
  DoorOpen,
  HeartHandshake,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserData } from '../../hooks/useUserData';
import {
  useRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../rest/useRoom';
import { FormInput } from '../ui/FormInput';
import ConfirmationModal from '../ui/ConfirmationModal';
import Pagination from '../ui/Pagination';
import { toast } from '../../hooks/useToast';
import type { Room, RoomRequest } from '../../types/room';

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

  const [roomNumber, setRoomNumber] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

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

  const resetForm = () => {
    setRoomNumber('');
    setWifiSsid('');
    setWifiPassword('');
    setEditingRoom(null);
  };

  const handleOpenCreate = () => {
    if(isMaxRoom) {
      toast.error('Anda telah mencapai batas maksimum kamar. Silakan upgrade paket Anda.');
      return;
    }
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setWifiSsid(room.wifiSsid);
    setWifiPassword(room.wifiPassword || '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim() || !wifiSsid.trim()) {
      toast.error('Nomor Kamar dan SSID Wi-Fi wajib diisi.');
      return;
    }

    const payload: RoomRequest = {
      roomNumber,
      wifiSsid,
      wifiPassword: wifiPassword || undefined,
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
      resetForm();
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
      {isLoadingRooms && (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
          <p className="text-xs text-slate-400">Memuat data kamar...</p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoadingRooms && (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-2">
          <p className="text-sm font-semibold text-rose-500">Gagal memuat data kamar.</p>
          <p className="text-xs text-slate-400">Coba refresh halaman atau periksa koneksi Anda.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingRooms && !isError && rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[320px] text-center space-y-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-10">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <DoorOpen className="h-8 w-8 text-cyan-500" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-200 text-base">Belum ada kamar</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Tambahkan kamar pertama Anda untuk mulai membuat QR code tamu yang interaktif.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Kamar Pertama
          </button>
        </div>
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
          />
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
                placeholder="Contoh: Kost_Adem_101"
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
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 font-bold text-xs transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

// ─── Room Card Component ─────────────────────────────────────────────────────

interface RoomCardProps {
  room: Room;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (d: string) => string;
}

function RoomCard({ room, onEdit, onDelete, formatDate }: RoomCardProps) {
  const ruleCount = room.rules?.length ?? 0;

  return (
    <div className="group relative flex flex-col bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-cyan-400/40 dark:hover:border-cyan-500/30 transition-all duration-200 backdrop-blur-sm">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Room number row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center shrink-0">
              <DoorOpen className="h-3.5 w-3.5 text-cyan-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">Kamar</p>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate leading-tight">
                {room.roomNumber}
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shrink-0">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Aktif
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <Wifi className="h-3 w-3 text-indigo-400 shrink-0" />
            <span className="font-mono truncate">{room.wifiSsid || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
            <HeartHandshake className="h-3 w-3 text-rose-400 shrink-0" />
            <span>
              {ruleCount > 0
                ? <>{ruleCount} aturan</>
                : <span className="italic">Belum ada aturan</span>
              }
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold text-[9px] transition-all cursor-pointer"
          >
            <Edit2 className="h-2.5 w-2.5" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 py-1 rounded-lg border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 dark:text-rose-400 font-bold text-[9px] transition-all cursor-pointer"
          >
            <Trash2 className="h-2.5 w-2.5" />
            Hapus
          </button>

          <a
            href={`/editor?room=${room.id}`}
            className="flex items-center justify-center gap-1 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-[9px] transition-all"
          >
            <QrCode className="h-2.5 w-2.5" />
            QR &amp; Edit
          </a>

          <a
            href={`/guest?room=${room.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] transition-all"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            Tamu
          </a>
        </div>
      </div>
    </div>
  );
}
