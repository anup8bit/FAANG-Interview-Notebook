/**
 * hook to apply smooth animation using requestAnimationFrame
 * 
 * @returns - animationRef
 * 
 * @params { duration }
 */

import { RefObject, useLayoutEffect, useRef } from "react"

export const useSmoothAnimation = <T extends HTMLElement, >(
  open: boolean,
  duration = 300
) => {
  const elemRef = useRef<T>(null);
  const animRef = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  const animateHeight = (from: number, to: number) => {

    const frameCallback: FrameRequestCallback = (timestamp) => {
      if (!start.current) return;
    const timeElapsed = timestamp - start.current;

    const progress = Math.min((timeElapsed / duration), 1);
    const currentHeight = from + (to - from) * progress;

    if (elemRef.current) {
      elemRef.current.style.height = `${currentHeight}px`;
    }

    if (progress < 1) {
        animRef.current = requestAnimationFrame(frameCallback);
    } else {
      if (open && elemRef.current) {
        elemRef.current.style.height = "auto";
      }
    }
  }

    animRef.current = requestAnimationFrame(frameCallback);
  }

  useLayoutEffect(() => {
    if (!elemRef.current) return;
    start.current = performance.now()
    
    if (animRef.current) cancelAnimationFrame(animRef.current);

    if (open) {
      const rect = elemRef.current.getBoundingClientRect();
      const from = rect.height;

      // Temporarily set height:auto to measure full expanded height
      elemRef.current.style.height = "auto";
      const to = elemRef.current.scrollHeight;

      // Reset to previous height before animating
      elemRef.current.style.height = `${from}px`;
      // Animate to full height
      animateHeight(from, to);
    } else {
      const rect = elemRef.current.getBoundingClientRect();
      const from = rect.height;
      const to = 0;
      animateHeight(from, to);
    }
  }, [open]);

  return elemRef;
}