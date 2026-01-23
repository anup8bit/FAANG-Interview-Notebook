import { useRef } from "react";

export const  useThrottleFn = (fn: () => void, delay: number) => {
  const last = useRef(0);

  return () => {
    const now = Date.now();
    if (now - last.current >= delay) {
      last.current = now;
      fn();
    }
  };
}

