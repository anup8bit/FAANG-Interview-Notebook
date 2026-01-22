import { useEffect, useRef, useState } from "react";

export const useThrottle = <T, >(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const last = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - last.current;

    if (timeElapsed >= limit) {
      last.current = now;
      setThrottledValue(value);
    } else {
      const id = setTimeout(() => {
        setThrottledValue(value);
        last.current = now;
      }, limit-timeElapsed);

      return () => clearTimeout(id);
    }
  });

  return throttledValue;
}
