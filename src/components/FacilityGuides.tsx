import React, { useState } from 'react';
import { BookOpen, Tv, Wind, Thermometer, ArrowRight, Lightbulb } from 'lucide-react';

export default function FacilityGuides({ guides = null }) {
  const defaultGuides = [
    {
      id: "ac",
      name: "Pendingin Ruangan (AC)",
      icon: Wind,
      title: "Panduan Pengoperasian AC",
      steps: [
        "Arahkan remote AC ke unit indoor dan tekan tombol berwarna MERAH untuk menyalakan.",
        "Atur suhu ideal pada kisaran 22°C - 24°C untuk kenyamanan optimal.",
        "Pastikan semua jendela dan pintu tertutup rapat agar dingin merata.",
        "Harap matikan AC saat meninggalkan kamar untuk menghemat energi."
      ]
    },
    {
      id: "heater",
      name: "Water Heater",
      icon: Thermometer,
      title: "Panduan Mandi Air Hangat",
      steps: [
        "Nyalakan saklar listrik Water Heater di luar kamar mandi (lampu indikator merah akan menyala).",
        "Tunggu sekitar 10-15 menit agar air di dalam tangki memanas.",
        "Putar tuas keran shower ke arah KIRI (tanda merah) untuk mengalirkan air hangat.",
        "Putar perlahan ke arah KANAN untuk menyesuaikan suhu dengan air dingin."
      ]
    },
    {
      id: "tv",
      name: "Smart TV",
      icon: Tv,
      title: "Panduan Menggunakan Smart TV",
      steps: [
        "Gunakan remote hitam untuk menghidupkan TV dengan menekan tombol Power merah.",
        "Pilih input 'HDMI 1' atau 'Home' untuk mengakses menu aplikasi.",
        "TV sudah terkoneksi dengan internet kamar. Buka YouTube atau Netflix.",
        "Untuk menonton Netflix, Anda dapat masuk menggunakan akun pribadi Anda."
      ]
    }
  ];

  const activeGuides = guides || defaultGuides;
  const [activeTab, setActiveTab] = useState(activeGuides[0]?.id || "ac");

  const currentGuide = activeGuides.find(g => g.id === activeTab);

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-950/50 rounded-xl text-cyan-600 dark:text-cyan-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Panduan Fasilitas</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Cara mudah menggunakan fasilitas di dalam kamar Anda</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-6 overflow-x-auto">
        {activeGuides.map((guide) => {
          const Icon = guide.icon || Lightbulb;
          const isActive = activeTab === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setActiveTab(guide.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/20' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {guide.name}
            </button>
          );
        })}
      </div>

      {/* Steps Content */}
      {currentGuide && (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
            {currentGuide.title}
          </h4>

          <div className="space-y-3">
            {currentGuide.steps.map((step, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/40 dark:border-slate-800/20"
              >
                <div className="h-5 w-5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
