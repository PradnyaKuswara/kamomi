import React, { useState } from 'react';
import { Button, Input, Modal } from '@pradnyakuswara/ui';
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
        <HelpCircle className="h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
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
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Master Panduan Fasilitas
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Konfigurasi langkah-langkah pengoperasian barang elektronik / fasilitas kamar untuk membantu tamu Anda.
          </p>
        </div>

        <Button variant="primary" size="sm" className="self-start sm:self-center"
          onClick={handleOpenCreate}
        >
          <Plus className="h-4 w-4" />
          Tambah Panduan
        </Button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">
              Daftar Panduan Aktif ({guidesPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingGuides ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[var(--text-muted)]">Memuat data panduan...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-[var(--color-danger)] text-xs font-semibold">
              Gagal memuat data panduan fasilitas.
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-[var(--border-color)] rounded-xl">
              <p className="text-xs text-[var(--text-muted)]">Belum ada panduan fasilitas yang terdaftar.</p>
              <p className="text-[10px] text-[var(--text-muted)] max-w-xs mx-auto">
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
                      className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-between items-start gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl text-[var(--primary-accent)] shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-[var(--text-primary)]">
                            {guide.name} — <span className="text-[var(--text-muted)] font-normal">{guide.title}</span>
                          </h4>
                          <div className="flex flex-col gap-1 pt-1">
                            {guide.steps.map((step, idx) => (
                              <p key={idx} className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1">
                                <span className="font-bold text-[var(--primary-accent)] shrink-0">{idx + 1}.</span>
                                <span>{step}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Button variant="ghost" size="sm" aria-label="Edit"
                          onClick={() => handleOpenEdit(guide)}
                          title="Edit" leftIcon={<Edit2 className="h-3.5 w-3.5" />} />
                        <Button variant="ghost" size="sm" aria-label="Hapus"
                          onClick={() => setDeleteGuideId(guide.id)}
                          title="Hapus" leftIcon={<Trash2 className="h-3.5 w-3.5" />} />
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
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        size="lg"
        title={editingGuide ? 'Edit Panduan Fasilitas' : 'Tambah Panduan Baru'}
        description="Lengkapi nama fasilitas, icon representatif, serta langkah-langkah penggunaan di bawah ini."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="dashboard-form" isLoading={createMutation.isPending || updateMutation.isPending}>
              Simpan Panduan
            </Button>
          </>
        }
      >
        <form id="dashboard-form" onSubmit={handleSubmit} className="space-y-4">
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
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Langkah-Langkah Penggunaan <span className="text-[var(--color-danger)] ml-0.5">*</span>
                </label>
                <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--primary-accent)] w-4 shrink-0">{idx + 1}</span>
                      <Input size="sm" placeholder={`Langkah ke-${idx + 1}...`} value={step} onChange={(e) => handleStepChange(idx, e.target.value)} required />
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" aria-label="Pindahkan Ke Atas"
                          type="button"
                          onClick={() => moveStep(idx, 'up')}
                          disabled={idx === 0}
                          title="Pindahkan Ke Atas" leftIcon={<ArrowUp className="h-3.5 w-3.5" />} />
                        <Button variant="ghost" size="sm" aria-label="Pindahkan Ke Bawah"
                          type="button"
                          onClick={() => moveStep(idx, 'down')}
                          disabled={idx === steps.length - 1}
                          title="Pindahkan Ke Bawah" leftIcon={<ArrowDown className="h-3.5 w-3.5" />} />
                        <Button variant="ghost" size="sm" aria-label="Hapus Langkah"
                          type="button"
                          onClick={() => removeStepField(idx)}
                          title="Hapus Langkah" leftIcon={<Trash2 className="h-3.5 w-3.5" />} />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm"
                  type="button"
                  onClick={addStepField}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah Langkah Baru
                </Button>
              </div>
        </form>
      </Modal>

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
