import { useState, useEffect } from 'react';
import { Button, SegmentedControl } from '@pradnyakuswara/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserData } from '../../../hooks/useUserData';
import { useRoomQuery, useUpdateRoomMutation } from '../../../rest/useRoom';
import {
  useRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} from '../../../rest/useRule';
import WiFiCard from '../../guest/WiFiCard.tsx';
import HouseRules from '../../guest/HouseRules.tsx';
import FacilityGuides from '../../guest/FacilityGuides.tsx';
import QuickContact from '../../guest/QuickContact.tsx';
import QRExporter from '../modal/QRExporter.tsx';
import { FormInput, FormTextarea } from '../../input/FormInput.tsx';
import { FormSelect } from '../../input/FormSelect.tsx';
import { toast } from '../../../hooks/useToast';
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

  // QR Design visual states
  const [customTitle, setCustomTitle] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [cardColor, setCardColor] = useState('cyan');
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'luxury' | 'glass' | 'neon' | 'retro'>('modern');
  const [labelRoom, setLabelRoom] = useState('NOMOR KAMAR');

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

      // Populate visual design states from DB
      if (rm.qrDesign) {
        const qd = rm.qrDesign;
        if (qd.customTitle) setCustomTitle(qd.customTitle);
        if (qd.customInstruction) setCustomInstruction(qd.customInstruction);
        if (qd.showLogo !== undefined && qd.showLogo !== null) setShowLogo(qd.showLogo);
        if (qd.cardColor) setCardColor(qd.cardColor);
        if (qd.template) setTemplate(qd.template as any);
        if (qd.labelRoom) setLabelRoom(qd.labelRoom);
      }
    }
  }, [roomData]);

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Hunian Tidak Ditemukan</h3>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          Silakan konfigurasikan hunian Anda terlebih dahulu.
        </p>
      </div>
    );
  }

  if (isLoadingRoom || roomId === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center space-y-4">
        <Loader2 className="h-8 w-8 text-[var(--primary-accent)] animate-spin" />
        <p className="text-xs text-[var(--text-muted)]">Memuat data kamar...</p>
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

  const removeRule = (ruleId: number) => {
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setRules(updatedRules);
    toast.success('Aturan dilepas dari kamar di editor. Klik "Simpan Info Kamar" untuk menyimpan.');
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

  const applyMasterTemplate = () => {
    const list = masterRulesData?.data?.content;
    if (list && list.length > 0) {
      setRules(
        list.map((r) => ({
          id: r.id,
          title: r.title,
          desc: r.description || '',
          category: r.category,
          sequence: r.sequence,
        }))
      );
      toast.success('Master template diterapkan di editor. Klik "Simpan Info Kamar" untuk menyimpan.');
    } else {
      toast.error('Belum ada master template tata tertib.');
    }
  };

  const resetToOriginalRules = () => {
    if (roomData?.data?.rules) {
      setRules(
        roomData.data.rules.map((r) => ({
          id: r.id,
          title: r.title,
          desc: r.description || '',
          category: r.category,
          sequence: r.sequence,
        }))
      );
      toast.success('Konfigurasi tata tertib dikembalikan. Klik "Simpan Info Kamar" jika ingin menyimpan.');
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
          isActive: roomData?.data?.isActive,
          qrDesign: {
            customTitle,
            customInstruction,
            showLogo,
            cardColor,
            template,
            labelRoom,
          },
        },
      });
      toast.success('Informasi Wi-Fi & Kamar serta Desain QR berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data kamar.');
    }
  };

  const roomCode = roomData?.data?.code;
  const simulatedGuestUrl = roomCode
    ? (typeof window !== 'undefined'
      ? `${window.location.origin}/r/${roomCode}`
      : `https://kamomi.id/r/${roomCode}`)
    : (typeof window !== 'undefined'
      ? `${window.location.origin}/guest?room=${roomId}`
      : `https://kamomi.id/guest?room=${roomId}`);

  return (
    <div className="space-y-6">
      {/* Editor Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/rooms"
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-secondary)] transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </a>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Edit Kamar & Desain QR
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Mengedit {propertyName} • Kamar {roomNumber}
            </p>
          </div>
        </div>

        {/* Tab Buttons & Save */}
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            size="sm"
            aria-label="Mode editor"
            value={activePane}
            onValueChange={(v) => setActivePane(v as typeof activePane)}
            options={[
              { value: 'editor', label: 'Edit Info', icon: <Edit className="h-4 w-4" /> },
              { value: 'exporter', label: 'Cetak QR Card', icon: <FileText className="h-4 w-4" /> },
              { value: 'guest-preview', label: 'Preview Tamu', icon: <Eye className="h-4 w-4" /> },
            ]}
          />

          <Button variant="primary" size="sm"
            onClick={handleSaveInfo}
            disabled={updateRoomMutation.isPending}
          >
            {updateRoomMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Info Kamar
          </Button>
        </div>
      </div>

      {/* Pane Content */}
      {activePane === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Property & Room Info */}
            <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-4">
              <h3 className="font-bold text-[var(--text-primary)] text-base">
                Informasi Kamar & Properti
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nama Properti"
                  value={propertyName}
                  disabled
                />
                <FormInput
                  label="Nomor Kamar"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Wifi Edit Info */}
            <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-4">
              <h3 className="font-bold text-[var(--text-primary)] text-base flex items-center gap-2">
                <Wifi className="h-5 w-5 text-[var(--primary-accent)]" />
                Pengaturan Wi-Fi Kamar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nama SSID WiFi"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                />
                <FormInput
                  label="Password WiFi"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                />
              </div>
            </div>

            {/* Edit House Rules */}
            <div className="glassmorphic rounded-2xl p-6 border border-[var(--border-color)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-[var(--text-primary)] text-base flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-indigo-500" />
                  Kelola Tata Tertib (Aturan)
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm"
                    type="button"
                    onClick={applyMasterTemplate}
                  >
                    Terapkan Master Template
                  </Button>
                  <Button variant="secondary" size="sm"
                    type="button"
                    onClick={resetToOriginalRules}
                  >
                    Batalkan Perubahan
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-87.5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {rules.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-4">
                    Belum ada tata tertib khusus untuk kamar ini. Klik "Terapkan Master Template" atau tambahkan aturan di bawah.
                  </p>
                ) : (
                  rules.map((rule) => {
                    const isEditing = editingRuleId === rule.id;

                    return (
                      <div
                        key={rule.id}
                        className="flex flex-col gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-slate-200/20"
                      >
                        {isEditing ? (
                          <div className="space-y-3 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                              <div className="sm:col-span-2">
                                <FormInput
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="Nama Aturan"
                                />
                              </div>
                              <FormSelect
                                value={editCat}
                                onChange={(val) => setEditCat(val)}
                                options={[
                                  { value: 'Wajib', label: 'Wajib' },
                                  { value: 'Larangan', label: 'Larangan' },
                                  { value: 'Ketentuan', label: 'Ketentuan' },
                                ]}
                              />
                            </div>
                            <FormTextarea
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              rows={2}
                              placeholder="Deskripsi Aturan"
                            />
                            <div className="flex items-center justify-end gap-1.5">
                              <Button variant="outline" size="sm"
                                onClick={cancelEditRule} leftIcon={<X className="h-4.5 w-4.5" />} />
                              <Button variant="primary" size="sm"
                                onClick={() => saveEditRule(rule.id)}
                              >
                                <Check className="h-4.5 w-4.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start w-full">
                            <div className="max-w-[80%]">
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                                {rule.category}
                              </span>
                              <h5 className="font-bold text-xs text-[var(--text-primary)] mt-1">
                                {rule.title}
                              </h5>
                              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                                {rule.desc}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm"
                                onClick={() => startEditRule(rule)}
                              >
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm"
                                onClick={() => removeRule(rule.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add New Rule Form */}
              <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] space-y-3 bg-slate-50/10">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[var(--text-secondary)] block">
                    Tambahkan Tata Tertib Kustom Ke Kamar
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)]">
                    (Tip: Simpan rule baru ini di Master Template agar bisa dipakai di kamar lain)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  <div className="sm:col-span-2">
                    <FormInput
                      placeholder="Nama Aturan"
                      value={newRuleTitle}
                      onChange={(e) => setNewRuleTitle(e.target.value)}
                    />
                  </div>
                  <FormSelect
                    value={newRuleCat}
                    onChange={(val) => setNewRuleCat(val)}
                    options={[
                      { value: 'Wajib', label: 'Wajib' },
                      { value: 'Larangan', label: 'Larangan' },
                      { value: 'Ketentuan', label: 'Ketentuan' },
                    ]}
                  />
                </div>
                <FormTextarea
                  placeholder="Detail Aturan..."
                  rows={2}
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                />
                <Button variant="primary" size="sm"
                  type="button"
                  onClick={addRule}
                >
                  <Sparkles className="h-3 w-3" />
                  Tambahkan Aturan
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Realtime Preview Section */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-4">
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                <Eye className="h-4 w-4" /> Realtime Preview
              </div>
              <WiFiCard ssid={wifiSsid} password={wifiPass} />
              <div className="p-4 bg-slate-900/20 dark:bg-slate-900/40 rounded-2xl border border-[var(--border-color)] text-center">
                <span className="text-xs text-[var(--text-muted)] block">
                  Link QR mengarah ke:
                </span>
                <span className="text-[10px] text-[var(--primary-accent)] font-mono block select-all mt-1 truncate">
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
          roomId={roomId}
          cardColor={cardColor}
          setCardColor={setCardColor}
          template={template}
          setTemplate={setTemplate}
          customTitle={customTitle}
          setCustomTitle={setCustomTitle}
          labelRoom={labelRoom}
          setLabelRoom={setLabelRoom}
          customInstruction={customInstruction}
          setCustomInstruction={setCustomInstruction}
          showLogo={showLogo}
          setShowLogo={setShowLogo}
        />
      )}

      {activePane === 'guest-preview' && (
        <div className="max-w-md mx-auto bg-slate-950 text-white rounded-3xl border-8 border-slate-900 overflow-hidden shadow-2xl min-h-160 flex flex-col justify-between">
          {/* Header Mobile Bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <span className="text-xs font-bold">Kamar {roomNumber}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary-accent)]">
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
          <div className="bg-slate-900/50 p-4 border-t border-slate-800 text-center text-[10px] text-[var(--text-secondary)]">
            © {propertyName} • Powered by Kamomi.id
          </div>
        </div>
      )}
    </div>
  );
}
