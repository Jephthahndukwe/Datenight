import type { ReactNode } from 'react';
import type { DishIconName } from '../../config/menu';

/** Thin line-art food and drink icons (64 x 64) in currentColor. One text colour class restyles them. */
const icons: Record<DishIconName, ReactNode> = {
  plantain: (
    <>
      <path d="M17 33l4 23h22l4-23Z" />
      <path d="M21 41h22" opacity=".5" />
      <rect x="19" y="8" width="6" height="28" rx="3" transform="rotate(-8 22 36)" />
      <rect x="29" y="5" width="6" height="31" rx="3" />
      <rect x="39" y="8" width="6" height="28" rx="3" transform="rotate(9 42 36)" />
    </>
  ),
  springroll: (
    <>
      <rect x="6" y="14" width="44" height="14" rx="7" transform="rotate(-14 28 21)" />
      <rect x="10" y="34" width="44" height="14" rx="7" transform="rotate(8 32 41)" />
      <path d="M12 22l-2 5M48 12l3 4M16 38l-1 5M52 40l1 5" opacity=".6" />
      <path d="M52 8l1.500 3.500L57 13l-3.500 1.500L52 18l-1.500-3.500L47 13l3.500-1.500Z" />
    </>
  ),
  scotchegg: (
    <>
      <circle cx="32" cy="34" r="21" />
      <ellipse cx="32" cy="34" rx="12" ry="14" />
      <circle cx="32" cy="35" r="5.500" />
      <path d="M14 24l2 2M20 16l2 1M46 18l2 2M50 30l2 1M12 38l2 0M48 48l2 1M24 54l1-2M40 54l-1-2" opacity=".6" />
    </>
  ),
  meatpie: (
    <>
      <path d="M8 42C8 22 56 22 56 42Z" />
      <path d="M14 38c4-9 32-9 36 0" opacity=".55" />
      <path d="M8 42h48M10 48h44" />
      <path d="M22 28l3 2M32 25l0 3M42 28l-3 2" opacity=".7" />
      <path d="M26 12c-3 3 0 5 0 8M34 10c-3 3 0 6 0 9" opacity=".5" />
    </>
  ),
  prawn: (
    <>
      <path d="M48 12c10 8 6 26-8 32-10 4-20 2-28-6" />
      <path d="M44 18c6 7 3 18-6 22-7 3-14 2-20-3" opacity=".55" />
      <path d="M12 38l-6-8 11 1M12 38l-7 5" />
      <path d="M30 42v-9M38 38v-9M44 32v-8" opacity=".7" />
      <circle cx="46" cy="16" r="1.200" />
      <path d="M50 10c4-2 6-6 6-8M52 14c5-1 8-4 8-6" opacity=".7" />
    </>
  ),
  tacos: (
    <>
      <path d="M6 46C6 22 58 22 58 46Z" />
      <path d="M12 38c3-9 9-6 13-11 4-5 11-2 15 2 3 2 6 3 9 7" opacity=".7" />
      <path d="M14 33c3 3 7 3 10 0M30 30c3 3 7 3 10 0M44 36c2 2 5 2 7 0" opacity=".55" />
      <circle cx="26" cy="24" r="2" /><circle cx="38" cy="22" r="2" /><circle cx="46" cy="27" r="2" />
      <path d="M6 50h52" opacity=".5" />
    </>
  ),
  burger: (
    <>
      <path d="M10 28C10 10 54 10 54 28Z" />
      <path d="M22 18l2 1M32 15l1 2M42 18l-2 1" opacity=".7" />
      <path d="M8 33q4 4 8 0t8 0 8 0 8 0 8 0 8 0" />
      <path d="M10 36h44v7H10Z" />
      <path d="M16 36l5 7 5-7" opacity=".6" />
      <path d="M10 47h44c0 6-4 9-9 9H19c-5 0-9-3-9-9Z" />
    </>
  ),
  waffle: (
    <>
      <rect x="8" y="22" width="34" height="34" rx="6" transform="rotate(-8 25 39)" />
      <path d="M14 30l26-4M14 40l26-4M14 50l26-4M19 22l-3 32M29 22l-3 32M39 22l-3 32" opacity=".5" transform="translate(0 0)" />
      <path d="M44 34c8-8 16-2 12 6-3 6-9 6-13 2l-5 7" />
      <path d="M8 24c2 8 6 8 6 2 0 8 6 8 6 2" opacity=".6" />
    </>
  ),
  salmon: (
    <>
      <path d="M6 32c8-14 32-16 48 0-16 16-40 14-48 0Z" />
      <path d="M54 32l7-8v16Z" />
      <path d="M20 22l7 20M30 20l7 22M40 22l6 17" opacity=".55" />
      <circle cx="14" cy="30" r="1.500" />
      <path d="M26 50c4 3 10 3 14 0" opacity=".6" />
    </>
  ),
  espetada: (
    <>
      <path d="M3 52L61 12" />
      <g transform="rotate(-34.600 32 32)">
        <rect x="9" y="24" width="11" height="15" rx="2.500" />
        <rect x="22" y="24" width="11" height="15" rx="6" />
        <rect x="35" y="24" width="11" height="15" rx="2.500" />
        <rect x="48" y="24" width="9" height="15" rx="4.500" />
      </g>
    </>
  ),
  lamb: (
    <>
      <path d="M16 56C6 44 8 28 22 22c8-3 16 0 18 8 2 9-3 18-11 24-4 3-9 4-13 2Z" />
      <path d="M14 44c5 3 12 3 18 0M18 32c4-3 10-4 15-1" opacity=".55" />
      <path d="M32 24L44 10" />
      <circle cx="45" cy="8" r="3.500" /><circle cx="50" cy="13" r="3.500" />
      <path d="M10 56l-3 3M20 58l-1 3" opacity=".5" />
    </>
  ),
  steak: (
    <>
      <path d="M8 32C6 18 26 10 42 14c16 4 20 22 8 32-11 9-38 6-42-14Z" />
      <path d="M22 22v22M20 34h26" opacity=".65" />
      <path d="M14 22l6-3M12 30l5-2M30 40l7 2" opacity=".6" />
      <path d="M48 22c3 2 4 5 3 8" opacity=".6" />
    </>
  ),
  noodles: (
    <>
      <path d="M8 36h48c-1 14-10 20-24 20S9 50 8 36Z" />
      <path d="M13 36q4-9 9 0t9 0 9 0 9 0" />
      <path d="M17 31q3-6 7 0t7 0 7 0 7 0" opacity=".7" />
      <path d="M46 5L30 30M52 8L36 31" />
    </>
  ),
  seafoodpasta: (
    <>
      <ellipse cx="32" cy="46" rx="26" ry="9" />
      <ellipse cx="32" cy="45" rx="17" ry="5" opacity=".5" />
      <path d="M16 42c4-14 28-14 32 0M21 40c3-8 19-8 22 0" />
      <path d="M36 24c8-3 12 3 9 8-3 4-8 3-11 0" />
      <path d="M38 27l3-1M40 30l3-1" opacity=".7" />
      <circle cx="24" cy="30" r="3.500" /><circle cx="24" cy="30" r="1.200" />
    </>
  ),
  rice: (
    <>
      <path d="M8 36h48c-1 14-10 20-24 20S9 50 8 36Z" />
      <path d="M13 36c4-14 34-14 38 0" />
      <path d="M22 30l1 1M30 26l1 1M38 29l1 1M27 33l1 1M35 33l1 1M44 33l1 1M18 34l1 1" opacity=".75" />
      <circle cx="26" cy="22" r="0.800" /><circle cx="40" cy="22" r="0.800" />
      <path d="M26 10c-3 4 0 6 0 9M34 8c-3 4 0 7 0 10M42 10c-3 4 0 6 0 9" opacity=".5" />
    </>
  ),
  friedrice: (
    <>
      <path d="M8 36h44c0 14-9 20-22 20S8 50 8 36Z" />
      <path d="M52 40h10" />
      <path d="M14 36c3-9 11-12 19-9" opacity=".6" />
      <ellipse cx="26" cy="30" rx="11" ry="6.500" />
      <circle cx="28" cy="29" r="3.500" />
      <path d="M40 28l2 1M44 32l2 1M38 33l2 1" opacity=".7" />
    </>
  ),
  salad: (
    <>
      <path d="M8 36h48c-1 12-9 18-24 18S9 48 8 36Z" />
      <path d="M13 36c-3-11 6-16 12-9" />
      <path d="M26 34c-4-13 9-18 15-8" />
      <path d="M42 36c6-8 0-15-7-11" />
      <circle cx="46" cy="30" r="4" /><path d="M44 30h4" opacity=".6" />
      <path d="M18 42c4 2 9 2 13 0" opacity=".5" />
    </>
  ),
  brownie: (
    <>
      <path d="M8 44h48v10H8Z" />
      <path d="M8 44l5-8h38l5 8" />
      <circle cx="32" cy="24" r="10" />
      <path d="M22 26c-1 6 3 6 3 1M30 33c0 5 4 5 4 1M38 28c1 5 4 3 3-1" opacity=".7" />
      <path d="M32 14c0-4 2-6 5-7" />
      <path d="M15 40l4 3M26 40l4 3M38 40l4 3" opacity=".5" />
    </>
  ),
  crepe: (
    <>
      <ellipse cx="32" cy="48" rx="26" ry="8" />
      <path d="M12 44L32 14l20 30c-10 6-30 6-40 0Z" />
      <path d="M32 14v34" opacity=".4" />
      <circle cx="26" cy="30" r="5" /><path d="M24 25l2-3 2 3" />
      <circle cx="38" cy="33" r="5" /><path d="M36 28l2-3 2 3" />
      <path d="M18 42q4-4 8 0t8 0 8 0" opacity=".6" />
    </>
  ),
  cheesecake: (
    <>
      <path d="M8 52h48v-8H8Z" />
      <path d="M10 44V30c0-4 3-6 6-6h32c3 0 6 2 6 6v14" />
      <path d="M10 36h44" opacity=".5" />
      <circle cx="26" cy="19" r="6" /><path d="M23 13l3-3 3 3" />
      <circle cx="40" cy="20" r="5" /><path d="M38 15l2-2 2 2" />
      <path d="M12 32q4 5 8 0t8 0" opacity=".6" />
    </>
  ),
  redvelvet: (
    <>
      <path d="M10 56V30h44v26Z" />
      <path d="M10 39h44M10 48h44" opacity=".55" />
      <path d="M10 30q5-9 11-2t11-2 11 2 11-2" />
      <path d="M32 14c-6-6-14 1-6 8l6 6 6-6c8-7 0-14-6-8Z" />
      <path d="M16 44l2 1M28 52l2 0M42 43l2 1M46 52l2 0" opacity=".6" />
    </>
  ),
  coupe: (
    <>
      <path d="M10 14h44c0 14-10 22-22 22S10 28 10 14Z" />
      <path d="M32 36v18M20 57c8-4 16-4 24 0" />
      <path d="M12 20c8 3 32 3 40 0" opacity=".5" />
      <circle cx="50" cy="12" r="6" /><path d="M44 12h12M50 6v12" opacity=".6" />
    </>
  ),
  highball: (
    <>
      <path d="M18 8h28l-4 48H22Z" />
      <path d="M20 22h24" opacity=".5" />
      <rect x="24" y="26" width="8" height="8" rx="1.500" transform="rotate(8 28 30)" />
      <rect x="33" y="36" width="8" height="8" rx="1.500" transform="rotate(-8 37 40)" />
      <path d="M38 4l5 30" />
      <path d="M44 6c5-3 10 0 9 5-4 2-8 0-9-5Z" />
    </>
  ),
  mocktail: (
    <>
      <path d="M14 18h36l-4 38H18Z" />
      <path d="M16 30q8-5 16 0t16 0" opacity=".6" />
      <path d="M38 4l-5 28" />
      <circle cx="46" cy="18" r="7" /><path d="M46 11v14M39 18h14M41 13l10 10M51 13L41 23" opacity=".6" />
      <circle cx="24" cy="42" r="1.500" /><circle cx="32" cy="46" r="1.500" /><circle cx="38" cy="40" r="1.500" />
    </>
  ),
  milkshake: (
    <>
      <path d="M16 26h32l-3 30H19Z" />
      <path d="M14 26c0-9 8-11 18-14 10 3 18 5 18 14" />
      <path d="M20 34h24M21 42h22" opacity=".45" />
      <circle cx="32" cy="9" r="3.500" /><path d="M32 5c1-3 3-4 5-4" />
      <path d="M40 8l-5 18" />
    </>
  ),
  espresso: (
    <>
      <path d="M14 28h32v10c0 9-7 14-16 14s-16-5-16-14Z" />
      <path d="M46 31h4c5 0 5 9 0 9h-4" />
      <path d="M8 56h48" />
      <path d="M24 10c-3 4 0 6 0 10M32 8c-3 4 0 7 0 11M40 10c-3 4 0 6 0 10" opacity=".6" />
    </>
  ),
  latte: (
    <>
      <path d="M10 26h36v16c0 9-8 14-18 14S10 51 10 42Z" />
      <path d="M46 30h5c6 0 6 11 0 11h-5" />
      <path d="M28 34c-5-5-10 2-5 6l5 4 5-4c5-4 0-11-5-6Z" opacity=".75" />
      <path d="M20 10c-3 4 0 6 0 10M28 8c-3 4 0 7 0 11M36 10c-3 4 0 6 0 10" opacity=".6" />
    </>
  ),
  tea: (
    <>
      <path d="M10 28h34v10c0 9-7 14-17 14S10 47 10 38Z" />
      <path d="M44 31h4c5 0 5 9 0 9h-4" />
      <path d="M6 56h50" />
      <path d="M30 12v14" /><rect x="26" y="8" width="8" height="7" rx="1" />
      <path d="M16 36q6-4 12 0t12 0" opacity=".5" />
    </>
  ),
  water: (
    <>
      <path d="M26 6h12v8c5 4 7 8 7 15v27H19V29c0-7 2-11 7-15Z" />
      <path d="M26 10h12" opacity=".6" />
      <rect x="21" y="32" width="22" height="14" rx="2" opacity=".6" />
      <path d="M32 36c-3 4-3 7 0 7s3-3 0-7Z" />
    </>
  ),
  sparkling: (
    <>
      <path d="M26 6h12v8c5 4 7 8 7 15v27H19V29c0-7 2-11 7-15Z" />
      <rect x="21" y="32" width="22" height="14" rx="2" opacity=".6" />
      <circle cx="28" cy="39" r="1.500" /><circle cx="35" cy="37" r="1.500" /><circle cx="33" cy="43" r="1.500" />
      <circle cx="50" cy="16" r="2" /><circle cx="56" cy="26" r="1.500" /><circle cx="12" cy="20" r="1.500" />
    </>
  ),
  surprise: (
    <>
      <rect x="13" y="29" width="38" height="24" rx="2" />
      <rect x="10" y="22" width="44" height="8" rx="2" />
      <path d="M32 22v31" />
      <path d="M32 22c-4-9-14-10-14-4 0 5 9 5 14 4Zm0 0c4-9 14-10 14-4 0 5-9 5-14 4Z" />
      <path d="M52 8l1.500 3.500L57 13l-3.500 1.500L52 18l-1.500-3.500L47 13l3.500-1.500Z" />
    </>
  ),
  decide: (
    <>
      <path d="M32 8c13 0 23 7.500 23 18S45 44 32 44c-3 0-6-.5-9-1.500L11 50l3-10C10 37 9 32 9 26 9 15.500 19 8 32 8Z" />
      <path d="M25 22c0-4 3-6.500 7-6.500s7 2.500 7 6c0 5-7 5-7 10" />
      <circle cx="32" cy="36.500" r="1" fill="currentColor" />
    </>
  ),
};

export function DishIcon({ name, className = '', strokeWidth = 1.6 }: { name: DishIconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icons[name]}
    </svg>
  );
}
