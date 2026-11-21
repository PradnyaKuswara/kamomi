import React, { useState } from 'react';
import { Alert, Button, Modal, Progress, Spinner } from '@pradnyakuswara/ui';
import { Home, Building2, Briefcase, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Hotel } from 'lucide-react';
import { useCreatePropertyMutation } from '../../../rest/useProperty';
import { useUserData } from '../../../hooks/useUserData';
import { toast } from '../../../hooks/useToast';
import { FormInput, FormTextarea } from '../../input/FormInput';

interface PropertyWizardModalProps {
  onComplete: (propertyName: string) => void;
}

export default function PropertyWizardModal({ onComplete }: PropertyWizardModalProps) {
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState('HOUSE'); // HOUSE, APARTMENT, OFFICE
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { mutateAsync: createProperty, isPending } = useCreatePropertyMutation();
  const { setUserData, user } = useUserData();

  const propertyTypes = [
    {
      id: 'HOUSE',
      title: 'Kost / Rumah Sewa',
      desc: 'Kost harian, bulanan, atau rumah kontrakan',
      icon: Home,
    },
    {
      id: 'APARTMENT',
      title: 'Apartemen / Homestay',
      desc: 'Unit apartemen atau penginapan homestay',
      icon: Building2,
    },
    {
      id: 'HOTEL',
      title: 'Hotel / Villa',
      desc: 'Hotel atau penginapan villa',
      icon: Hotel,
    },
    {
      id: 'OFFICE',
      title: 'Kantor / Ruang Kerja',
      desc: 'Ruang kerja bersama, coworking, atau kantor',
      icon: Briefcase,
    },
  ];

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1 && !propertyType) {
      setErrorMsg('Harap pilih tipe hunian/properti');
      return;
    }
    if (step === 2 && !name.trim()) {
      setErrorMsg('Harap isi nama properti Anda');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!address.trim() || !city.trim()) {
      setErrorMsg('Harap isi alamat lengkap dan kota properti Anda');
      return;
    }

    try {
      const res = await createProperty({
        propertyType,
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        province: province.trim() || 'Indonesia',
        postalCode: postalCode.trim(),
      });

      if (res.success && res.data) {
        // Update user store
        const updatedProperties = [...(user.properties || []), res.data];
        setUserData({ properties: updatedProperties });

        // Tampilkan Toast Sukses
        toast.success(`Properti "${res.data.name}" berhasil dibuat! 🎉`);

        onComplete(res.data.name);
      } else {
        const msg = res.message || 'Gagal menyimpan properti';
        setErrorMsg(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan sistem';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <Modal
      open
      onClose={() => {}}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      showCloseButton={false}
      size="lg"
      title="Setup Properti Baru"
      description={`Langkah ${step} dari 3`}
      footer={
        <div className="flex w-full justify-between items-center">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isPending}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Kembali
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleNextStep} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Lanjutkan
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} isLoading={isPending}>
              {isPending ? 'Menyimpan Properti...' : 'Simpan Properti & Buka Dashboard'}
            </Button>
          )}
        </div>
      }
    >
      <div className="relative space-y-5">
        {isPending && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-[var(--bg-surface)]/90">
            <Spinner size="lg" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">Menyimpan Properti Baru...</p>
            <p className="text-xs text-[var(--text-muted)]">Harap tunggu sebentar, menyiapkan dashboard Anda</p>
          </div>
        )}

        <Progress value={step} max={3} size="sm" />

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        {/* STEP 1: Pilih Tipe Properti */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Pilih Jenis Properti</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Pilih kategori hunian yang paling sesuai untuk properti Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {propertyTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = propertyType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPropertyType(item.id)}
                    className={`p-4 rounded-[var(--radius-lg)] border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? 'bg-[var(--color-primary-soft)] border-[var(--color-primary)] text-[var(--color-on-primary-soft)]'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--border-strong)]'
                      }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-[var(--radius-md)] ${isSelected ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--text-primary)]">{item.title}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Nama & Deskripsi Properti */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Identitas Properti</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Masukkan nama properti dan deskripsi singkat yang akan tampil bagi penghuni.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <FormInput
                label="Nama Properti / Hunian"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kost Adem Tentrem Residence"
              />

              <FormTextarea
                label="Deskripsi Singkat (Opsional)"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Hunian nyaman dekat kampus, fasilitas Wi-Fi super kencang 24 jam."
              />
            </div>
          </div>
        )}

        {/* STEP 3: Alamat Properti */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Alamat Properti</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Lengkapi alamat lokasi hunian untuk pencetakan kartu QR & rekaman sistem.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <FormInput
                label="Alamat Lengkap"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Anggrek No. 45, RT 02/RW 05"
              />

              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  label="Kota / Kab"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Yogyakarta"
                />
                <FormInput
                  label="Provinsi"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="D.I. Yogyakarta"
                />
                <FormInput
                  label="Kode Pos"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="55281"
                  className="font-mono"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
