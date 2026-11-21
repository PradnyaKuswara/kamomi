import React from 'react';


interface LogoMarkProps {
  className?: string;
  /** `solid`: ikon biru token (terang `--color-primary`, gelap `--primary-accent`). `inverse`: ikon putih untuk latar berwarna. */
  tone?: 'solid' | 'inverse';
}

/**
 * Origami Camar — camar (kamome) dari lipatan kertas origami.
 * Sayap = warna penuh, lipatan bawah = nada transparan, sehingga dua nada tetap mengikuti token.
 */
export function LogoMark({ className = 'h-9 w-9', tone = 'solid' }: LogoMarkProps) {
  const color = tone === 'inverse' ? 'text-white' : 'text-[var(--primary-accent)]';
  return (
    <svg viewBox="3 9 58 56" className={`shrink-0 ${color} ${className}`} role="img" aria-label="Kamomi.id">
      <path d="M4 20 L32 36 L20 42Z" fill="currentColor" />
      <path d="M60 20 L32 36 L44 42Z" fill="currentColor" />
      <path d="M20 42 L32 36 L32 54Z" fill="currentColor" fillOpacity=".42" />
      <path d="M44 42 L32 36 L32 54Z" fill="currentColor" fillOpacity=".7" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  /** `light`: teks putih (untuk latar berwarna/gelap). */
  tone?: 'default' | 'light';
  /** Sembunyikan teks, hanya ikon. */
  markOnly?: boolean;
}

/** Logo lengkap: ikon + wordmark "Kamomi.id". */
export default function Logo({
  className = '',
  markClassName = 'h-9 w-9',
  textClassName = 'text-xl',
  tone = 'default',
  markOnly = false,
}: LogoProps) {
  const light = tone === 'light';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markClassName} tone={light ? 'inverse' : 'solid'} />
      {!markOnly && (
        <span
          className={`font-extrabold tracking-tight leading-none ${textClassName} ${
            light ? 'text-white' : 'text-[var(--text-primary)]'
          }`}
        >
          Kamomi
          <span className={light ? 'text-white/70' : 'text-[var(--primary-accent)]'}>.id</span>
        </span>
      )}
    </span>
  );
}
