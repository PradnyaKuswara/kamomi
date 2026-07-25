import { useState, useEffect } from 'react';
import WiFiCard from './WiFiCard.tsx';
import HouseRules from './HouseRules.tsx';
import FacilityGuides from './FacilityGuides.tsx';
import QuickContact from './QuickContact.tsx';
import QRExporter from './QRExporter.tsx';
import {
  Eye,
  Edit,
  FileText,
  Wifi,
  HeartHandshake,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function RoomEditor() {
  const [activePane, setActivePane] = useState('editor'); // editor, exporter, guest-preview
  const [propertyName, setPropertyName] = useState('Kost Adem Tentrem');
  const [roomNumber, setRoomNumber] = useState('102');
  const [wifiSsid, setWifiSsid] = useState('AdemTentrem_102');
  const [wifiPass, setWifiPass] = useState('supersecurepass');

  // Custom rules state
  const [rules, setRules] = useState([
    {
      id: 1,
      title: 'Waktu Tenang (Quiet Hours)',
      desc: 'Jam tenang berlaku mulai pukul 22.00 hingga 06.00 WIB. Mohon kecilkan volume suara musik, TV, atau obrolan untuk menghormati penghuni kamar lain.',
      category: 'Wajib',
    },
    {
      id: 2,
      title: 'Kebijakan Tamu Menginap',
      desc: 'Tamu non-penghuni dilarang menginap tanpa persetujuan pengelola. Kunjungan tamu maksimal dibatasi hingga pukul 21.00 WIB.',
      category: 'Ketentuan',
    },
    {
      id: 3,
      title: 'Dilarang Merokok & Narkoba',
      desc: 'Kamar dibebaskan dari asap rokok (Vape/Rokok konvensional). Dilarang keras membawa narkoba.',
      category: 'Larangan',
    },
  ]);

  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCat, setNewRuleCat] = useState('Wajib');

  // Load local storage property name if exists
  useEffect(() => {
    const savedProp = localStorage.getItem('property_name');
    if (savedProp) {
      setPropertyName(savedProp);
    }

    // Get room parameter from url
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomNumber(roomParam);
      setWifiSsid(`AdemTentrem_${roomParam}`);
    }
  }, []);

  const addRule = () => {
    if (!newRuleTitle || !newRuleDesc) return;
    setRules([
      ...rules,
      {
        id: Date.now(),
        title: newRuleTitle,
        desc: newRuleDesc,
        category: newRuleCat,
      },
    ]);
    setNewRuleTitle('');
    setNewRuleDesc('');
  };

  const removeRule = (id: number) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const simulatedGuestUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/guest?room=${roomNumber}&ssid=${encodeURIComponent(wifiSsid)}&pass=${encodeURIComponent(wifiPass)}`
      : `https://kamomi.id/guest?room=${roomNumber}`;

  return (
    <div className="space-y-6">
      {/* Editor Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
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

        {/* Tab Buttons */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl max-w-fit border border-slate-200/10">
          <button
            onClick={() => setActivePane('editor')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
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
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
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
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activePane === 'guest-preview'
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview Tamu
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
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
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
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-indigo-500" />
                  Kelola Tata Tertib (Aturan)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const saved = localStorage.getItem('master_rules_template');
                    if (saved) {
                      setRules(JSON.parse(saved));
                    } else {
                      alert('Belum ada master template tersimpan. Silakan buat master template terlebih dahulu di dashboard menu Master Template.');
                    }
                  }}
                  className="px-3 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-[10px] font-bold transition-all"
                >
                  Terapkan Master Template
                </button>
              </div>

              <div className="space-y-3">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex justify-between items-start p-3 bg-white/45 dark:bg-slate-900/40 rounded-xl border border-slate-200/20"
                  >
                    <div className="max-w-[85%]">
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
                    <button
                      onClick={() => removeRule(rule.id)}
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Rule Form */}
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/10">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Tambah Aturan Baru
                </span>
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
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-bold text-[10px] hover:opacity-90 transition-all flex items-center gap-1"
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
