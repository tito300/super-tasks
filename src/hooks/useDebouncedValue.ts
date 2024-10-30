import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  delay: number = 500,
  callback: (value: T) => void = () => {}
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handler = setTimeout(() => {
      callbackRef.current(value);
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
