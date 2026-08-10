import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Wind, Tv, Thermometer, Lightbulb, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { FormInput } from '../../input/FormInput';
import { FormSelect } from '../../input/FormSelect';
import ConfirmationModal from '../../modal/ConfirmationModal';
import Pagination from '../../ui/Pagination';
import { toast } from '../../../hooks/useToast';
import { useUserData } from '../../../hooks/useUserData';
import {
  useGuidesQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
  type FacilityGuideRequest,
} from '../../../rest/useFacilityGuide';
import type { FacilityGuide } from '../../../types/facility-guide';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

export default function FacilityGuidesList() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <FacilityGuidesListContent />
    </QueryClientProvider>
  );
}

function FacilityGuidesListContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(5);

  // Queries & Mutations
  const { data: response, isLoading: isLoadingGuides, isError } = useGuidesQuery(propertyId, page, size);
  const guidesPage = response?.data;
  const guides = guidesPage?.content || [];

  const createMutation = useCreateGuideMutation(propertyId);
  const updateMutation = useUpdateGuideMutation(propertyId);
  const deleteMutation = useDeleteGuideMutation(propertyId);

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<FacilityGuide | null>(null);
  const [deleteGuideId, setDeleteGuideId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Wind');
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);

  const iconOptions = [
    { value: 'Wind', label: 'AC / Air Conditioner (Wind)' },
    { value: 'Tv', label: 'Smart TV (Tv)' },
    { value: 'Thermometer', label: 'Water Heater (Thermometer)' },
    { value: 'Wifi', label: 'Wi-Fi / Internet (Wifi)' },
    { value: 'Lock', label: 'Smart Lock / Keamanan (Lock)' },
    { value: 'Key', label: 'Kunci / Akses Pintu (Key)' },
    { value: 'Coffee', label: 'Ketel / Kopi Maker (Coffee)' },
    { value: 'Refrigerator', label: 'Kulkas / Pendingin (Refrigerator)' },
    { value: 'Utensils', label: 'Peralatan Masak / Makan (Utensils)' },
    { value: 'Flame', label: 'Kompor / Pemanas Gas (Flame)' },
    { value: 'Plug', label: 'Stop Kontak / Charger (Plug)' },
    { value: 'Speaker', label: 'Speaker / Audio System (Speaker)' },
    { value: 'Lightbulb', label: 'Lampu / Elektronik Lain (Lightbulb)' },
  ];

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Anda harus memiliki setidaknya satu hunian (property) untuk dapat mengelola panduan fasilitas.
        </p>
      </div>
    );
  }

  const resetForm = () => {
    setName('');
    setIcon('Wind');
    setTitle('');
    setSteps(['']);
    setEditingGuide(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (guide: FacilityGuide) => {
    setEditingGuide(guide);
    setName(guide.name);
    setIcon(guide.icon || 'Wind');
    setTitle(guide.title);
    setSteps(guide.steps && guide.steps.length > 0 ? [...guide.steps] : ['']);
    setIsFormOpen(true);
  };

  // Steps array modifiers
  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const removeStepField = (index: number) => {
    if (steps.length === 1) {
      setSteps(['']);
      return;
    }
    const updated = steps.filter((_, idx) => idx !== index);
    setSteps(updated);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) {
      toast.error('Nama Fasilitas dan Judul Panduan wajib diisi.');
      return;
    }

    const filteredSteps = steps.map(s => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      toast.error('Panduan harus memiliki minimal 1 langkah pengoperasian.');
      return;
    }

    const payload: FacilityGuideRequest = {
      name,
      icon,
      title,
      steps: filteredSteps,
    };

    try {
      if (editingGuide) {
        await updateMutation.mutateAsync({ guideId: editingGuide.id, data: payload });
        toast.success('Panduan fasilitas berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Panduan fasilitas baru berhasil ditambahkan!');
        setPage(0);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan panduan fasilitas.');
    }
  };

  const handleDelete = async () => {
    if (!deleteGuideId) return;
    try {
      await deleteMutation.mutateAsync(deleteGuideId);
      toast.success('Panduan fasilitas berhasil dihapus!');
      setDeleteGuideId(null);
      if (guides.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus panduan fasilitas.');
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon || Lightbulb;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Master Panduan Fasilitas
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Konfigurasi langkah-langkah pengoperasian barang elektronik / fasilitas kamar untuk membantu tamu Anda.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Panduan
        </button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Daftar Panduan Aktif ({guidesPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingGuides ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Memuat data panduan...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-rose-500 text-xs font-semibold">
              Gagal memuat data panduan fasilitas.
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400">Belum ada panduan fasilitas yang terdaftar.</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                Silakan buat panduan pertama Anda untuk AC, TV, atau Water Heater dengan menekan tombol "Tambah Panduan" di atas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {guides.map((guide) => {
                  const Icon = getIcon(guide.icon);
                  return (
                    <div
                      key={guide.id}
                      className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 flex justify-between items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                            {guide.name} — <span className="text-slate-400 font-normal">{guide.title}</span>
                          </h4>
                          <div className="flex flex-col gap-1 pt-1">
                            {guide.steps.map((step, idx) => (
                              <p key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1">
                                <span className="font-bold text-cyan-600 shrink-0">{idx + 1}.</span>
                                <span>{step}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(guide)}
                          className="text-slate-400 hover:text-cyan-500 transition-colors p-1 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteGuideId(guide.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {guidesPage && (
                <Pagination
                  page={page}
                  size={size}
                  totalPages={guidesPage.totalPages}
                  totalElements={guidesPage.totalElements}
                  onPageChange={setPage}
                  itemName="panduan"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                {editingGuide ? 'Edit Panduan Fasilitas' : 'Tambah Panduan Baru'}
              </h3>
              <p className="text-[10px] text-slate-400">
                Lengkapi nama fasilitas, icon representatif, serta langkah-langkah penggunaan di bawah ini.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nama Fasilitas"
                  placeholder="Contoh: Pendingin Ruangan (AC)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

              <FormSelect
                label="Pilihan Icon"
                required
                value={icon}
                onChange={(val) => setIcon(val)}
                options={iconOptions}
              />
              </div>

              <FormInput
                label="Judul Panduan"
                placeholder="Contoh: Panduan Pengoperasian AC"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Dynamic steps section */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Langkah-Langkah Penggunaan <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-600 w-4 shrink-0">{idx + 1}</span>
                      <input
                        type="text"
                        placeholder={`Langkah ke-${idx + 1}...`}
                        value={step}
                        onChange={(e) => handleStepChange(idx, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveStep(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                          title="Pindahkan Ke Atas"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, 'down')}
                          disabled={idx === steps.length - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                          title="Pindahkan Ke Bawah"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStepField(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                          title="Hapus Langkah"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addStepField}
                  className="mt-2 text-cyan-600 hover:text-cyan-500 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah Langkah Baru
                </button>
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
                  Simpan Panduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for delete */}
      <ConfirmationModal
        isOpen={deleteGuideId !== null}
        onClose={() => setDeleteGuideId(null)}
        onConfirm={handleDelete}
        title="Hapus Panduan Fasilitas?"
        message="Panduan ini akan dihapus secara permanen dari dashboard dan guestbook kamar Anda. Tindakan ini tidak dapat diurungkan."
        confirmText="Hapus Panduan"
        cancelText="Batal"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
