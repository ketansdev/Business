import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Renders children at a fixed design width and scales them to fit the container,
 * so illustrated previews keep identical composition at every screen size.
 */
export default function ScaledPreview({ baseWidth = 560, wideBaseWidth, children }) {
  const ref = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // Layout size, not getBoundingClientRect: ancestors may be mid scale animation
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const base = wideBaseWidth && width >= 700 ? wideBaseWidth : baseWidth;
      const scale = width / base;
      setBox({ scale, w: base, h: height / scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, wideBaseWidth]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {box && (
        <div
          style={{ width: box.w, height: box.h, transform: `scale(${box.scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
