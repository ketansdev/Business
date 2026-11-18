import { useEffect, useState } from 'react';

/**
 * Tracks whether the element with `id` intersects the viewport.
 * IntersectionObserver keeps work off the scroll event.
 */
export default function useInView(id, { rootMargin = '0px', initial = true } = {}) {
  const [inView, setInView] = useState(initial);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [id, rootMargin]);
  return inView;
}
