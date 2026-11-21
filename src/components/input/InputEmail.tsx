import React from 'react';
import { Input } from '@pradnyakuswara/ui';
import { Mail } from 'lucide-react';

export interface InputEmailProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputEmail = React.forwardRef<HTMLInputElement, InputEmailProps>(
  ({ size: _size, ...props }, ref) => (
    <Input ref={ref} type="email" leftIcon={<Mail className="h-4 w-4" />} {...props} />
  )
);

InputEmail.displayName = 'InputEmail';
