import React, { useState } from 'react';
import { Input } from '@pradnyakuswara/ui';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ size: _size, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        leftIcon={<Lock className="h-4 w-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={props.disabled}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  }
);

InputPassword.displayName = 'InputPassword';
