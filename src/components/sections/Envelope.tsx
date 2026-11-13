import { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { fill, site } from '../../config/site';
import { MascotArt } from '../ui/Illustrations';

const ease = [0.22, 0.61, 0.36, 1] as const;

/** A wax seal: a slightly wobbly disc, a pressed rim and a heart. */
function WaxSeal({ className = '' }: { className?: string }) {
  const blob = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = 27 + Math.sin(a * 7) * 1.1 + Math.sin(a * 3 + 1) * 1.3;
      pts.push(`${(32 + Math.cos(a) * r).toFixed(2)},${(32 + Math.sin(a) * r).toFixed(2)}`);
    }
    return `M${pts.join('L')}Z`;
  }, []);
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#d6384f" />
          <stop offset="0.6" stopColor="#a8142f" />
          <stop offset="1" stopColor="#7a0e22" />
        </radialGradient>
      </defs>
      <path d={blob} fill="url(#wax)" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#7a0e22" strokeWidth="1.300" opacity=".55" />
      <circle cx="32" cy="32" r="22.500" fill="none" stroke="#ff8a9c" strokeWidth=".8" opacity=".35" />
      {/* the heart, pressed in */}
      <path d="M32 46C17 37 18 22.500 26.500 22.500c3.500 0 5.500 2.500 5.500 4.500 0-2 2-4.500 5.500-4.500C46 22.500 47 37 32 46Z" fill="#7a0e22" opacity=".45" transform="translate(.8 1)" />
      <path d="M32 46C17 37 18 22.500 26.500 22.500c3.500 0 5.500 2.500 5.500 4.500 0-2 2-4.500 5.500-4.500C46 22.500 47 37 32 46Z" fill="#e2566b" />
      <path d="M24 26c1.500-2 4-2.500 5.500-1" stroke="#ffb3c0" strokeWidth="1.200" strokeLinecap="round" fill="none" opacity=".8" />
      <ellipse cx="22" cy="19" rx="6" ry="3" fill="#fff" opacity=".18" transform="rotate(-30 22 19)" />
    </svg>
  );
}

/** 1. A sealed envelope with a mascot peeking over the top. Tap to break the seal. */
export function Envelope({ onOpen, onNext, reduced }: { onOpen: () => void; onNext: () => void; reduced: boolean }) {
  const [open, setOpen] = useState(false);

  const openIt = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    if (navigator.vibrate) navigator.vibrate(24);
    window.setTimeout(onNext, reduced ? 900 : 2600);
  };

  return (
    <div className="on-dark flex w-full flex-col items-center">
      <m.button
        type="button"
        onClick={openIt}
        aria-label={`${fill(site.envelope.to)}. ${site.envelope.hint}`}
        disabled={open}
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.4, ease }}
        className="no-callout relative mt-14 block w-[min(84vw,340px)] cursor-pointer [perspective:1000px] disabled:cursor-default"
      >
        <m.div animate={reduced || open ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} className="relative aspect-[10/7] w-full">
          {/* the mascot, peeking over the top edge */}
          <m.div
            className="absolute left-1/2 -top-[76px] w-[92px] -translate-x-1/2"
            style={{ zIndex: open ? 6 : 0 }}
            animate={open ? { y: reduced ? -40 : [0, -26, -64], scale: [1, 1.08, 1.1] } : { y: 0 }}
            transition={{ duration: 1.4, delay: 0.7, ease }}
          >
            <MascotArt mood={open ? 'joy' : 'plead'} arms={open ? 'up' : 'none'} className="w-full" />
          </m.div>

          {/* back of the envelope */}
          <div className="card-paper absolute inset-0 z-[5] rounded-[10px]" style={{ background: undefined }} />
          <div className="absolute inset-0 z-[5] rounded-[10px] bg-gradient-to-b from-[#e9d6b0]/40 to-transparent" aria-hidden />

          {/* front pocket */}
          <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="absolute inset-0 z-20 h-full w-full drop-shadow-[0_10px_16px_rgba(60,20,20,0.22)]" aria-hidden>
            <defs>
              <linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7ecd6" /><stop offset="1" stopColor="#efdfbf" /></linearGradient>
            </defs>
            <path d="M0 4Q0 0 4 0L50 40 4 70Q0 70 0 66Z" fill="#f3e6c9" stroke="#c9a85a" strokeWidth=".35" strokeLinejoin="round" />
            <path d="M100 4Q100 0 96 0L50 40 96 70Q100 70 100 66Z" fill="#f3e6c9" stroke="#c9a85a" strokeWidth=".35" strokeLinejoin="round" />
            <path d="M0 66Q0 70 4 70H96Q100 70 100 66L50 34Z" fill="url(#pk)" stroke="#c9a85a" strokeWidth=".35" strokeLinejoin="round" />
          </svg>
          <p className="absolute inset-x-0 bottom-[5%] z-30 text-center font-script text-[clamp(30px,9.4vw,44px)] leading-none text-ruby-600">{fill(site.envelope.to)}</p>

          {/* the flap, hinged along the top edge */}
          <m.div
            className="absolute inset-x-0 top-0 h-[58%] [backface-visibility:visible]"
            style={{ transformOrigin: '50% 0%', zIndex: open ? 3 : 30 }}
            initial={false}
            animate={{ rotateX: open ? (reduced ? -180 : -180) : 0 }}
            transition={{ duration: reduced ? 0.01 : 0.9, delay: reduced ? 0 : 0.35, ease }}
          >
            <svg viewBox="0 0 100 58" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_6px_8px_rgba(60,20,20,0.2)]" aria-hidden>
              <defs>
                <linearGradient id="fl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f9efdc" /><stop offset="1" stopColor="#ecd9b3" /></linearGradient>
              </defs>
              <path d="M0 3Q0 0 3 0H97Q100 0 100 3L53 56Q50 58 47 56Z" fill="url(#fl2)" stroke="#c9a85a" strokeWidth=".35" strokeLinejoin="round" />
            </svg>
          </m.div>

          {/* the wax seal, on the flap's tip */}
          <m.div
            className="absolute left-1/2 top-[52%] z-40 w-[17%] -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={open ? { scale: [1, 1.25, 0], rotate: [0, -12, 28], opacity: [1, 1, 0] } : { scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {!open && !reduced && <span aria-hidden className="ring-hint absolute inset-0 rounded-full border border-ruby-600/60" />}
            <WaxSeal className="w-full drop-shadow-[0_4px_5px_rgba(60,10,20,0.45)]" />
          </m.div>
        </m.div>
      </m.button>

      <m.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 1.2, delay: open ? 0 : 1.8 }}
        className="mt-10 font-display text-[1.4rem] italic text-cream-200/85"
      >
        {site.envelope.hint}
      </m.p>
    </div>
  );
}
