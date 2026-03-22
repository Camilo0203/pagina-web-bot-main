import { Suspense, lazy, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';

interface LazyViewportSectionProps {
  loader: () => Promise<{ default: ComponentType }>;
  fallback?: ReactNode;
  rootMargin?: string;
}

export default function LazyViewportSection({
  loader,
  fallback = null,
  rootMargin = '320px 0px',
}: LazyViewportSectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const LazyComponent = lazy(loader);

  useEffect(() => {
    if (shouldLoad || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  return shouldLoad ? (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  ) : (
    <div ref={sentinelRef} className="min-h-[1px]" aria-hidden="true" />
  );
}
