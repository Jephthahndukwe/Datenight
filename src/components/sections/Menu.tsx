import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { fill, site } from '../../config/site';
import { useInView } from '../../lib/useInView';
import { useOrientationTilt } from '../../lib/useTilt';
import { Ornament } from '../ui/Ornament';
import { Picture } from '../ui/Picture';

type Props = { reducedMotion: boolean; coarse: boolean };

const courses = site.menu.courses.map((c) => ({ ...c, value: fill(c.value) }));

/** 3. The one object in the experience: a handwritten-style card on a candlelit table. The courses are the plan. */
export function Menu({ reducedMotion, coarse }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -22% 0px');
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const section = useRef<HTMLElement>(null);

  // Tilt = slow scroll tilt (always) + phone orientation (touch devices) + pointer hover (mouse).
  // If orientation permission is denied or unsupported, the other two simply carry on.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const scrollTiltX = useTransform(scrollYProgress, [0, 0.5, 1], [9, 0, -9]);
  const orient = useOrientationTilt(coarse && !reducedMotion);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hx = useSpring(px, { stiffness: 50, damping: 20 });
  const hy = useSpring(py, { stiffness: 50, damping: 20 });
  const tiltX = useTransform([scrollTiltX, orient.x, hy], ([a, b, c]: number[]) => a + b + c);
  const tiltY = useTransform([orient.y, hx], ([a, b]: number[]) => a + b);
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    py.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  // turn the card once, a beat after it settles into view; after that she controls it
  useEffect(() => {
    if (!inView || touched) return;
    const id = window.setTimeout(() => setOpen(true), reducedMotion ? 0 : 1200);
    return () => window.clearTimeout(id);
  }, [inView, touched, reducedMotion]);

  const flip = () => {
    void orient.request(); // iOS only asks for motion access from a tap
    setTouched(true);
    setOpen((o) => !o);
  };

  return (
    <section ref={section} id="menu" onPointerMove={onPointerMove} className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 pb-28 pt-24">
      <div aria-hidden className="absolute inset-0 bg-wine-950" />
      <Picture name="lights" width={640} height={853} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.34]" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 50% 48%, rgba(58,15,32,0.55) 0%, rgba(29,7,16,0.82) 62%, #12040a 100%)' }} />
      <p className="relative mb-7 text-center font-display text-base italic text-cream-200/55">{coarse ? site.menu.hintTouch : site.menu.hint}</p>

      <div ref={ref} className="relative [perspective:1400px]">
        <m.div style={reducedMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }} className="[transform-style:preserve-3d]">
        <m.div
          role="button"
          tabIndex={0}
          onClick={flip}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }}
          aria-label={open ? 'Turn the menu back to its cover' : 'Open the menu'}
          initial={false}
          animate={{ rotateY: open ? 180 : 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 1.7, ease: [0.65, 0, 0.25, 1] }}
          className="no-callout relative block cursor-pointer text-left [transform-style:preserve-3d]"
          style={{ width: 'min(86vw, 400px, calc(70svh * 0.585))', aspectRatio: '5 / 8.5' }}
        >
          {/* shadow that tracks the turn */}
          <m.span
            aria-hidden
            className="absolute -inset-x-3 -bottom-8 -z-10 h-10 rounded-[50%] bg-black/60 blur-xl"
            initial={false}
            animate={{ scaleX: [1, 0.7, 1] }}
            transition={{ duration: reducedMotion ? 0 : 1.7, ease: 'easeInOut' }}
          />

          {/* FRONT: cover */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] [backface-visibility:hidden]"
            style={{ containerType: 'inline-size', background: 'linear-gradient(145deg, #5a1730 0%, #3a0f20 55%, #2c0b19 100%)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.8), inset 0 0 0 1px rgba(236,189,98,.25)' }}
          >
            <div className="absolute inset-[4cqw] rounded-[6px] border border-gold-500/50" />
            <div className="absolute inset-[6cqw] rounded-[4px] border border-gold-500/25" />
            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <Ornament className="w-[46cqw]" />
              <p className="mt-[6cqw] font-display italic text-gold-300" style={{ fontSize: '6.4cqw' }}>{site.menu.coverTop}</p>
              <h2 className="mt-[1cqw] font-display font-medium uppercase text-gold-300" style={{ fontSize: '10.5cqw', letterSpacing: '0.12em', lineHeight: 1.05 }}>
                {site.menu.coverTitle}
              </h2>
              <p className="mt-[5cqw] font-display italic text-cream-200/80" style={{ fontSize: '5.4cqw' }}>
                {site.menu.coverBottom}
              </p>
              <Ornament className="mt-[6cqw] w-[46cqw]" />
            </div>
          </div>

          {/* BACK: the plan */}
          <div
            className="parchment absolute inset-0 overflow-hidden rounded-[10px] text-wine-800 [backface-visibility:hidden]"
            style={{ containerType: 'inline-size', transform: 'rotateY(180deg)', boxShadow: '0 30px 60px -20px rgba(0,0,0,.8), inset 0 0 40px rgba(120,80,30,.25)' }}
          >
            <div className="absolute inset-[3.4cqw] rounded-[4px] border border-[#8a5a2a]/35" />
            <div className="relative flex h-full flex-col px-[9cqw] pb-[7cqw] pt-[8cqw] text-center">
              <p className="font-sans uppercase text-[#8a5a2a]" style={{ fontSize: '2.7cqw', letterSpacing: '0.42em' }}>{site.menu.title}</p>
              <Ornament tone="ink" className="mx-auto mt-[2.5cqw] w-[38cqw]" />

              <ul className="mt-[3.5cqw] flex flex-1 flex-col justify-between pb-[3cqw]">
                {courses.map((c) => (
                  <li key={c.name}>
                    <h3 className="font-display font-semibold text-wine-700" style={{ fontSize: '7cqw', lineHeight: 1 }}>{c.name}</h3>
                    <p className="mt-[1.6cqw] font-sans uppercase text-[#8a5a2a]" style={{ fontSize: '2.5cqw', letterSpacing: '0.34em' }}>{c.label}</p>
                    <p className="mt-[1cqw] font-display italic text-wine-800" style={{ fontSize: '4.9cqw', lineHeight: 1.2 }}>{c.value}</p>
                  </li>
                ))}
              </ul>

              <p className="-rotate-2 font-script text-wine-600" style={{ fontSize: '6.6cqw', lineHeight: 1 }}>{site.menu.note}</p>
            </div>
          </div>
        </m.div>
        </m.div>
      </div>
    </section>
  );
}
