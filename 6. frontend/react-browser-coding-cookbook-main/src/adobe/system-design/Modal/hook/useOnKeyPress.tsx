import { useEffect } from "react"

export const useOnKeyPress = (
  key: string,
  handler: () => void,
  active: boolean,
) => {
  console.log("key : ", key, handler, active)
  useEffect(() => {
    /** This avoids unnecessary event listeners and makes performance clean. */
    if (!active) return;

    const callback = (e: KeyboardEvent) => {
      console.log("-----callback called---", e)
      if (e.key === key) {
        handler();
      }
    }
    document.addEventListener('keydown', callback);

    return () => document.removeEventListener('keydown', callback);
  }, [key, handler, active]);
}
