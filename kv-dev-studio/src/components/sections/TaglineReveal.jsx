import { useEffect, useRef, useState } from 'react';

// One entry per line on larger screens, broken where the thought breaks
const LINES = ['Your customers are already', 'searching online.', 'We make sure they find', 'a business worth choosing.'];
const words = LINES.flatMap((line, li) => line.split(' ').map((w, wi, arr) => ({ w, lineEnd: wi === arr.length - 1 && li < LINES.length - 1 })));
// The closing words carry the brand accent once revealed
const ACCENT_FROM = words.length - 3;

/**
 * Large promise statement, given most of a screen on desktop. Each word moves from a muted tone to full colour,
 * one at a time in reading order, driven by a single scroll listener throttled through requestAnimationFrame.
 */
export default function TaglineReveal() {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReduced(true);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      // Starts when the block enters the lower part of the screen, completes around the middle
      const start = vh * 0.85;
      const distance = rect.height + vh * 0.35;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
      setCount(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section aria-label="Our promise" className="section-y flex items-center lg:min-h-[80svh]">
      <div className="container-x">
        <p ref={ref} className="type-statement mx-auto max-w-4xl text-center">
          {words.map(({ w, lineEnd }, i) => {
            const on = reduced || i < count;
            return (
              <span key={i}>
                <span
                  className={`transition-[opacity,color] duration-500 ease-base ${on && i >= ACCENT_FROM ? 'text-accent' : ''}`}
                  style={{ opacity: on ? 1 : 0.2 }}
                >
                  {w}
                </span>
                {i < words.length - 1 && ' '}
                {lineEnd && <br className="hidden sm:inline" />}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
