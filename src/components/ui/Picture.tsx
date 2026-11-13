import type { CSSProperties } from 'react';

type Props = {
  name: string;
  alt?: string;
  sizes?: string;
  /** above-the-fold image: eager + high priority */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  width: number;
  height: number;
};

/** A graded WebP from /public/img with a 640w and 1200w source. Always give width/height so nothing shifts. */
export function Picture({ name, alt = '', sizes = '100vw', priority, className, style, width, height }: Props) {
  return (
    <img
      src={`/img/${name}-640.webp`}
      srcSet={`/img/${name}-640.webp 640w, /img/${name}-1200.webp 1200w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      decoding={priority ? 'sync' : 'async'}
      loading={priority ? 'eager' : 'lazy'}
      // @ts-expect-error fetchpriority is valid HTML, not yet in React's types
      fetchpriority={priority ? 'high' : 'auto'}
      draggable={false}
      className={className}
      style={style}
    />
  );
}
