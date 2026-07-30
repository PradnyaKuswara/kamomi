import React from 'react';
import { Plus, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  minHeight = 'min-h-[320px]'
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} text-center space-y-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800/80 p-10`}>
      <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0">
        <Icon className="h-8 w-8 text-cyan-500" />
      </div>
      
      <div className="space-y-1">
        <p className="font-bold text-slate-700 dark:text-slate-200 text-base">{title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-md shadow-cyan-500/10 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
