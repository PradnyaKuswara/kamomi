import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserData } from '../hooks/useUserData';
import { useRoomQuery, useUpdateRoomMutation } from '../rest/useRoom';
import {
  useRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} from '../rest/useRule';
import WiFiCard from './WiFiCard.tsx';
import HouseRules from './HouseRules.tsx';
import FacilityGuides from './FacilityGuides.tsx';
import QuickContact from './QuickContact.tsx';
import QRExporter from './QRExporter.tsx';
import { toast } from '../hooks/useToast';
import {
  Eye,
  Edit,
  FileText,
  Wifi,
  HeartHandshake,
  ArrowLeft,
  Sparkles,
  Save,
  HelpCircle,
  Loader2,
  Trash2,
  Check,
  X,
} from 'lucide-react';

const defaultQueryClient = new QueryClient();

export default function RoomEditor() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <RoomEditorContent />
    </QueryClientProvider>
  );
}

function RoomEditorContent() {
  const { user } = useUserData();
  const propertyId = user.properties?.[0]?.id;
  const propertyName = user.properties?.[0]?.name || 'Hunian Anda';

  // Get room ID from URL
  const [roomId, setRoomId] = useState<number | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomId(Number(roomParam));
    }
  }, []);

  // Queries & Mutations
  const { data: roomData, isLoading: isLoadingRoom } = useRoomQuery(
    propertyId,
    roomId || undefined
  );
  const { data: masterRulesData } = useRulesQuery(propertyId, 0, 100);
  const updateRoomMutation = useUpdateRoomMutation(propertyId);
  const createRuleMutation = useCreateRuleMutation(propertyId);
  const updateRuleMutation = useUpdateRuleMutation(propertyId);
  const deleteRuleMutation = useDeleteRuleMutation(propertyId);

  const [activePane, setActivePane] = useState('editor'); // editor, exporter, guest-preview
  const [roomNumber, setRoomNumber] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');

  // Local rules array list associated with room
  const [rules, setRules] = useState<any[]>([]);

  // Inline rule editing states
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState('Wajib');

  // New rule input states
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCat, setNewRuleCat] = useState('Wajib');

  // Populate local states when Room queries load
  useEffect(() => {
    if (roomData?.data) {
      const rm = roomData.data;
      setRoomNumber(rm.roomNumber);
      setWifiSsid(rm.wifiSsid);
      setWifiPass(rm.wifiPassword || '');
      if (rm.rules) {
        setRules(
          rm.rules.map((r) => ({
            id: r.id,
            title: r.title,
            desc: r.description || '',
            category: r.category,
            sequence: r.sequence,
          }))
        );
      }

    }
  }, [roomData]);

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Silakan konfigurasikan hunian Anda terlebih dahulu.
        </p>
      </div>
    );
  }

  if (isLoadingRoom || roomId === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
        <p className="text-xs text-slate-400">Memuat data kamar...</p>
      </div>
    );
  }

  const addRule = async () => {
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) {
      toast.error('Judul dan deskripsi tata tertib wajib diisi.');
      return;
    }

    try {
      const newRule = await createRuleMutation.mutateAsync({
        title: newRuleTitle,
        description: newRuleDesc,
        category: newRuleCat,
        isActive: true,
        sequence: rules.length + 1,
      });

      const newRules = [
        ...rules,
        {
          id: newRule.data.id,
          title: newRule.data.title,
          desc: newRule.data.description || '',
          category: newRule.data.category,
        },
      ];

      setRules(newRules);
      setNewRuleTitle('');
      setNewRuleDesc('');
      toast.success('Aturan baru berhasil ditambahkan! Klik "Simpan Info Kamar" untuk menyimpan perubahan.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan aturan baru.');
    }
  };

  const removeRule = async (ruleId: number) => {
    try {
      // 1. Filter out from room rules association first
      const updatedRules = rules.filter((r) => r.id !== ruleId);
      await updateRoomMutation.mutateAsync({
        roomId,
        data: {
          roomNumber,
          wifiSsid,
          wifiPassword: wifiPass || undefined,
          ruleIds: updatedRules.map((r) => r.id),
        },
      });

      // 2. Direct delete from database
      await deleteRuleMutation.mutateAsync(ruleId);
      setRules(updatedRules);
      toast.success('Aturan berhasil dihapus!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus aturan.');
    }
  };

  const startEditRule = (rule: any) => {
    setEditingRuleId(rule.id);
    setEditTitle(rule.title);
    setEditDesc(rule.desc);
    setEditCat(rule.category);
  };

  const cancelEditRule = () => {
    setEditingRuleId(null);
  };

  const saveEditRule = async (ruleId: number) => {
    if (!editTitle.trim() || !editDesc.trim()) {
      toast.error('Judul dan deskripsi tata tertib wajib diisi.');
      return;
    }

    try {
      const currentRule = rules.find((r) => r.id === ruleId);
      const seq = currentRule?.sequence || 0;

      // 1. Direct update in database
      await updateRuleMutation.mutateAsync({
        ruleId,
        data: {
          title: editTitle,
          description: editDesc,
          category: editCat,
          sequence: seq,
          isActive: true,
        },
      });

      // 2. Update local state
      setRules(
        rules.map((r) =>
          r.id === ruleId
            ? { ...r, title: editTitle, desc: editDesc, category: editCat }
            : r
        )
      );

      setEditingRuleId(null);
      toast.success('Aturan berhasil diperbarui!');

    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui aturan.');
    }
  };

  const applyMasterTemplate = async () => {
    const list = masterRulesData?.data?.content;
    if (list && list.length > 0) {
      const ruleIds = list.map((r) => r.id);
      try {
        await updateRoomMutation.mutateAsync({
          roomId,
          data: {
            roomNumber,
            wifiSsid,
            wifiPassword: wifiPass || undefined,
            ruleIds,
          },
        });
        setRules(
          list.map((r) => ({
            id: r.id,
            title: r.title,
            desc: r.description || '',
            category: r.category,
            sequence: r.sequence,
          }))
        );
        toast.success('Master template berhasil diterapkan ke kamar!');
      } catch (err: any) {
        toast.error('Gagal menerapkan master template.');
      }
    } else {
      toast.error('Belum ada master template tata tertib.');
    }
  };

  const resetToOriginalRules = async () => {
    if (roomData?.data?.rules) {
      const ruleIds = roomData.data.rules.map((r) => r.id);
      try {
        await updateRoomMutation.mutateAsync({
          roomId,
          data: {
            roomNumber,
            wifiSsid,
            wifiPassword: wifiPass || undefined,
            ruleIds,
          },
        });
        setRules(
          roomData.data.rules.map((r) => ({
            id: r.id,
            title: r.title,
            desc: r.description || '',
            category: r.category,
            sequence: r.sequence,
          }))
        );
        toast.success('Tata tertib kamar dikembalikan ke konfigurasi tersimpan.');
      } catch (err: any) {
        toast.error('Gagal mengembalikan perubahan.');
      }
    }
  };


  const handleSaveInfo = async () => {
    if (!roomNumber.trim() || !wifiSsid.trim()) {
      toast.error('Nomor Kamar dan SSID Wi-Fi wajib diisi.');
      return;
    }

    try {
      await updateRoomMutation.mutateAsync({
        roomId,
        data: {
          roomNumber,
          wifiSsid,
          wifiPassword: wifiPass || undefined,
          ruleIds: rules.map((r) => r.id),
        },
      });
      toast.success('Informasi Wi-Fi & Kamar berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data kamar.');
    }
  };

  const simulatedGuestUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/guest?room=${roomId}`
      : `https://kamomi.id/guest?room=${roomId}`;

  return (
    <div className="space-y-6">
      {/* Editor Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/rooms"
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </a>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Edit Kamar & Desain QR
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Mengedit {propertyName} • Kamar {roomNumber}
            </p>
          </div>
        </div>

        {/* Tab Buttons & Save */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/10">
            <button
              onClick={() => setActivePane('editor')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePane === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Edit className="h-4 w-4" />
              Edit Info
            </button>
            <button
              onClick={() => setActivePane('exporter')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePane === 'exporter'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              Cetak QR Card
            </button>
            <button
              onClick={() => setActivePane('guest-preview')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activePane === 'guest-preview'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview Tamu
            </button>
          </div>

          <button
            onClick={handleSaveInfo}
            disabled={updateRoomMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {updateRoomMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Info Kamar
          </button>
        </div>
      </div>

      {/* Pane Content */}
      {activePane === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Property & Room Info */}
            <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Informasi Kamar & Properti
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama Properti
                  </label>
                  <input
                    type="text"
                    value={propertyName}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nomor Kamar
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Wifi Edit Info */}
            <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                <Wifi className="h-5 w-5 text-cyan-500" />
                Pengaturan Wi-Fi Kamar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Nama SSID WiFi
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Password WiFi
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Edit House Rules */}
            <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-indigo-500" />
                  Kelola Tata Tertib (Aturan)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={applyMasterTemplate}
                    className="px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Terapkan Master Template
                  </button>
                  <button
                    type="button"
                    onClick={resetToOriginalRules}
                    className="px-3 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Batalkan Perubahan
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {rules.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    Belum ada tata tertib khusus untuk kamar ini. Klik "Terapkan Master Template" atau tambahkan aturan di bawah.
                  </p>
                ) : (
                  rules.map((rule) => {
                    const isEditing = editingRuleId === rule.id;

                    return (
                      <div
                        key={rule.id}
                        className="flex flex-col gap-3 p-3 bg-white/45 dark:bg-slate-900/40 rounded-xl border border-slate-200/20"
                      >
                        {isEditing ? (
                          <div className="space-y-3 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="sm:col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-cyan-500"
                              />
                              <select
                                value={editCat}
                                onChange={(e) => setEditCat(e.target.value)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 focus:ring-1 focus:ring-cyan-500"
                              >
                                <option value="Wajib">Wajib</option>
                                <option value="Larangan">Larangan</option>
                                <option value="Ketentuan">Ketentuan</option>
                              </select>
                            </div>
                            <textarea
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              rows={2}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-cyan-500"
                            />
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={cancelEditRule}
                                className="p-1 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-100 text-slate-500 cursor-pointer"
                              >
                                <X className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => saveEditRule(rule.id)}
                                className="p-1 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 cursor-pointer"
                              >
                                <Check className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start w-full">
                            <div className="max-w-[80%]">
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {rule.category}
                              </span>
                              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-1">
                                {rule.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                                {rule.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditRule(rule)}
                                className="text-[10px] text-cyan-600 hover:text-cyan-500 font-bold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeRule(rule.id)}
                                className="text-[10px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer flex items-center gap-0.5"
                              >
                                <Trash2 className="h-3 w-3" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add New Rule Form */}
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/10">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    Tambahkan Tata Tertib Kustom Ke Kamar
                  </span>
                  <span className="text-[9px] text-slate-400">
                    (Tip: Simpan rule baru ini di Master Template agar bisa dipakai di kamar lain)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nama Aturan"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-cyan-500"
                  />
                  <select
                    value={newRuleCat}
                    onChange={(e) => setNewRuleCat(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Larangan">Larangan</option>
                    <option value="Ketentuan">Ketentuan</option>
                  </select>
                </div>
                <textarea
                  placeholder="Detail Aturan..."
                  rows={2}
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-bold text-[10px] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  Tambahkan Aturan
                </button>
              </div>
            </div>
          </div>

          {/* Quick Realtime Preview Section */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Eye className="h-4 w-4" /> Realtime Preview
              </div>
              <WiFiCard ssid={wifiSsid} password={wifiPass} />
              <div className="p-4 bg-slate-900/20 dark:bg-slate-900/40 rounded-2xl border border-slate-200/20 dark:border-slate-800/40 text-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 block">
                  Link QR mengarah ke:
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono block select-all mt-1 truncate">
                  {simulatedGuestUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePane === 'exporter' && (
        <QRExporter
          propertyName={propertyName}
          roomNumber={roomNumber}
          guestUrl={simulatedGuestUrl}
        />
      )}

      {activePane === 'guest-preview' && (
        <div className="max-w-md mx-auto bg-slate-950 text-white rounded-3xl border-8 border-slate-900 overflow-hidden shadow-2xl min-h-160 flex flex-col justify-between">
          {/* Header Mobile Bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <span className="text-xs font-bold">Kamar {roomNumber}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
              {propertyName}
            </span>
          </div>

          {/* Guestroom body */}
          <div className="flex-1 p-5 space-y-6 overflow-y-auto max-h-125">
            <WiFiCard ssid={wifiSsid} password={wifiPass} />
            <HouseRules rules={rules} />
            <FacilityGuides />
            <QuickContact />
          </div>

          {/* Guest Footer */}
          <div className="bg-slate-900/50 p-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
            © {propertyName} • Powered by Kamomi.id
          </div>
        </div>
      )}
    </div>
  );
}
