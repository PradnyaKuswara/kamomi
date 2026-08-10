import React, { useState } from 'react';
import { Home, Building2, Briefcase, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Loader2, Hotel } from 'lucide-react';
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
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Glow Decor */}
        <div className="absolute -top-16 -left-16 h-36 w-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 h-36 w-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Loading Overlay saat Submit Properti */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
            <Loader2 className="h-10 w-10 text-cyan-500 animate-spin mb-3" />
            <p className="text-sm font-extrabold text-slate-800 dark:text-white">Menyimpan Properti Baru...</p>
            <p className="text-xs text-slate-400 mt-1">Harap tunggu sebentar, menyiapkan dashboard Anda ✨</p>
          </div>
        )}

        {/* Header & Step Indicator */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-cyan-500 tracking-wider">
                Setup Properti Baru
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">Langkah {step} dari 3</span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-cyan-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* STEP 1: Pilih Tipe Properti */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Pilih Jenis Properti</h3>
              <p className="text-xs text-slate-400 mt-1">
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
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/20'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-cyan-500" />}
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
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Identitas Properti</h3>
              <p className="text-xs text-slate-400 mt-1">
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
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Alamat Properti</h3>
              <p className="text-xs text-slate-400 mt-1">
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

        {/* Wizard Navigation Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Lanjutkan
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan Properti...
                </>
              ) : (
                'Simpan Properti & Buka Dashboard ✨'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
