import React from 'react';
import { Input } from '@pradnyakuswara/ui';
import { Phone } from 'lucide-react';

export interface InputPhoneProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputPhone = React.forwardRef<HTMLInputElement, InputPhoneProps>(
  ({ onChange, size: _size, ...props }, ref) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        leftIcon={
          <span className="flex items-center gap-1.5 text-xs font-bold">
            <Phone className="h-4 w-4" />+62
          </span>
        }
        onChange={handlePhoneChange}
        {...props}
      />
    );
  }
);

InputPhone.displayName = 'InputPhone';
