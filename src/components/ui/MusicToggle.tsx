import { useMusic } from '../../lib/music';

export function MusicToggle() {
  const { playing, toggle } = useMusic();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Turn the music off' : 'Turn the music on'}
      className="no-callout fixed z-[70] flex items-center gap-2.5 rounded-full border border-gold-400/25 bg-wine-900/85 py-2 pl-3 pr-4 text-[10px] uppercase tracking-[0.28em] text-gold-300/90 transition-colors hover:border-gold-400/60 hover:text-gold-300"
      style={{ right: 'max(16px, env(safe-area-inset-right))', bottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] origin-bottom rounded-full bg-gold-400"
            style={{
              height: '100%',
              transform: playing ? undefined : 'scaleY(0.25)',
              animation: playing ? `eq 1.${2 + i}s ease-in-out ${i * 0.17}s infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      <span>Musica</span>
      <style>{`@keyframes eq{0%{transform:scaleY(.25)}100%{transform:scaleY(1)}} @media (prefers-reduced-motion:reduce){[aria-pressed] span[style*="eq"]{animation:none!important}}`}</style>
    </button>
  );
}
