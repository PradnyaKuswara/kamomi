import React from 'react';
import { Input, Textarea } from '@pradnyakuswara/ui';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon: Icon, size: _size, ...props }, ref) => (
    <Input
      ref={ref}
      leftIcon={Icon ? <Icon className="h-4 w-4" /> : undefined}
      {...props}
    />
  )
);

FormInput.displayName = 'FormInput';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (props, ref) => <Textarea ref={ref} {...props} />
);

FormTextarea.displayName = 'FormTextarea';
