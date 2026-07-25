import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';

const PRESETS = {
  kost: [
    { id: 1, title: 'Waktu Tenang (Quiet Hours)', desc: 'Jam tenang berlaku mulai pukul 22.00 hingga 06.00 WIB. Harap kecilkan volume suara musik/obrolan.', category: 'Wajib' },
    { id: 2, title: 'Kebijakan Tamu Menginap', desc: 'Tamu dilarang menginap tanpa persetujuan pengelola. Kunjungan tamu maksimal dibatasi hingga pukul 21.00 WIB.', category: 'Ketentuan' },
    { id: 3, title: 'Larangan Merokok & Narkoba', desc: 'Dilarang keras merokok di dalam kamar (rokok/vape). Pelanggaran dikenakan denda Rp 500.000.', category: 'Larangan' }
  ],
  homestay: [
    { id: 1, title: 'Waktu Check-Out', desc: 'Waktu batas check-out maksimal pukul 12.00 WIB. Keterlambatan tanpa info akan dikenakan biaya tambahan.', category: 'Ketentuan' },
    { id: 2, title: 'Penggunaan Dapur Bersama', desc: 'Bersihkan kembali peralatan memasak setelah digunakan demi kenyamanan tamu lain.', category: 'Wajib' },
    { id: 3, title: 'Keamanan Kunci Kamar', desc: 'Harap pastikan pintu terkunci saat meninggalkan ruangan. Kehilangan kunci dikenakan biaya pengganti.', category: 'Wajib' }
  ],
  villa: [
    { id: 1, title: 'Penggunaan Kolam Renang', desc: 'Kolam renang dapat digunakan maksimal hingga pukul 21.00 WIB. Anak-anak wajib didampingi orang dewasa.', category: 'Wajib' },
    { id: 2, title: 'Kebijakan Kerusakan Barang', desc: 'Segala kerusakan fasilitas villa oleh kelalaian tamu akan dikenakan biaya ganti rugi sesuai harga barang.', category: 'Ketentuan' },
    { id: 3, title: 'Dilarang Membawa Hewan', desc: 'Hewan peliharaan dilarang keras dibawa masuk ke dalam area villa tanpa persetujuan awal.', category: 'Larangan' }
  ]
};

export default function RulesTemplate() {
  const [selectedType, setSelectedType] = useState('kost');
  const [rules, setRules] = useState(PRESETS.kost);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load existing custom template if any
    const saved = localStorage.getItem('master_rules_template');
    if (saved) {
      try {
        setRules(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleApplyPreset = (type: keyof typeof PRESETS) => {
    setSelectedType(type);
    setRules(PRESETS[type]);
  };

  const handleSaveAsMaster = () => {
    localStorage.setItem('master_rules_template', JSON.stringify(rules));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Master Template Tata Tertib
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Pilih atau buat template standar agar tidak perlu menginput satu per satu untuk setiap kamar baru.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Preset Chooser */}
        <div className="space-y-4">
          <div className="glassmorphic rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pilih Kategori Properti
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => handleApplyPreset('kost')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedType === 'kost'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🏢 Template Kost Eksklusif
              </button>
              <button
                onClick={() => handleApplyPreset('homestay')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedType === 'homestay'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🏡 Template Homestay / Guesthouse
              </button>
              <button
                onClick={() => handleApplyPreset('villa')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedType === 'villa'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🌴 Template Villa & Resort
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Template Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glassmorphic rounded-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Detail Master Template Aktif
              </h3>
              
              <button
                onClick={handleSaveAsMaster}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Tersimpan!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Simpan Master Template
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        rule.category === 'Wajib' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' :
                        rule.category === 'Larangan' ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {rule.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{rule.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{rule.desc}</p>
                  </div>
                  
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="text-rose-500 hover:text-rose-600 font-bold text-[10px]"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
