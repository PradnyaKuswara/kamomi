import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi...',
  label,
  required,
  disabled,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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
    if (disabled) return;
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

      {/* Toggle Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all text-left ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-slate-200/50 dark:border-slate-800/50'
            : error
            ? 'border-rose-500 focus:ring-rose-500 cursor-pointer'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="h-4 w-4 text-cyan-500 shrink-0" />
          )}
          <span className={selectedOption ? 'font-semibold' : 'text-slate-400 font-normal'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0 ml-2"
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
            className="absolute left-0 right-0 z-50 mt-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-0.5 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = opt.value === value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <div>
                      <div className="text-xs">{opt.label}</div>
                      {opt.description && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-cyan-500" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{error}</p>}
    </div>
  );
};
