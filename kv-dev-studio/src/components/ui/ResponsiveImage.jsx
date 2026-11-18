import { useEffect, useRef, useState } from 'react';
import { imageSrc, imageSrcSet } from '../../data/images';

/**
 * <img> for an entry of src/data/images.js: WebP srcset, intrinsic size (no layout shift),
 * lazy loading below the fold, and an opacity fade once loaded so late images never pop in.
 * `image` may also be a plain URL, e.g. a screenshot in /public.
 *
 * `priority` is for the above-the-fold hero: eager, high fetch priority, no fade (it is already
 * preloaded from index.html, see vite.config.js).
 */
export default function ResponsiveImage({ image, alt, sizes, priority = false, className = '' }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(priority);

  // A cached image can finish before React attaches onLoad
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  const source =
    typeof image === 'string'
      ? { src: image }
      : { src: imageSrc(image), srcSet: imageSrcSet(image), sizes, width: image.width, height: image.height };

  return (
    <img
      ref={ref}
      {...source}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
      // Lowercase: React 18 passes it through as a plain attribute
      fetchpriority={priority ? 'high' : undefined}
      onLoad={() => setLoaded(true)}
      className={`transition-opacity duration-700 ease-base ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
