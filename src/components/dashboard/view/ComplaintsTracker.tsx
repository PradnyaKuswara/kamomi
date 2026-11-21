import React, { useState, useMemo } from 'react';
import { Button, Input, Modal, SegmentedControl, Textarea } from '@pradnyakuswara/ui';
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
  PENDING: { label: 'Menunggu', bg: 'bg-amber-500/10 text-[var(--color-warning)] dark:text-amber-400 border-amber-500/20', text: 'text-[var(--color-warning)]', icon: Clock },
  IN_PROGRESS: { label: 'Dalam Proses', bg: 'bg-[var(--color-primary-soft)] text-[var(--primary-accent)]  border-[var(--color-primary)]/20', text: 'text-[var(--primary-accent)]', icon: RefreshCw },
  RESOLVED: { label: 'Selesai', bg: 'bg-emerald-500/10 text-emerald-600  border-emerald-500/20', text: 'text-[var(--color-success-text)]', icon: CheckCircle2 },
  REJECTED: { label: 'Ditolak', bg: 'bg-rose-500/10 text-[var(--color-danger)]  border-rose-500/20', text: 'text-[var(--color-danger)]', icon: XCircle }
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
            <div className="p-2 rounded-xl bg-amber-500/10 text-[var(--color-warning)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Laporan Keluhan Tamu
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Kelola dan tanggapi laporan keluhan fasilitas yang dikirimkan oleh tamu kamar.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="self-start sm:self-center"
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Muat Ulang
        </Button>
      </div>

      {/* Control Bar (Filters & Search) */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-[var(--bg-surface)] p-3 rounded-2xl border border-[var(--border-color)] shadow-xs">
        {/* Status Filter Tabs */}
        <div className="overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <SegmentedControl
            size="sm"
            aria-label="Filter status keluhan"
            value={activeStatusTab}
            onValueChange={(v) => {
              setActiveStatusTab(v);
              setPage(0);
            }}
            options={[
              { value: 'ALL', label: 'Semua Status' },
              { value: 'PENDING', label: 'Menunggu' },
              { value: 'IN_PROGRESS', label: 'Dalam Proses' },
              { value: 'RESOLVED', label: 'Selesai' },
              { value: 'REJECTED', label: 'Ditolak' },
            ]}
          />
        </div>

        {/* Search Bar */}
        <div className="relative min-w-60">
          <Input size="sm" leftIcon={<Search className="h-4 w-4" />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari kamar, nama, atau isi keluhan..." />
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-[var(--text-muted)] space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--primary-accent)]" />
            <p className="text-xs font-medium">Memuat daftar keluhan...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              {searchQuery ? 'Tidak ada keluhan yang cocok dengan pencarian' : 'Tidak ada laporan keluhan'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
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
                      <span className="px-2.5 py-0.5 rounded-lg bg-[var(--color-primary-soft)] text-[var(--primary-accent)] text-xs font-black">
                        Kamar {c.roomNumber}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        {CATEGORY_LABELS[c.category] || c.category}
                      </span>

                      <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 ml-auto md:ml-0">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>

                    {/* Guest info */}
                    {(c.guestName || c.guestContact) && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                        {c.guestName && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[var(--text-primary)]">
                            <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            {c.guestName}
                          </span>
                        )}
                        {c.guestContact && (
                          <a
                            href={`https://wa.me/${c.guestContact.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[var(--primary-accent)] hover:underline font-medium"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {c.guestContact}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Complaint Description */}
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                      "{c.description}"
                    </p>

                    {/* Host Response Note (if available) */}
                    {c.responseNote && (
                      <div className="flex items-start gap-2 text-xs bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl text-[var(--text-primary)]">
                        <MessageSquare className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[var(--color-warning)] dark:text-amber-400">Tanggapan Pengelola: </span>
                          <span>{c.responseNote}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-row md:flex-col items-end gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border-subtle)]">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.bg}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusCfg.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button variant="primary" size="sm"
                        onClick={() => handleOpenResponseModal(c)}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Tanggapi / Status</span>
                      </Button>

                      <Button variant="secondary" size="sm" aria-label="Hapus Keluhan"
                        onClick={() => {
                          setDeleteTargetId(c.id);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Hapus Keluhan" leftIcon={<Trash2 className="w-4 h-4" />} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>
              Halaman <strong>{page + 1}</strong> dari <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))} leftIcon={<ChevronLeft className="w-4 h-4" />} />
              <Button variant="ghost" size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)} leftIcon={<ChevronRight className="w-4 h-4" />} />
            </div>
          </div>
        )}
      </div>

      {/* Modal Tanggapi / Edit Status */}
      {isResponseModalOpen && selectedComplaint && (
        <Modal
          open
          onClose={() => setIsResponseModalOpen(false)}
          size="md"
          title={`Tanggapi Keluhan Kamar ${selectedComplaint.roomNumber}`}
          footer={
            <>
              <Button type="button" variant="ghost" onClick={() => setIsResponseModalOpen(false)}>
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveResponse}
                isLoading={updateStatusMutation.isPending}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Simpan Tanggapan
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            {/* Original issue summary */}
            <div className="bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-bold text-[var(--primary-accent)] uppercase">
                  {CATEGORY_LABELS[selectedComplaint.category] || selectedComplaint.category}
                </span>
                <span>{formatDateTime(selectedComplaint.createdAt)}</span>
              </div>
              <p className="text-xs text-[var(--text-primary)] font-medium">
                "{selectedComplaint.description}"
              </p>
            </div>

            {/* Status Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-primary)]">
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
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/40'
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
              <Textarea
                label="Catatan / Tanggapan untuk Tamu (Opsional)"
                rows={3}
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="Contoh: Petugas kebersihan sudah dikirim ke lokasi / Teknisi AC sedang dalam perjalanan."
              />
            </div>
          </div>
        </Modal>
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
