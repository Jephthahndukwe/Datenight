import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'gold' | 'ruby' | 'ghost';

const base = 'no-callout inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 font-sans text-[13px] font-medium tracking-[0.08em] transition-[transform,filter,background-color] duration-300 active:scale-[0.97]';
const styles: Record<Variant, string> = {
  gold: 'border border-gold-400/70 bg-gradient-to-b from-gold-300 to-gold-500 text-wine-900 hover:brightness-105',
  ruby: 'border border-ruby-700/60 bg-gradient-to-b from-ruby-500 to-ruby-700 text-cream-50 shadow-[0_8px_22px_-10px_rgba(126,18,38,0.8)] hover:brightness-110',
  ghost: 'border border-ink/30 text-ink hover:border-ink/60 hover:bg-ink/5',
};

export function Button({ variant = 'ruby', className = '', children, ...rest }: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ variant = 'ghost', className = '', children, ...rest }: { variant?: Variant; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
