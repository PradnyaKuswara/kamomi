import React, { useState } from 'react';
import { Button, Checkbox, Modal } from '@pradnyakuswara/ui';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { FormInput, FormTextarea } from '../../input/FormInput';
import { FormSelect } from '../../input/FormSelect';
import ConfirmationModal from '../../modal/ConfirmationModal';
import Pagination from '../../ui/Pagination';
import { toast } from '../../../hooks/useToast';
import { useUserData } from '../../../hooks/useUserData';
import {
  useRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} from '../../../rest/useRule';
import type { Rule, RuleRequest } from '../../../types/rule';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

export default function RulesTemplate() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <RulesTemplateContent />
    </QueryClientProvider>
  );
}

function RulesTemplateContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(5);

  // Queries & Mutations
  const { data: response, isLoading: isLoadingRules, isError } = useRulesQuery(propertyId, page, size);
  const rulesPage = response?.data;
  const rules = rulesPage?.content || [];

  const createMutation = useCreateRuleMutation(propertyId);
  const updateMutation = useUpdateRuleMutation(propertyId);
  const deleteMutation = useDeleteRuleMutation(propertyId);

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deleteRuleId, setDeleteRuleId] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wajib');
  const [description, setDescription] = useState('');
  const [sequence, setSequence] = useState(1);
  const [isActive, setIsActive] = useState(true);

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          Anda harus memiliki setidaknya satu hunian (property) untuk dapat mengelola tata tertib kamar.
        </p>
      </div>
    );
  }

  const resetForm = () => {
    setTitle('');
    setCategory('Wajib');
    setDescription('');
    setSequence((rulesPage?.totalElements || 0) + 1);
    setIsActive(true);
    setEditingRule(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (rule: Rule) => {
    setEditingRule(rule);
    setTitle(rule.title);
    setCategory(rule.category);
    setDescription(rule.description);
    setSequence(rule.sequence);
    setIsActive(rule.isActive);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Judul dan Deskripsi tata tertib wajib diisi.');
      return;
    }

    const payload: RuleRequest = {
      title,
      description,
      category,
      sequence,
      isActive,
    };

    try {
      if (editingRule) {
        await updateMutation.mutateAsync({ ruleId: editingRule.id, data: payload });
        toast.success('Tata tertib berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Tata tertib baru berhasil ditambahkan!');
        // Reset to first page to see the new entry
        setPage(0);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan tata tertib.');
    }
  };

  const handleDelete = async () => {
    if (!deleteRuleId) return;
    try {
      await deleteMutation.mutateAsync(deleteRuleId);
      toast.success('Tata tertib berhasil dihapus!');
      setDeleteRuleId(null);
      // Adjust page if deleting the last element on a page
      if (rules.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus tata tertib.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Master Template Aturan Properti
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Kelola aturan properti Anda. Perubahan akan disinkronisasikan ke guestbook kamar secara real-time.
          </p>
        </div>

        <Button variant="primary" size="sm" className="self-start sm:self-center"
          onClick={handleOpenCreate}
        >
          <Plus className="h-4 w-4" />
          Tambah Tata Tertib
        </Button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">
              Daftar Tata Tertib Aktif ({rulesPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingRules ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[var(--text-muted)]">Memuat data tata tertib...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-[var(--color-danger)] text-xs font-semibold">
              Gagal memuat data tata tertib hunian.
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-[var(--border-color)] rounded-xl">
              <p className="text-xs text-[var(--text-muted)]">Belum ada tata tertib aktif.</p>
              <p className="text-[10px] text-[var(--text-muted)] max-w-xs mx-auto">
                Silakan tambahkan aturan tata tertib baru dengan menekan tombol "Tambah Tata Tertib" di atas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-between items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${rule.category === 'Wajib'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 '
                              : rule.category === 'Larangan'
                                ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 '
                                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                            }`}
                        >
                          {rule.category}
                        </span>
                        {!rule.isActive && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                            Nonaktif
                          </span>
                        )}
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">#{rule.sequence}</span>
                        <h4 className="font-bold text-xs text-[var(--text-primary)]">
                          {rule.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(rule)} aria-label="Edit" title="Edit" leftIcon={<Edit2 className="h-3.5 w-3.5" />} />
                      <Button variant="ghost" size="sm" onClick={() => setDeleteRuleId(rule.id)} aria-label="Hapus" title="Hapus" leftIcon={<Trash2 className="h-3.5 w-3.5 text-[var(--color-danger)]" />} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {rulesPage && (
                <Pagination
                  page={page}
                  size={size}
                  totalPages={rulesPage.totalPages}
                  totalElements={rulesPage.totalElements}
                  onPageChange={setPage}
                  itemName="aturan"
                />
              )}
            </>

          )}
        </div>
      </div>

      {/* Slide-over or Modal Form */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        size="md"
        title={editingRule ? 'Edit Tata Tertib' : 'Tambah Tata Tertib Baru'}
        description="Isi detail aturan di bawah ini untuk disimpan sebagai bagian dari tata tertib hunian."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="dashboard-form" isLoading={createMutation.isPending || updateMutation.isPending}>
              Simpan Tata Tertib
            </Button>
          </>
        }
      >
        <form id="dashboard-form" onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Judul Aturan"
                placeholder="Contoh: Waktu Tenang (Quiet Hours)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <FormSelect
                label="Kategori Aturan"
                required
                value={category}
                onChange={(val) => setCategory(val)}
                options={[
                  { value: 'Wajib', label: 'Wajib' },
                  { value: 'Larangan', label: 'Larangan' },
                  { value: 'Ketentuan', label: 'Ketentuan' },
                ]}
              />

              <FormTextarea
                label="Deskripsi Lengkap"
                placeholder="Jelaskan secara detail mengenai aturan ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Nomor Urut (Sequence)"
                  type="number"
                  min={1}
                  value={sequence}
                  onChange={(e) => setSequence(parseInt(e.target.value) || 1)}
                  required
                />

                <div className="flex flex-col justify-end pb-1">
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    label="Aktifkan Aturan Ini"
                  />
                </div>
              </div>
        </form>
      </Modal>

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteRuleId !== null}
        onClose={() => setDeleteRuleId(null)}
        onConfirm={handleDelete}
        title="Hapus Tata Tertib?"
        message="Aturan ini akan dihapus secara permanen dari hunian dan guestbook kamar Anda. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
