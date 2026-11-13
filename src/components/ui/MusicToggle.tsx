import { site } from '../../config/site';
import { useMusic } from '../../lib/music';

/** Icon-only, lives in the header strip so it can never sit on top of content. */
export function MusicToggle({ tone }: { tone: 'light' | 'dark' }) {
  const { playing, toggle } = useMusic();
  const label = site.music.label.toLowerCase();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `Turn the ${label} off` : `Turn the ${label} on`}
      className={`no-callout flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-[2000ms] ${
        tone === 'dark' ? 'border-gold-400/40 text-gold-300 hover:border-gold-400' : 'border-gold-600/40 text-gold-600 hover:border-gold-600'
      }`}
    >
      <span className="flex h-4 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] origin-bottom rounded-full bg-current"
            style={{
              height: '100%',
              transform: playing ? undefined : 'scaleY(0.25)',
              animation: playing ? `eq 1.${2 + i}s ease-in-out ${i * 0.17}s infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      <style>{`@keyframes eq{0%{transform:scaleY(.25)}100%{transform:scaleY(1)}} @media (prefers-reduced-motion:reduce){[aria-pressed] span[style*="eq"]{animation:none!important}}`}</style>
    </button>
  );
}
