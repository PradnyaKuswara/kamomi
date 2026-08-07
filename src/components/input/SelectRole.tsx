import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Shield, User, Check } from 'lucide-react';

interface SelectRoleProps {
  value: 'ADMIN' | 'USER';
  onChange: (value: 'ADMIN' | 'USER') => void;
  label?: string;
  required?: boolean;
}

const roles = [
  {
    id: 'USER' as const,
    name: 'USER',
    label: 'User / Staff Biasa',
    description: 'Akses terbatas untuk mengelola kamar yang ditugaskan saja.',
    icon: User,
    colorClass: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900',
  },
  {
    id: 'ADMIN' as const,
    name: 'ADMIN',
    label: 'Administrator',
    description: 'Akses penuh untuk mengelola seluruh kamar, staff, dan pengaturan hunian.',
    icon: Shield,
    colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900',
  },
];

export default function SelectRole({ value, onChange, label, required }: SelectRoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRole = roles.find((r) => r.id === value) || roles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="space-y-1 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1 rounded-lg border ${selectedRole.colorClass.split(' ')[2]} ${selectedRole.colorClass.split(' ')[3]}`}>
            <selectedRole.icon className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-bold">{selectedRole.label}</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="absolute left-0 right-0 z-50 mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-1"
          >
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = role.id === value;

              return (
                <button
                  key={role.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(role.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-950/70 border border-cyan-500/10 dark:border-cyan-500/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-950/40 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-xl border ${role.colorClass} shrink-0 mt-0.5`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      {role.label}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-normal">
                      {role.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 self-center text-cyan-600 dark:text-cyan-400">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
