import { useState, useEffect } from "react";

export function useTabVisibility() {
  const [isTabVisible, setIsTabVisible] = useState(
    document.visibilityState === "visible"
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isTabVisible;
}
