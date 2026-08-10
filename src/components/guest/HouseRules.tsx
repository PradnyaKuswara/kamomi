import React, { useState } from 'react';
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
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="rounded-2xl p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-white text-base">Tata Tertib</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Aturan kenyamanan bersama</p>
        </div>
      </div>

      {activeRules.length === 0 ? (
        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
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
                    ? 'border-indigo-500/40 bg-white dark:bg-slate-950' 
                    : 'border-slate-200/60 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-950'
                }`}
              >
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="w-full px-3.5 py-3 flex items-center justify-between text-left gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 shrink-0 text-slate-500 dark:text-slate-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
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
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                <div 
                  className={`transition-all duration-200 ${
                    isExpanded ? 'max-h-40 border-t border-slate-100 dark:border-slate-800/50' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="p-3.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
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
