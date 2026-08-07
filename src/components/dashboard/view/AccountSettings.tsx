import React, { useState } from 'react';
import { User, Mail, Lock, Building, MapPin, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useUserData } from '../../../hooks/useUserData';
import DashboardLayout from '../layout/DashboardLayout';
import { toast } from '../../../hooks/useToast';
import { FormInput } from '../../input/FormInput';

export default function AccountSettings() {
  return (
    <DashboardLayout activeMenu="settingsaccount">
      <AccountSettingsContent />
    </DashboardLayout>
  );
}

function AccountSettingsContent() {
  const { user, setUserData } = useUserData();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'property'>('profile');

  const [name, setName] = useState(user.name || '');
  const [email] = useState(user.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const currentProp = user.properties && user.properties.length > 0 ? user.properties[0] : null;
  const [propertyName, setPropertyName] = useState(currentProp?.name || '');
  const [address, setAddress] = useState(currentProp?.address || '');
  const [city, setCity] = useState(currentProp?.city || '');
  const [province, setProvince] = useState(currentProp?.province || '');
  const [postalCode, setPostalCode] = useState(currentProp?.postalCode || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setUserData({ name });
      setIsSaving(false);
      toast.success('Profil berhasil diperbarui!');
    }, 500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Masukkan kata sandi saat ini.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSaving(false);
      toast.success('Kata sandi berhasil diperbarui!');
    }, 500);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (currentProp) {
        const updatedProps = [...(user.properties || [])];
        updatedProps[0] = {
          ...updatedProps[0],
          name: propertyName,
          address,
          city,
          province,
          postalCode,
        };
        setUserData({ properties: updatedProps });
      }
      setIsSaving(false);
      toast.success('Informasi properti berhasil diperbarui!');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Pengaturan Akun & Properti</h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola profil pribadi, kata sandi keamanan, dan data properti utama Anda.
        </p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <User className="h-4 w-4" />
          Profil Saya
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="h-4 w-4" />
          Keamanan & Password
        </button>

        <button
          onClick={() => setActiveTab('property')}
          className={`pb-3 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'property'
              ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          Data Properti Utama
        </button>
      </div>

      {/* TAB 1: PROFIL SAYA */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-16 w-16 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              {name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">{name || 'Nama Pengguna'}</h3>
              <p className="text-xs text-slate-400">{email}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border ${user.isEmailVerified ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                <CheckCircle2 className="h-3 w-3" /> {user.isEmailVerified ? 'Akun Terverifikasi' : 'Akun Tidak Terverifikasi'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <FormInput
              label="Nama Lengkap"
              type="text"
              required
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormInput
              label="Alamat Email (Permanen)"
              type="email"
              disabled
              icon={Mail}
              value={email}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KEAMANAN & PASSWORD */}
      {activeTab === 'security' && (
        <form onSubmit={handleSavePassword} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-extrabold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="h-4 w-4 text-cyan-500" /> Ubah Kata Sandi Akun
          </div>

          <FormInput
            label="Kata Sandi Saat Ini"
            type="password"
            required
            icon={Lock}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Kata Sandi Baru"
              type="password"
              required
              icon={Lock}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />

            <FormInput
              label="Konfirmasi Kata Sandi Baru"
              type="password"
              required
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DATA PROPERTI UTAMA */}
      {activeTab === 'property' && (
        <form onSubmit={handleSaveProperty} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-extrabold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
            <Building className="h-4 w-4 text-cyan-500" /> Edit Detail Properti Utama
          </div>

          <FormInput
            label="Nama Properti / Hunian"
            type="text"
            required
            icon={Building}
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            placeholder="Contoh: Kost Adem Tentrem Residence"
          />

          <FormInput
            label="Alamat Lengkap"
            type="text"
            required
            icon={MapPin}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jl. Anggrek No. 45"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormInput
              label="Kota / Kabupaten"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Yogyakarta"
            />

            <FormInput
              label="Provinsi"
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="D.I. Yogyakarta"
            />

            <FormInput
              label="Kode Pos"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="55281"
              className="font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Menyimpan Properti...' : 'Simpan Data Properti'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
