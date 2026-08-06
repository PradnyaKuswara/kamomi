import React from 'react';
import { Phone } from 'lucide-react';

export interface InputPhoneProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputPhone = React.forwardRef<HTMLInputElement, InputPhoneProps>(
  ({ label, error, helperText, className = '', onChange, ...props }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericVal = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = numericVal;
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {/* Country Code Prefix */}
          <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 select-none pointer-events-none">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-bold border-r border-slate-200/20 dark:border-slate-800/20 pr-2">+62</span>
          </div>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={handlePhoneChange}
            className={`w-full py-2.5 pl-20 pr-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all ${
              props.disabled
                ? 'bg-slate-100 dark:bg-slate-950/80 text-slate-400 cursor-not-allowed border-slate-200/50 dark:border-slate-800/50'
                : error
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-200 dark:border-slate-800'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-[10px] text-slate-400 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

InputPhone.displayName = 'InputPhone';
