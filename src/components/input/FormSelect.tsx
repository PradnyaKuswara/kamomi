import React from 'react';
import { Select } from '@pradnyakuswara/ui';

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
}) => (
  <Select
    label={label}
    required={required}
    disabled={disabled}
    error={error}
    placeholder={placeholder}
    value={value}
    options={options.map((o) => ({ value: o.value, label: o.label }))}
    onValueChange={onChange}
  />
);
