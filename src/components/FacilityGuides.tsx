import React, { useState } from 'react';
import { BookOpen, Tv, Wind, Thermometer, ArrowRight, Lightbulb } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { FacilityGuide } from '../types/facility-guide';

interface FacilityGuidesProps {
  guides?: FacilityGuide[] | null;
}

export default function FacilityGuides({ guides = null }: FacilityGuidesProps) {
  const getIconComponent = (iconName: any) => {
    if (!iconName) return Lightbulb;
    if (typeof iconName !== 'string') return iconName;
    const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === "wind" || normalized === "ac") return Wind;
    if (normalized === "tv" || normalized === "television") return Tv;
    if (normalized === "thermometer" || normalized === "heater") return Thermometer;

    const foundKey = Object.keys(LucideIcons).find(
      (key) => key.toLowerCase() === normalized
    );
    if (foundKey) {
      return (LucideIcons as any)[foundKey];
    }
    return Lightbulb;
  };

  const activeGuides = guides || [];
  const [activeTab, setActiveTab] = useState<number | string>(activeGuides[0]?.id || "");

  React.useEffect(() => {
    if (activeGuides.length > 0 && !activeGuides.some(g => g.id === activeTab)) {
      setActiveTab(activeGuides[0].id);
    }
  }, [activeGuides]);

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

      {activeGuides.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Tidak ada data panduan fasilitas
        </div>
      ) : (
        <>
          {/* Tab Selector */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-6 overflow-x-auto">
            {activeGuides.map((guide) => {
              const Icon = getIconComponent(guide.icon);
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
        </>
      )}
    </div>
  );
}
