import { useEffect, useRef, useState } from "react"

export const useDebounce = <T, >(value: T, delay: number) => {
  const [debauncedValue, setDebouncedValue] = useState(value);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (ref.current) {
      clearTimeout(ref.current)
      ref.current = null
    }
    ref.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    () => ref.current = null;
  }, [value]);

  return debauncedValue;
}