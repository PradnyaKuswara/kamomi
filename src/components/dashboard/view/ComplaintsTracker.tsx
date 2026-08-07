import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Trash2,
  Search,
  RefreshCw,
  User,
  Phone,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { useUserData } from '../../../hooks/useUserData';
import {
  useComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation
} from '../../../rest/useComplaint';
import { toast } from '../../../hooks/useToast';
import ConfirmationModal from '../../modal/ConfirmationModal';
import type { Complaint, ComplaintStatus } from '../../../types/complaint';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  PENDING: { label: 'Menunggu', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', text: 'text-amber-500', icon: Clock },
  IN_PROGRESS: { label: 'Dalam Proses', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', text: 'text-cyan-500', icon: RefreshCw },
  RESOLVED: { label: 'Selesai', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', text: 'text-emerald-500', icon: CheckCircle2 },
  REJECTED: { label: 'Ditolak', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', text: 'text-rose-500', icon: XCircle }
};

const CATEGORY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi / Internet',
  ac: 'Pendingin Ruangan (AC)',
  plumbing: 'Kamar Mandi / Plumbing',
  cleaning: 'Kebersihan',
  other: 'Lain-lain'
};

export default function ComplaintsTracker() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <ComplaintsTrackerContent />
    </QueryClientProvider>
  );
}

function ComplaintsTrackerContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  const [activeStatusTab, setActiveStatusTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const size = 10;

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [responseNote, setResponseNote] = useState<string>('');

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // React Query
  const { data: response, isLoading, refetch } = useComplaintsQuery(
    propertyId,
    page,
    size,
    activeStatusTab
  );

  const complaintsPage = response?.data;
  const rawComplaints = complaintsPage?.content || [];
  const totalPages = complaintsPage?.totalPages || 0;

  const updateStatusMutation = useUpdateComplaintStatusMutation(propertyId);
  const deleteMutation = useDeleteComplaintMutation(propertyId);

  // Client-side search filter
  const filteredComplaints = useMemo(() => {
    if (!searchQuery.trim()) return rawComplaints;
    const query = searchQuery.toLowerCase();
    return rawComplaints.filter(c =>
      c.roomNumber.toLowerCase().includes(query) ||
      (c.guestName && c.guestName.toLowerCase().includes(query)) ||
      (c.guestContact && c.guestContact.toLowerCase().includes(query)) ||
      c.description.toLowerCase().includes(query) ||
      (CATEGORY_LABELS[c.category] || c.category).toLowerCase().includes(query)
    );
  }, [rawComplaints, searchQuery]);

  const handleOpenResponseModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setTargetStatus(complaint.status);
    setResponseNote(complaint.responseNote || '');
    setIsResponseModalOpen(true);
  };

  const handleSaveResponse = async () => {
    if (!selectedComplaint || !propertyId) return;

    try {
      await updateStatusMutation.mutateAsync({
        complaintId: selectedComplaint.id,
        data: {
          status: targetStatus,
          responseNote: responseNote.trim() || undefined
        }
      });
      toast.success('Status & tanggapan keluhan berhasil diperbarui!');
      setIsResponseModalOpen(false);
      setSelectedComplaint(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui status keluhan.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || !propertyId) return;

    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      toast.success('Keluhan berhasil dihapus!');
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus keluhan.');
    }
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                Laporan Keluhan Tamu
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Kelola dan tanggapi laporan keluhan fasilitas yang dikirimkan oleh tamu kamar.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* Control Bar (Filters & Search) */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: 'ALL', label: 'Semua Status' },
            { key: 'PENDING', label: 'Menunggu' },
            { key: 'IN_PROGRESS', label: 'Dalam Proses' },
            { key: 'RESOLVED', label: 'Selesai' },
            { key: 'REJECTED', label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveStatusTab(tab.key);
                setPage(0);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeStatusTab === tab.key
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-60">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kamar, nama, atau isi keluhan..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-500" />
            <p className="text-xs font-medium">Memuat daftar keluhan...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
              {searchQuery ? 'Tidak ada keluhan yang cocok dengan pencarian' : 'Tidak ada laporan keluhan'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Semua aman! Belum ada keluhan yang dilaporkan oleh tamu.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {filteredComplaints.map((c) => {
              const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusCfg.icon;

              return (
                <div key={c.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="space-y-2.5 flex-1">
                    {/* Top Row: Room & Category & Time */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black">
                        Kamar {c.roomNumber}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {CATEGORY_LABELS[c.category] || c.category}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>

                    {/* Guest info */}
                    {(c.guestName || c.guestContact) && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        {c.guestName && (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {c.guestName}
                          </span>
                        )}
                        {c.guestContact && (
                          <a
                            href={`https://wa.me/${c.guestContact.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {c.guestContact}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Complaint Description */}
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      "{c.description}"
                    </p>

                    {/* Host Response Note (if available) */}
                    {c.responseNote && (
                      <div className="flex items-start gap-2 text-xs bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                        <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-600 dark:text-amber-400">Tanggapan Pengelola: </span>
                          <span>{c.responseNote}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-row md:flex-col items-end gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenResponseModal(c)}
                        className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Tanggapi / Status</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeleteTargetId(c.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-500/20 transition-colors"
                        title="Hapus Keluhan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Halaman <strong>{page + 1}</strong> dari <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tanggapi / Edit Status */}
      {isResponseModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                  Tanggapi Keluhan Kamar {selectedComplaint.roomNumber}
                </h3>
              </div>
              <button
                onClick={() => setIsResponseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Original issue summary */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                  {CATEGORY_LABELS[selectedComplaint.category] || selectedComplaint.category}
                </span>
                <span>{formatDateTime(selectedComplaint.createdAt)}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                "{selectedComplaint.description}"
              </p>
            </div>

            {/* Status Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pilih Status Keluhan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { status: 'PENDING' as ComplaintStatus, label: 'Menunggu', color: 'hover:border-amber-500 active:bg-amber-500/10' },
                  { status: 'IN_PROGRESS' as ComplaintStatus, label: 'Dalam Proses', color: 'hover:border-cyan-500 active:bg-cyan-500/10' },
                  { status: 'RESOLVED' as ComplaintStatus, label: 'Selesai', color: 'hover:border-emerald-500 active:bg-emerald-500/10' },
                  { status: 'REJECTED' as ComplaintStatus, label: 'Ditolak', color: 'hover:border-rose-500 active:bg-rose-500/10' },
                ].map((item) => {
                  const isSelected = targetStatus === item.status;
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <button
                      key={item.status}
                      type="button"
                      onClick={() => setTargetStatus(item.status)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${isSelected
                          ? `${cfg.bg} border-current ring-2 ring-cyan-500/30`
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-current" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Response Note Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Catatan / Tanggapan untuk Tamu (Opsional):
              </label>
              <textarea
                rows={3}
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="Contoh: Petugas kebersihan sudah dikirim ke lokasi / Teknisi AC sedang dalam perjalanan."
                className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsResponseModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={handleSaveResponse}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
              >
                {updateStatusMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Simpan Tanggapan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Laporan Keluhan?"
        message="Apakah Anda yakin ingin menghapus laporan keluhan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Keluhan"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
