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
  const defaultRules: Rule[] = [
    {
      id: 1,
      title: "Waktu Tenang (Quiet Hours)",
      desc: "Jam tenang berlaku mulai pukul 22.00 hingga 06.00 WIB. Mohon kecilkan volume suara musik, TV, atau obrolan untuk menghormati penghuni kamar lain.",
      icon: Clock,
      category: "Wajib"
    },
    {
      id: 2,
      title: "Kebijakan Tamu Menginap",
      desc: "Tamu non-penghuni dilarang menginap tanpa persetujuan pengelola. Kunjungan tamu maksimal dibatasi hingga pukul 21.00 WIB di ruang tamu bersama.",
      icon: Users,
      category: "Ketentuan"
    },
    {
      id: 3,
      title: "Dilarang Merokok & Obat Terlarang",
      desc: "Kamar dibebaskan dari asap rokok (Vape/Rokok konvensional). Pelanggaran akan dikenakan denda pembersihan karpet/AC sebesar Rp 500.000.",
      icon: Ban,
      category: "Larangan"
    },
    {
      id: 4,
      title: "Kebersihan & Sampah",
      desc: "Buang sampah pada tempatnya. Mohon tidak membuang tisu basah, pembalut, atau sisa makanan ke dalam wastafel atau lubang kloset.",
      icon: Coffee,
      category: "Kebersihan"
    }
  ];

  const activeRules = rules || defaultRules;
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
    <div className="glassmorphic rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tata Tertib & Aturan</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Demi kenyamanan bersama selama menginap</p>
        </div>
      </div>

      <div className="space-y-3">
        {activeRules.map((rule) => {
          const Icon = rule.icon || AlertCircle;
          const isExpanded = expandedId === rule.id;
          return (
            <div 
              key={rule.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-indigo-500/50 bg-slate-50/50 dark:bg-slate-900/40' 
                  : 'border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/30 dark:hover:bg-slate-900/20'
              }`}
            >
              <button
                onClick={() => toggleRule(rule.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0 text-slate-500 dark:text-slate-400">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 block truncate">
                      {rule.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rule.category && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(rule.category)}`}>
                      {rule.category}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4.5 w-4.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
                  )}
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ${
                  isExpanded ? 'max-h-40 border-t border-slate-100 dark:border-slate-800/50' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {rule.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
