import { useState, useEffect, startTransition } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  return mounted;
}

export function useLazyMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);
  return mounted;
}
