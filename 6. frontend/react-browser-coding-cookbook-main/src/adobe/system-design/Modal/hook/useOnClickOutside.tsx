import { RefObject, useEffect } from "react";

export const useOnClickOutside = <T extends HTMLElement, >(
  ref: RefObject<T | null>,
  handler: (e: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listenerCallback = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;

      /** if ref.current dorsn't exist or click is inside it */
      if (!el || el.contains(e.target as Node)) {
        return;
      }

      handler(e);
    }

    /** Capture phase ensure it fires early */
    document.addEventListener('click', listenerCallback, true);
    document.addEventListener('touchstart', listenerCallback, true);

    return () => {
      document.removeEventListener('click', listenerCallback, true);
      document.removeEventListener('touchstart', listenerCallback, true);
    }

  }, [ref, handler]);
}