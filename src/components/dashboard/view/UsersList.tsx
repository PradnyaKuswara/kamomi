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
  Shield,
  User as UserIcon,
  ToggleLeft,
  ToggleRight,
  Edit2,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserData } from "../../../hooks/useUserData";
import { useRoomsQuery } from "../../../rest/useRoom";
import {
  usePropertyUsersQuery,
  useCreatePropertyUserMutation,
  useAssignUserRoomsMutation,
  useRemovePropertyUserMutation,
  useUpdatePropertyUserMutation,
  type UserRoomAccess,
} from "../../../rest/usePropertyUsers";
import ConfirmationModal from "../../modal/ConfirmationModal";
import Pagination from "../../ui/Pagination";
import { toast } from "../../../hooks/useToast";
import LoadingState from "../../ui/LoadingState";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddStaffModal from "../../modal/AddStaffModal";
import EditStaffModal from "../../modal/EditStaffModal";
import AssignRoomsModal from "../../modal/AssignRoomsModal";
import { formatDate } from "../../../utils/helper";

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

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Query users and rooms
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = usePropertyUsersQuery(propertyId, page, size);
  const { data: roomsResponse, isLoading: isLoadingRooms } = useRoomsQuery(
    propertyId,
    0,
    100,
  );

  const usersPage = usersResponse?.data;
  const usersList = usersPage?.content || [];
  const rooms = roomsResponse?.data?.content || [];

  const createUserMutation = useCreatePropertyUserMutation(propertyId);
  const assignRoomsMutation = useAssignUserRoomsMutation(propertyId);
  const removeUserMutation = useRemovePropertyUserMutation(propertyId);
  const updateUserMutation = useUpdatePropertyUserMutation(propertyId);

  // States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRoomAccess | null>(null);
  const [editingUser, setEditingUser] = useState<UserRoomAccess | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);

  // Selected room ids for active user access setting
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
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
    roleName: 'ADMIN' | 'USER';
  }) => {
    try {
      const res = await createUserMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password || "",
        phoneNumber: data.phoneNumber || undefined,
        roleName: data.roleName,
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

  const handleToggleUserActive = async (userId: number, currentStatus: boolean) => {
    setIsUpdatingId(userId);
    try {
      await updateUserMutation.mutateAsync({
        userId,
        data: { isActive: !currentStatus },
      });
      toast.success(
        currentStatus ? "Staff berhasil dinonaktifkan!" : "Staff berhasil diaktifkan kembali!"
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status aktif.");
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleUpdateUser = async (data: {
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    roleName?: 'ADMIN' | 'USER';
  }) => {
    if (!editingUser) return;
    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.userId,
        data: data,
      });
      toast.success("Data staff berhasil diubah!");
      setIsEditOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah data staff.");
    }
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

      {/* Users List (Horizontal / Rectangular Card Layout) */}
      {!isLoadingUsers && !isErrorUsers && usersList.length > 0 && (
        <div className="flex flex-col gap-4">
          {usersList.map((item) => {
            const isActive = item.isActive !== false; // default true if undefined
            return (
              <div
                key={item.userId}
                className={`
                  flex flex-col lg:flex-row lg:items-center justify-between gap-6
                  bg-white dark:bg-slate-900
                  border border-slate-200 dark:border-slate-800
                  rounded-2xl p-5 shadow-xs hover:shadow-md
                  transition-all duration-200
                  ${!isActive ? "opacity-65" : ""}
                `}
              >
                {/* Section 1: Avatar & User Info */}
                <div className="flex items-center gap-4 min-w-70">
                  {/* Avatar with status indicator */}
                  <div className="relative shrink-0">
                    <div
                      className={`
                        h-12 w-12 rounded-full
                        flex items-center justify-center font-bold text-sm border
                        ${item.roleName === "ADMIN"
                          ? "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400"
                          : "bg-cyan-50 border-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:border-cyan-900 dark:text-cyan-400"
                        }
                      `}
                    >
                      {item.roleName === "ADMIN" ? (
                        <Shield className="h-5 w-5" />
                      ) : (
                        <UserIcon className="h-5 w-5" />
                      )}
                    </div>
                    {/* Online status indicator */}
                    <span
                      className={`
                        absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900
                        ${item.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}
                      `}
                      title={item.isOnline ? "Online" : "Offline"}
                    />
                  </div>

                  {/* Profile info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {item.userName}
                      </h3>
                      {/* Role Badge */}
                      <span
                        className={`
                          inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase
                          ${item.roleName === "ADMIN"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                            : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400"
                          }
                        `}
                      >
                        {item.roleName || "USER"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 dark:text-slate-500">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.userEmail}</span>
                    </div>

                    {item.propertyNames && item.propertyNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                        <span className="font-bold mr-0.5">Properti:</span>
                        {item.propertyNames.map((pName, index) => (
                          <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-750">
                            {pName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Room Access & Activity details */}
                <div className="flex-1 min-w-50 lg:border-l lg:border-r lg:border-slate-100 lg:dark:border-slate-800/60 lg:px-6 py-2 lg:py-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between lg:justify-start gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Akses Kamar:
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {item.assignedRooms.length} kamar
                      </span>
                    </div>

                    {item.assignedRooms.length === 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-medium self-start">
                        <DoorOpen className="h-3.5 w-3.5 shrink-0" />
                        Belum ada akses kamar
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {item.assignedRooms.map((room) => (
                          <span
                            key={room.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                          >
                            Room {room.roomNumber}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Last active info */}
                    <div className="text-[10px] text-slate-400 mt-1">
                      {item.isOnline ? (
                        <span className="text-emerald-500 font-semibold">Online Sekarang</span>
                      ) : item.lastLoginAt ? (
                        <span>Terakhir aktif: {formatDate(item.lastLoginAt)}</span>
                      ) : (
                        <span className="italic">Belum pernah login</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Action Buttons */}
                <div className="flex items-center justify-end gap-3 shrink-0">
                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => handleToggleUserActive(item.userId, isActive)}
                    disabled={isUpdatingId === item.userId || item.userId === user.id}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border
                      ${item.userId === user.id
                        ? "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900/45 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed"
                        : isActive
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/30 cursor-pointer"
                          : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-850 dark:border-slate-700 dark:text-slate-400 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-950/30 cursor-pointer"
                      }
                    `}
                    title={item.userId === user.id ? "Anda tidak dapat menonaktifkan akun sendiri" : isActive ? "Nonaktifkan Staff" : "Aktifkan Staff"}
                  >
                    {isUpdatingId === item.userId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isActive ? (
                      <>
                        <ToggleRight className="h-4 w-4 text-emerald-500" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 text-slate-400" />
                        <span>Nonaktif</span>
                      </>
                    )}
                  </button>

                  {/* Edit User Info button */}
                  <button
                    onClick={() => {
                      setEditingUser(item);
                      setIsEditOpen(true);
                    }}
                    className="
                      inline-flex items-center gap-1.5 h-9 px-3 rounded-xl
                      border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60
                      text-xs font-semibold transition-all cursor-pointer
                    "
                    title="Ubah Data Staff"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Ubah
                  </button>

                  {/* Assign rooms button */}
                  <button
                    onClick={() => handleOpenAccessModal(item)}
                    disabled={!isActive}
                    className="
                      inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl
                      bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed
                      text-white text-xs font-semibold shadow-xs shadow-cyan-600/10 transition-all cursor-pointer
                    "
                  >
                    <Key className="h-3.5 w-3.5" />
                    Atur Kamar
                  </button>

                  {/* Remove User from property button */}
                  {item.userId !== user.id && (
                    <button
                      onClick={() => setDeleteUserId(item.userId)}
                      className="
                        h-9 w-9 inline-flex items-center justify-center rounded-xl
                        border border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-900 text-slate-400
                        hover:text-rose-500 hover:border-rose-250 hover:bg-rose-50 dark:hover:bg-rose-950/20
                        transition-all cursor-pointer
                      "
                      title="Cabut Akses Properti"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {usersPage && (
            <Pagination
              page={page}
              size={size}
              totalPages={usersPage.totalPages}
              totalElements={usersPage.totalElements}
              onPageChange={setPage}
              itemName="staff"
            />
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={createUserMutation.isPending}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleUpdateUser}
        isLoading={updateUserMutation.isPending}
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
