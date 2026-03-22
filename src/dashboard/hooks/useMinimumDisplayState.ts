import { useEffect, useRef, useState } from 'react';

interface MinimumDisplayStateOptions<T, K> {
  value: T;
  getKey: (value: T) => K;
  minimumMs: number;
  shouldDelay: (key: K) => boolean;
}

export function useMinimumDisplayState<T, K>({
  value,
  getKey,
  minimumMs,
  shouldDelay,
}: MinimumDisplayStateOptions<T, K>) {
  const [displayValue, setDisplayValue] = useState(value);
  const shownAtRef = useRef(Date.now());

  useEffect(() => {
    const currentKey = getKey(displayValue);
    const nextKey = getKey(value);

    if (Object.is(currentKey, nextKey)) {
      if (!Object.is(displayValue, value)) {
        setDisplayValue(value);
      }
      return;
    }

    const elapsedMs = Date.now() - shownAtRef.current;
    const shouldHold = shouldDelay(currentKey);
    const waitMs = shouldHold
      ? Math.max(0, minimumMs - elapsedMs)
      : 0;

    const timeoutId = window.setTimeout(() => {
      shownAtRef.current = Date.now();
      setDisplayValue(value);
    }, waitMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [displayValue, getKey, minimumMs, shouldDelay, value]);

  return displayValue;
}
