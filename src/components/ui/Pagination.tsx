import React from 'react';

export interface PaginationProps {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (page > 2) {
        pages.push('...');
      }

      const start = Math.max(1, page - 1);
      const end = Math.min(totalPages - 2, page + 1);

      for (let i = start; i <= end; i++) {
        if (i > 0 && i < totalPages - 1) {
          pages.push(i);
        }
      }

      if (page < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 w-full">
      <span className="text-[10px] text-slate-400">
        Menampilkan {startElement} - {endElement} dari {totalElements} {itemName}
      </span>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Sebelumnya
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="h-6 px-1.5 flex items-center justify-center text-[10px] font-bold text-slate-400 select-none"
                >
                  ...
                </span>
              );
            }
            const i = p as number;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPageChange(i)}
                className={`h-6 w-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  page === i
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page === totalPages - 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}

