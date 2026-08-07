import React, { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Phone, Mail, MessageCircle, User, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { FormInput } from '../../input/FormInput';
import ConfirmationModal from '../../modal/ConfirmationModal';
import Pagination from '../../ui/Pagination';
import { toast } from '../../../hooks/useToast';
import { useUserData } from '../../../hooks/useUserData';
import {
  useContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from '../../../rest/useContact';
import type { Contact, ContactRequest } from '../../../types/contact';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryClient = new QueryClient();

export default function ContactsList() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <ContactsListContent />
    </QueryClientProvider>
  );
}

function ContactsListContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(5);

  // Queries & Mutations
  const { data: response, isLoading: isLoadingContacts, isError } = useContactsQuery(propertyId, page, size);
  const contactsPage = response?.data;
  const contacts = contactsPage?.content || [];

  const createMutation = useCreateContactMutation(propertyId);
  const updateMutation = useUpdateContactMutation(propertyId);
  const deleteMutation = useDeleteContactMutation(propertyId);

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [roleSelect, setRoleSelect] = useState('Pengelola Kost / Host');
  const [customRole, setCustomRole] = useState('');
  const [contactType, setContactType] = useState('WHATSAPP');
  const [contactValue, setContactValue] = useState('');
  const [actionText, setActionText] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [customLink, setCustomLink] = useState('');

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Anda harus memiliki setidaknya satu hunian (property) untuk dapat mengelola master kontak.
        </p>
      </div>
    );
  }

  const resetForm = () => {
    setName('');
    setRoleSelect('Pengelola Kost / Host');
    setCustomRole('');
    setContactType('WHATSAPP');
    setContactValue('');
    setActionText('');
    setColor('');
    setIcon('');
    setCustomLink('');
    setEditingContact(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);

    const standardRoles = ['Pengelola Kost / Host', 'Keamanan / Security', 'Laundry'];
    if (standardRoles.includes(contact.role)) {
      setRoleSelect(contact.role);
      setCustomRole('');
    } else {
      setRoleSelect('Lainnya');
      setCustomRole(contact.role);
    }

    setContactType(contact.contactType);
    setContactValue(contact.contactValue);
    setActionText(contact.actionText || '');
    setColor(contact.color || '');
    setIcon(contact.icon || '');
    setCustomLink(contact.link || '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalRole = roleSelect === 'Lainnya' ? customRole : roleSelect;

    if (!name.trim() || !finalRole.trim() || !contactValue.trim()) {
      toast.error('Nama, Peran/Role, dan Detail kontak wajib diisi.');
      return;
    }

    const payload: ContactRequest = {
      name,
      role: finalRole,
      contactType,
      contactValue,
      actionText: actionText.trim() ? actionText : undefined,
      color: color.trim() ? color : undefined,
      icon: icon.trim() ? icon : undefined,
      link: customLink.trim() ? customLink : undefined,
    };

    try {
      if (editingContact) {
        await updateMutation.mutateAsync({ contactId: editingContact.id, data: payload });
        toast.success('Kontak berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Kontak baru berhasil ditambahkan!');
        setPage(0);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan kontak.');
    }
  };

  const handleDelete = async () => {
    if (!deleteContactId) return;
    try {
      await deleteMutation.mutateAsync(deleteContactId);
      toast.success('Kontak berhasil dihapus!');
      setDeleteContactId(null);
      if (contacts.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus kontak.');
    }
  };

  const getContactIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WHATSAPP':
        return <MessageCircle className="h-4 w-4 text-emerald-500" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'PHONE':
        return <Phone className="h-4 w-4 text-cyan-500" />;
      default:
        return <User className="h-4 w-4 text-slate-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WHATSAPP':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30';
      case 'EMAIL':
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30';
      case 'PHONE':
        return 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Master Kontak Properti
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Kelola kontak cepat seperti pengelola kost, keamanan, laundry, dan layanan penting lainnya agar mudah dihubungi oleh tamu/penghuni.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Kontak
        </button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Daftar Kontak Aktif ({contactsPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingContacts ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Memuat data kontak...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-rose-500 text-xs font-semibold">
              Gagal memuat data kontak hunian.
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400">Belum ada kontak aktif.</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                Silakan tambahkan kontak baru dengan menekan tombol "Tambah Kontak" di atas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="p-3.5 bg-slate-100 dark:bg-slate-950/60 rounded-xl shrink-0">
                        {getContactIcon(contact.contactType)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-md ${getBadgeColor(contact.contactType)}`}
                          >
                            {contact.contactType}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-cyan-200/20 dark:border-slate-700/30">
                            {contact.role}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                            {contact.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {contact.contactValue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <a
                        href={contact.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 text-[10px] font-bold transition-all"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Uji Link
                      </a>

                      <button
                        onClick={() => handleOpenEdit(contact)}
                        className="text-slate-400 hover:text-cyan-500 transition-colors p-1 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteContactId(contact.id)}
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
              {contactsPage && (
                <Pagination
                  page={page}
                  size={size}
                  totalPages={contactsPage.totalPages}
                  totalElements={contactsPage.totalElements}
                  onPageChange={setPage}
                  itemName="kontak"
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
                {editingContact ? 'Edit Kontak Properti' : 'Tambah Kontak Baru'}
              </h3>
              <p className="text-[10px] text-slate-400">
                Isi detail kontak di bawah ini. Nilai default link dan label tombol aksi akan otomatis dibuat berdasarkan tipe yang dipilih.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Nama Kontak"
                placeholder="Contoh: Ibu Linda, Pak Slamet (Security)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Peran / Jabatan <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    value={roleSelect}
                    onChange={(e) => setRoleSelect(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all border-slate-200 dark:border-slate-800"
                  >
                    <option value="Pengelola Kost / Host">Pengelola Kost / Host</option>
                    <option value="Keamanan / Security">Keamanan / Security</option>
                    <option value="Laundry">Laundry</option>
                    <option value="Lainnya">Lainnya (Tulis Sendiri)</option>
                  </select>
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tipe Kontak <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all border-slate-200 dark:border-slate-800"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Telepon Biasa</option>
                  </select>
                </div>
              </div>

              {roleSelect === 'Lainnya' && (
                <FormInput
                  label="Tulis Jabatan Kustom"
                  placeholder="Contoh: CS Internet, Kebersihan, Delivery"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  required
                />
              )}

              <FormInput
                label="Nomor Telepon / Email"
                placeholder={
                  contactType === 'EMAIL'
                    ? 'Contoh: pengelola@gmail.com'
                    : 'Contoh: 08123456789 (diawali 0 atau 62)'
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                required
              />

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">
                  Kustomisasi Tambahan (Opsional)
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Custom Teks Aksi"
                    placeholder="Contoh: Chat WA, Telp Langsung"
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                  />

                  <FormInput
                    label="Custom Link URL"
                    placeholder="Masukkan custom URL jika ada"
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                  />
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
                  Simpan Kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={deleteContactId !== null}
        onClose={() => setDeleteContactId(null)}
        onConfirm={handleDelete}
        title="Hapus Kontak?"
        message="Kontak ini akan dihapus secara permanen dari hunian. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isDanger={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
