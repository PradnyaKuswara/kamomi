import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { FormInput, FormTextarea } from '../ui/FormInput';
import ConfirmationModal from '../ui/ConfirmationModal';
import Pagination from '../ui/Pagination';
import { toast } from '../../hooks/useToast';
import { useUserData } from '../../hooks/useUserData';
import {
  useRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} from '../../rest/useRule';
import type { Rule, RuleRequest } from '../../types/rule';
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 max-w-sm">
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Master Template Aturan Properti
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Kelola aturan properti Anda. Perubahan akan disinkronisasikan ke guestbook kamar secara real-time.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}  
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Tata Tertib
        </button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Daftar Tata Tertib Aktif ({rulesPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingRules ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Memuat data tata tertib...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-rose-500 text-xs font-semibold">
              Gagal memuat data tata tertib hunian.
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400">Belum ada tata tertib aktif.</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                Silakan tambahkan aturan tata tertib baru dengan menekan tombol "Tambah Tata Tertib" di atas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 flex justify-between items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            rule.category === 'Wajib'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                              : rule.category === 'Larangan'
                              ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {rule.category}
                        </span>
                        {!rule.isActive && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                            Nonaktif
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">#{rule.sequence}</span>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {rule.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="text-slate-400 hover:text-cyan-500 transition-colors p-1 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteRuleId(rule.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                {editingRule ? 'Edit Tata Tertib' : 'Tambah Tata Tertib Baru'}
              </h3>
              <p className="text-[10px] text-slate-400">
                Isi detail aturan di bawah ini untuk disimpan sebagai bagian dari tata tertib hunian.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Judul Aturan"
                placeholder="Contoh: Waktu Tenang (Quiet Hours)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kategori Aturan <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all border-slate-200 dark:border-slate-800"
                >
                  <option value="Wajib">Wajib</option>
                  <option value="Larangan">Larangan</option>
                  <option value="Ketentuan">Ketentuan</option>
                </select>
              </div>

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
                  <label className="flex items-center gap-2 cursor-pointer select-none py-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Aktifkan Aturan Ini
                    </span>
                  </label>
                </div>
              </div>

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
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Simpan Tata Tertib
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
