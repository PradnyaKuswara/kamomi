import React, { useState } from 'react';
import { Button, Modal } from '@pradnyakuswara/ui';
import { Plus, Edit2, Trash2, HelpCircle, Phone, Mail, MessageCircle, User, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { FormInput } from '../../input/FormInput';
import { FormSelect } from '../../input/FormSelect';
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
        <HelpCircle className="h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
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
        return <MessageCircle className="h-4 w-4 text-[var(--color-success-text)]" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'PHONE':
        return <Phone className="h-4 w-4 text-[var(--primary-accent)]" />;
      default:
        return <User className="h-4 w-4 text-[var(--text-secondary)]" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'WHATSAPP':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800  border-emerald-200/50 dark:border-emerald-900/30';
      case 'EMAIL':
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30';
      case 'PHONE':
        return 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-800  border-cyan-200/50 dark:border-cyan-900/30';
      default:
        return 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Master Kontak Properti
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Kelola kontak cepat seperti pengelola kost, keamanan, laundry, dan layanan penting lainnya agar mudah dihubungi oleh tamu/penghuni.
          </p>
        </div>

        <Button variant="primary" size="sm" className="self-start sm:self-center"
          onClick={handleOpenCreate}
        >
          <Plus className="h-4 w-4" />
          Tambah Kontak
        </Button>
      </div>

      <div className="space-y-4">
        <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">
              Daftar Kontak Aktif ({contactsPage?.totalElements || 0})
            </h3>
          </div>

          {isLoadingContacts ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[var(--text-muted)]">Memuat data kontak...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-[var(--color-danger)] text-xs font-semibold">
              Gagal memuat data kontak hunian.
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 space-y-3 border border-dashed border-[var(--border-color)] rounded-xl">
              <p className="text-xs text-[var(--text-muted)]">Belum ada kontak aktif.</p>
              <p className="text-[10px] text-[var(--text-muted)] max-w-xs mx-auto">
                Silakan tambahkan kontak baru dengan menekan tombol "Tambah Kontak" di atas.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="p-3.5 bg-[var(--bg-subtle)] rounded-xl shrink-0">
                        {getContactIcon(contact.contactType)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-md ${getBadgeColor(contact.contactType)}`}
                          >
                            {contact.contactType}
                          </span>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-slate-800 text-[var(--primary-accent)] border border-cyan-200/20 dark:border-slate-700/30">
                            {contact.role}
                          </span>
                          <h4 className="font-extrabold text-xs text-[var(--text-primary)]">
                            {contact.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] font-medium">
                          {contact.contactValue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <a
                        href={contact.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)] dark:hover:text-cyan-400 text-[10px] font-bold transition-all"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Uji Link
                      </a>

                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(contact)} aria-label="Edit" title="Edit" leftIcon={<Edit2 className="h-3.5 w-3.5" />} />
                      <Button variant="ghost" size="sm" onClick={() => setDeleteContactId(contact.id)} aria-label="Hapus" title="Hapus" leftIcon={<Trash2 className="h-3.5 w-3.5 text-[var(--color-danger)]" />} />
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
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        size="md"
        title={editingContact ? 'Edit Kontak Properti' : 'Tambah Kontak Baru'}
        description="Isi detail kontak di bawah ini. Nilai default link dan label tombol aksi akan otomatis dibuat berdasarkan tipe yang dipilih."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
              Batal
            </Button>
            <Button type="submit" form="dashboard-form" isLoading={createMutation.isPending || updateMutation.isPending}>
              Simpan Kontak
            </Button>
          </>
        }
      >
        <form id="dashboard-form" onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Nama Kontak"
                placeholder="Contoh: Ibu Linda, Pak Slamet (Security)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Peran / Jabatan"
                  required
                  value={roleSelect}
                  onChange={(val) => setRoleSelect(val)}
                  options={[
                    { value: 'Pengelola Kost / Host', label: 'Pengelola Kost / Host' },
                    { value: 'Keamanan / Security', label: 'Keamanan / Security' },
                    { value: 'Laundry', label: 'Laundry' },
                    { value: 'Lainnya', label: 'Lainnya (Tulis Sendiri)' },
                  ]}
                />

                <FormSelect
                  label="Tipe Kontak"
                  required
                  value={contactType}
                  onChange={(val) => setContactType(val)}
                  options={[
                    { value: 'WHATSAPP', label: 'WhatsApp' },
                    { value: 'EMAIL', label: 'Email' },
                    { value: 'PHONE', label: 'Telepon Biasa' },
                  ]}
                />
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

              <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-wider block">
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
        </form>
      </Modal>

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
