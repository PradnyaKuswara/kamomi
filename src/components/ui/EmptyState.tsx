import React from 'react';
import { Plus, type LucideIcon } from 'lucide-react';
import { Button, EmptyState as UiEmptyState, Tooltip } from '@pradnyakuswara/ui';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  minHeight?: string;
  disabled?: boolean;
  tooltipMessage?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  minHeight = 'min-h-[320px]',
  disabled = false,
  tooltipMessage,
  tooltipPosition = "top"
}: EmptyStateProps) {
  const action =
    actionLabel && onAction ? (
      <Tooltip content={tooltipMessage ?? ''} placement={tooltipPosition} disabled={!disabled || !tooltipMessage}>
        <Button onClick={onAction} disabled={disabled} leftIcon={<Plus className="h-4 w-4" />}>
          {actionLabel}
        </Button>
      </Tooltip>
    ) : undefined;

  return (
    <div className={`flex items-center justify-center ${minHeight} rounded-[var(--radius-xl)] border border-dashed border-[var(--border-color)] p-6`}>
      <UiEmptyState icon={<Icon className="h-8 w-8" />} title={title} description={description} action={action} />
    </div>
  );
}
