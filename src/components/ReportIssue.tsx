import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { Send, CheckCircle2 } from 'lucide-react';

interface ReportIssueProps {
  open: boolean;
  onClose: () => void;
  roomNumber?: string;
}

export default function ReportIssue({ open, onClose, roomNumber = "102" }: ReportIssueProps) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) return;
    
    // Simulate sending report
    console.log("Submitting report:", { roomNumber, category, description });
    setSuccessOpen(true);
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
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
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="category-label" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Kategori Keluhan</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Kategori Keluhan"
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#06b6d4',
                  },
                  '.MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                <MenuItem value="wifi">Masalah Koneksi Wi-Fi</MenuItem>
                <MenuItem value="ac">AC Kurang Dingin / Mati</MenuItem>
                <MenuItem value="plumbing">Keran Bocor / Sumbat Toilet</MenuItem>
                <MenuItem value="cleaning">Kamar Kurang Bersih</MenuItem>
                <MenuItem value="other">Lain-lain</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Detail Masalah"
              placeholder="Jelaskan detail keluhan atau kerusakan di kamar Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              size="small"
              slotProps={{
                inputLabel: {
                  style: { color: 'rgba(255, 255, 255, 0.5)' }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#06b6d4',
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: '16px' }}>
            <Button 
              onClick={onClose} 
              sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              disabled={!category || !description}
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
              Kirim Keluhan
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
