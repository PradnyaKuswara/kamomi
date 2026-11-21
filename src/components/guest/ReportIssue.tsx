import React, { useState } from 'react';
import { Alert, Button, Modal } from '@pradnyakuswara/ui';
import ToastContainer from '../layout/ToastContainer';
import { toast } from '../../hooks/useToast';
import { Send, User } from 'lucide-react';
import { FormInput, FormTextarea } from '../input/FormInput.tsx';
import { InputPhone } from '../input/InputPhone.tsx';
import { FormSelect, type Option } from '../input/FormSelect.tsx';

import { useCreatePublicComplaintMutation } from '../../rest/useComplaint';

interface ReportIssueProps {
  open: boolean;
  onClose: () => void;
  roomNumber?: string;
  roomCode?: string;
}

const CATEGORY_OPTIONS: Option[] = [
  { value: 'wifi', label: 'Masalah Koneksi Wi-Fi' },
  { value: 'ac', label: 'AC Kurang Dingin / Mati' },
  { value: 'plumbing', label: 'Keran Bocor / Sumbat Toilet' },
  { value: 'cleaning', label: 'Kamar Kurang Bersih' },
  { value: 'other', label: 'Lain-lain' },
];

function ReportIssueModal({ open, onClose, roomNumber = "102", roomCode }: ReportIssueProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createComplaintMutation = useCreatePublicComplaintMutation();
  const loading = createComplaintMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) return;

    setErrorMessage(null);

    // Mode demo (/guest): tanpa kode kamar, simulasikan sukses tanpa memanggil API.
    if (!roomCode) {
      toast.success('Demo: keluhan terkirim. Pada kamar sungguhan, laporan langsung masuk ke dashboard pengelola.');
      setCategory('');
      setDescription('');
      setGuestName('');
      setGuestContact('');
      onClose();
      return;
    }

    createComplaintMutation.mutate(
      {
        roomCode: roomCode || '',
        category,
        description,
        guestName: guestName.trim() || undefined,
        guestContact: guestContact.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success('Keluhan berhasil dikirim ke Host! Petugas akan segera memeriksa kamar Anda.');
            setCategory('');
            setDescription('');
            setGuestName('');
            setGuestContact('');
            onClose();
          } else {
            setErrorMessage(res.message || 'Gagal mengirim keluhan. Silakan coba lagi.');
          }
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Terjadi kesalahan koneksi ke server.');
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      title={`Laporkan Keluhan Kamar ${roomNumber}`}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            type="submit"
            form="report-issue-form"
            disabled={!category || !description}
            isLoading={loading}
            leftIcon={<Send className="h-4 w-4" />}
          >
            Kirim Keluhan
          </Button>
        </>
      }
    >
      <form id="report-issue-form" onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Nama Tamu"
            placeholder="Misal: Andi"
            icon={User}
            value={guestName}
            disabled={loading}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <InputPhone
            label="No. HP / WA"
            placeholder="81234567..."
            value={guestContact}
            disabled={loading}
            onChange={(e) => setGuestContact(e.target.value)}
          />
        </div>

        <FormSelect
          label="Kategori Keluhan"
          required
          placeholder="Pilih Kategori..."
          options={CATEGORY_OPTIONS}
          value={category}
          disabled={loading}
          onChange={(val) => setCategory(val)}
        />

        <FormTextarea
          label="Detail Masalah"
          required
          rows={4}
          placeholder="Jelaskan detail keluhan atau kerusakan di kamar Anda..."
          value={description}
          disabled={loading}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </Modal>
  );
}

export default function ReportIssue(props: ReportIssueProps) {
  return (
    <>
      <ReportIssueModal {...props} />
      <ToastContainer />
    </>
  );
}
