import React from 'react';
import { Pagination as UiPagination } from '@pradnyakuswara/ui';

export interface PaginationProps {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

/** Pagination aplikasi memakai index 0; library memakai index 1. */
export default function Pagination({
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  itemName = 'item',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startElement = page * size + 1;
  const endElement = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)] w-full">
      <span className="text-xs text-[var(--text-muted)]">
        Menampilkan {startElement} - {endElement} dari {totalElements} {itemName}
      </span>
      <UiPagination
        size="sm"
        totalPages={totalPages}
        page={page + 1}
        onPageChange={(p) => onPageChange(p - 1)}
      />
    </div>
  );
}
