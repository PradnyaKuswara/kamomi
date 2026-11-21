import { Select } from '@pradnyakuswara/ui';

interface SelectRoleProps {
  value: 'ADMIN' | 'USER';
  onChange: (value: 'ADMIN' | 'USER') => void;
  label?: string;
  required?: boolean;
}

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User / Staff Biasa' },
  { value: 'ADMIN', label: 'Administrator' },
];

const ROLE_HELP: Record<'ADMIN' | 'USER', string> = {
  USER: 'Akses terbatas untuk mengelola kamar yang ditugaskan saja.',
  ADMIN: 'Akses penuh untuk mengelola seluruh kamar, staff, dan pengaturan hunian.',
};

export default function SelectRole({ value, onChange, label, required }: SelectRoleProps) {
  return (
    <Select
      label={label}
      required={required}
      value={value}
      options={ROLE_OPTIONS}
      helperText={ROLE_HELP[value]}
      onValueChange={(v) => onChange(v as 'ADMIN' | 'USER')}
    />
  );
}
