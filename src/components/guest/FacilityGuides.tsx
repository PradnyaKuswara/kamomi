import React, { useState } from 'react';
import { BookOpen, Tv, Wind, Thermometer, ArrowRight, Lightbulb } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { FacilityGuide } from '../../types/facility-guide';

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
    <div className="rounded-2xl p-4 sm:p-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 bg-cyan-100 dark:bg-cyan-950/60 rounded-lg text-cyan-600 shrink-0">
          <BookOpen className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-sm">Panduan Fasilitas</h3>
          <p className="text-[11px] text-[var(--text-muted)]">Petunjuk penggunaan perangkat kamar</p>
        </div>
      </div>

      {activeGuides.length === 0 ? (
        <div className="text-center py-6 text-[var(--text-muted)] text-xs font-medium border border-dashed border-[var(--border-color)] rounded-xl">
          Tidak ada panduan fasilitas
        </div>
      ) : (
        <>
          {/* Tab Selector */}
          <div className="flex gap-1.5 p-1 bg-[var(--bg-surface)] rounded-xl mb-3 border border-[var(--border-color)] overflow-x-auto">
            {activeGuides.map((guide) => {
              const Icon = getIconComponent(guide.icon);
              const isActive = activeTab === guide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setActiveTab(guide.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-600 text-white shadow-xs' 
                      : 'text-[var(--text-secondary)] dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {guide.name}
                </button>
              );
            })}
          </div>

          {/* Steps Content */}
          {currentGuide && (
            <div className="space-y-2.5 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)]">
              <h4 className="font-semibold text-[var(--text-primary)] text-xs flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                {currentGuide.title}
              </h4>

              <div className="space-y-2">
                {currentGuide.steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]"
                  >
                    <div className="h-4.5 w-4.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
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
