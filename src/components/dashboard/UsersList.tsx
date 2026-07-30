import React, { useState } from "react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Loader2,
  Users,
  DoorOpen,
  Key,
  Mail,
  Phone,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserData } from "../../hooks/useUserData";
import { useRoomsQuery } from "../../rest/useRoom";
import {
  usePropertyUsersQuery,
  useCreatePropertyUserMutation,
  useAssignUserRoomsMutation,
  useRemovePropertyUserMutation,
  type UserRoomAccess,
} from "../../rest/usePropertyUsers";
import { FormInput } from "../ui/FormInput";
import ConfirmationModal from "../ui/ConfirmationModal";
import { toast } from "../../hooks/useToast";
import { ROLES } from "../../types/role";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import AddStaffModal from "../modal/AddStaffModal";
import AssignRoomsModal from "../modal/AssignRoomsModal";
import { formatDate } from "../../utils/helper";

const defaultQueryClient = new QueryClient();

export default function UsersList() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <UsersListContent />
    </QueryClientProvider>
  );
}

function UsersListContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  // Query users and rooms
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = usePropertyUsersQuery(propertyId);
  const { data: roomsResponse, isLoading: isLoadingRooms } = useRoomsQuery(
    propertyId,
    0,
    100,
  );

  const usersList = usersResponse?.data || [];
  const rooms = roomsResponse?.data?.content || [];

  const createUserMutation = useCreatePropertyUserMutation(propertyId);
  const assignRoomsMutation = useAssignUserRoomsMutation(propertyId);
  const removeUserMutation = useRemovePropertyUserMutation(propertyId);

  // States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRoomAccess | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Selected room ids for active user access setting
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Hunian Tidak Ditemukan
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Anda harus memiliki setidaknya satu hunian (property) untuk dapat
          mengelola staff/user.
        </p>
      </div>
    );
  }

  const handleCreateUser = async (data: {
    name: string;
    email: string;
    password?: string;
    phoneNumber?: string;
  }) => {
    try {
      const res = await createUserMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password || "",
        phoneNumber: data.phoneNumber || undefined,
        roleName: ROLES.USER,
        isActive: true,
      });

      // Auto link user to property with empty room list
      if (res.success && res.data && res.data.id) {
        await assignRoomsMutation.mutateAsync({
          userId: res.data.id,
          roomIds: [],
        });
      }

      toast.success(
        "Staff/User baru berhasil ditambahkan dan ditautkan ke properti!",
      );
      setIsCreateOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan user baru.");
    }
  };

  const handleOpenAccessModal = (targetUser: UserRoomAccess) => {
    setSelectedUser(targetUser);
    setSelectedRoomIds(targetUser.assignedRooms.map((r) => r.id));
    setIsAccessOpen(true);
  };

  const handleSaveAccess = async (roomIds: number[]) => {
    if (!selectedUser) return;
    try {
      await assignRoomsMutation.mutateAsync({
        userId: selectedUser.userId,
        roomIds: roomIds,
      });
      toast.success("Akses kamar berhasil disimpan!");
      setIsAccessOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan akses kamar.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await removeUserMutation.mutateAsync(deleteUserId);
      toast.success("Akses user berhasil dihapus dari properti ini!");
      setDeleteUserId(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus user.");
    }
  };

  const formatLastActive = (item: UserRoomAccess) => {
    if (item.isOnline) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shrink-0">
          <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      );
    }

    if (!item.lastLoginAt) {
      return (
        <span className="text-[9px] text-slate-400 dark:text-slate-500 italic shrink-0">
          Offline
        </span>
      );
    }

    const formatted = formatDate(item.lastLoginAt);
    return (
      <span
        className="text-[8px] text-slate-400 dark:text-slate-500 text-right leading-none shrink-0"
        title={`Terakhir aktif: ${formatted}`}
      >
        Aktif: {formatted}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Kelola Staff &amp; User
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Tambahkan staff/user pengelola dan tugaskan kamar tertentu yang
            dapat mereka kelola.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Staff Baru
        </button>
      </div>
      {/* Loading */}
      {isLoadingUsers && <LoadingState message="Memuat data staff..." />}
      {/* Error */}
      {isErrorUsers && !isLoadingUsers && (
        <ErrorState title="Gagal memuat data staff." />
      )}
      {/* Empty State */}
      {!isLoadingUsers && !isErrorUsers && usersList.length === 0 && (
        <EmptyState
          icon={Users}
          title="Belum ada Staff/User"
          description="Tambahkan staff baru untuk membantu mengelola kamar dan tata tertib hunian Anda."
          actionLabel="Tambah Staff Pertama"
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {/* Users Grid */}
      {!isLoadingUsers && !isErrorUsers && usersList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {usersList.map((item) => (
            <div
              key={item.userId}
              className="
          group relative
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          rounded-2xl
          p-5
          shadow-sm
          hover:shadow-lg hover:-translate-y-0.5
          transition-all duration-200
        "
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div
                    className="
                h-11 w-11
                rounded-full
                bg-cyan-50 dark:bg-cyan-950/40
                text-cyan-600 dark:text-cyan-400
                border border-cyan-100 dark:border-cyan-900
                flex items-center justify-center
                font-bold text-sm
                shrink-0
              "
                  >
                    {item.userName.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {item.userName}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 dark:text-slate-500 min-w-0">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.userEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {item.isOnline ? (
                    <span
                      className="
                  inline-flex items-center gap-1.5
                  px-2 py-1
                  rounded-full
                  bg-emerald-50 dark:bg-emerald-950/30
                  text-emerald-600 dark:text-emerald-400
                  text-[10px] font-semibold
                "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span
                      className="
                  inline-flex items-center
                  px-2 py-1
                  rounded-full
                  bg-slate-100 dark:bg-slate-800
                  text-slate-500 dark:text-slate-400
                  text-[10px] font-medium
                "
                    >
                      Offline
                    </span>
                  )}
                </div>
              </div>

              {/* Last Active */}
              {!item.isOnline && item.lastLoginAt && (
                <p className="mt-2 ml-14 text-[10px] text-slate-400 dark:text-slate-500">
                  Terakhir aktif {formatDate(item.lastLoginAt)}
                </p>
              )}

              {/* Room Access */}
              <div
                className="
            mt-5
            pt-4
            border-t border-slate-100 dark:border-slate-800
          "
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Akses Kamar
                  </span>

                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {item.assignedRooms.length} kamar
                  </span>
                </div>

                {item.assignedRooms.length === 0 ? (
                  <div
                    className="
                flex items-center gap-2
                px-3 py-2.5
                rounded-xl
                bg-amber-50 dark:bg-amber-950/20
                border border-amber-100 dark:border-amber-900/40
                text-amber-600 dark:text-amber-400
              "
                  >
                    <DoorOpen className="h-4 w-4 shrink-0" />

                    <span className="text-xs font-medium">
                      Belum ada akses kamar
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {item.assignedRooms.map((room) => (
                      <span
                        key={room.id}
                        className="
                    inline-flex items-center
                    px-2.5 py-1
                    rounded-lg
                    bg-slate-100 dark:bg-slate-800
                    text-slate-600 dark:text-slate-300
                    text-[10px]
                    font-semibold
                    border border-slate-200 dark:border-slate-700
                  "
                      >
                        Room {room.roomNumber}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => handleOpenAccessModal(item)}
                  className="
              flex-1
              inline-flex items-center justify-center gap-2
              h-9
              px-3
              rounded-xl
              bg-cyan-600
              hover:bg-cyan-700
              text-white
              text-xs font-semibold
              shadow-sm shadow-cyan-600/20
              transition-colors
              cursor-pointer
            "
                >
                  <Key className="h-3.5 w-3.5" />
                  Atur Kamar
                </button>

                <button
                  onClick={() => setDeleteUserId(item.userId)}
                  className="
              h-9 w-9
              inline-flex items-center justify-center
              rounded-xl
              border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-slate-400
              hover:text-rose-500
              hover:border-rose-200
              hover:bg-rose-50
              dark:hover:bg-rose-950/20
              transition-colors
              cursor-pointer
            "
                  title="Hapus Akses Staff"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={createUserMutation.isPending}
      />
      {/* Access Settings Modal */}
      {isAccessOpen && selectedUser && (
        <AssignRoomsModal
          isOpen={isAccessOpen}
          onClose={() => setIsAccessOpen(false)}
          userName={selectedUser.userName}
          rooms={rooms}
          initialRoomIds={selectedRoomIds}
          onSave={handleSaveAccess}
          isLoadingRooms={isLoadingRooms}
          isSaving={assignRoomsMutation.isPending}
        />
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        title="Hapus Akses Staff?"
        message="Staff ini tidak akan dapat mengelola kamar atau melihat properti ini lagi. Akun staff tetap terdaftar tetapi status akses dicabut."
        confirmText="Hapus Akses"
        cancelText="Batal"
        isDanger={true}
        isLoading={removeUserMutation.isPending}
      />
    </div>
  );
}
