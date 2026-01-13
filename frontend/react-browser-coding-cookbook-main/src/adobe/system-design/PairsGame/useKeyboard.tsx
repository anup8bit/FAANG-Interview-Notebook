import { RefObject, useEffect } from "react"

export const useKeyboard = (
  ref: RefObject<(HTMLButtonElement | null)[]>,
  activeIndex: number,
  handler: (index: number) => void,
) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const total = ref.current.length;
      const n = Math.sqrt(total);

      if (activeIndex === -1) return;
      let nextIndex = -1;
      switch(e.key) {
        case 'ArrowUp':
          nextIndex = activeIndex - n;
          break;
        case 'ArrowDown':
          nextIndex = activeIndex + n;
          break;
        case 'ArrowLeft':
          nextIndex = activeIndex - 1;
          break;
        case 'ArrowRight':
          nextIndex = activeIndex + 1;
          break;
        default:
          console.log("key not soported");
      }

      if (nextIndex >= 0 && nextIndex < total) {
        handler(nextIndex);
        const elem = ref.current[nextIndex];
        elem?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex]);
}