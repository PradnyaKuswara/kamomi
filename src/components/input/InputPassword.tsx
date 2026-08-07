import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Lock className="h-4 w-4" />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full py-2.5 pl-10 pr-11 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all ${
              props.disabled
                ? 'bg-slate-100 dark:bg-slate-950/80 text-slate-400 cursor-not-allowed border-slate-200/50 dark:border-slate-800/50'
                : error
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-slate-200 dark:border-slate-800'
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={props.disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-[10px] text-slate-400 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

InputPassword.displayName = 'InputPassword';
