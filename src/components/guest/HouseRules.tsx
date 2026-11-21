import React, { useState } from 'react';
import { Button } from '@pradnyakuswara/ui';
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle, Ban, Users, Clock, Coffee } from 'lucide-react';

interface Rule {
  id: number;
  title: string;
  desc: string;
  icon?: React.ComponentType<{ className?: string }>;
  category?: string;
}

interface HouseRulesProps {
  rules?: Rule[] | null;
}

export default function HouseRules({ rules = null }: HouseRulesProps) {
  const activeRules = rules || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleRule = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'larangan':
        return 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400';
      case 'wajib':
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-[var(--bg-subtle)] text-[var(--text-primary)]';
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-base">Tata Tertib</h3>
          <p className="text-xs text-[var(--text-muted)]">Aturan kenyamanan bersama</p>
        </div>
      </div>

      {activeRules.length === 0 ? (
        <div className="text-center py-6 text-[var(--text-muted)] text-xs font-medium border border-dashed border-[var(--border-color)] rounded-xl">
          Tidak ada tata tertib khusus
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeRules.map((rule) => {
            const Icon = rule.icon || AlertCircle;
            const isExpanded = expandedId === rule.id;
            return (
              <div 
                key={rule.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isExpanded 
                    ? 'border-cyan-500/40 bg-[var(--bg-surface)]' 
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--control-hover)]'
                }`}
              >
                <button type="button" className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
                  onClick={() => toggleRule(rule.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-[var(--bg-subtle)] shrink-0 text-[var(--text-secondary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                      {rule.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rule.category && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(rule.category)}`}>
                        {rule.category}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                </button>

                <div 
                  className={`transition-all duration-200 ${
                    isExpanded ? 'max-h-40 border-t border-[var(--border-subtle)]' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="p-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {rule.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
