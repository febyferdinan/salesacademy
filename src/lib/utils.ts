import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('id-ID');
}

export function formatRupiah(n: number): string {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export const formatIDR = formatRupiah;

export const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};
