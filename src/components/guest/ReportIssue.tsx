import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Snackbar,
  Alert
} from '@mui/material';
import { Send, CheckCircle2, User } from 'lucide-react';
import { FormInput, FormTextarea } from '../input/FormInput.tsx';
import { InputPhone } from '../input/InputPhone.tsx';
import { FormSelect, type Option } from '../input/FormSelect.tsx';

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

export default function ReportIssue({ open, onClose, roomNumber = "102", roomCode }: ReportIssueProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) return;
    
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/api/public/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCode: roomCode || '',
          category,
          description,
          guestName: guestName.trim() || undefined,
          guestContact: guestContact.trim() || undefined,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSuccessOpen(true);
        setCategory('');
        setDescription('');
        setGuestName('');
        setGuestContact('');
        onClose();
      } else {
        setErrorMessage(json.message || 'Gagal mengirim keluhan. Silakan coba lagi.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={loading ? undefined : onClose}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              padding: '8px',
              bgcolor: 'var(--color-slate-900, #0f172a)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundImage: 'none',
            }
          }
        }}
      >
        <DialogTitle className="font-bold text-white text-lg">
          Laporkan Keluhan Kamar {roomNumber}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4">
            {errorMessage && (
              <Alert 
                severity="error" 
                onClose={() => setErrorMessage(null)}
                sx={{ 
                  bgcolor: 'rgba(239, 68, 68, 0.1)', 
                  color: '#fca5a5',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
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
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            <Button 
              onClick={onClose} 
              disabled={loading}
              sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              disabled={!category || !description || loading}
              sx={{ 
                bgcolor: '#06b6d4', 
                color: '#0f172a',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: '#22d3ee',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.2)'
                }
              }}
              startIcon={<Send className="h-4 w-4" />}
            >
              {loading ? 'Sending...' : 'Kirim Keluhan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={successOpen} 
        autoHideDuration={4000} 
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          severity="success" 
          onClose={() => setSuccessOpen(false)}
          sx={{ 
            bgcolor: '#064e3b', 
            color: '#a7f3d0',
            borderRadius: '12px',
            border: '1px solid #047857'
          }}
        >
          Keluhan berhasil dikirim ke Host! Petugas akan segera memeriksa kamar Anda.
        </Alert>
      </Snackbar>
    </>
  );
}
