import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            } ${
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

FormInput.displayName = 'FormInput';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-cyan-500 transition-all ${
            props.disabled
              ? 'bg-slate-100 dark:bg-slate-950/80 text-slate-400 cursor-not-allowed border-slate-200/50 dark:border-slate-800/50'
              : error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 dark:border-slate-800'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
