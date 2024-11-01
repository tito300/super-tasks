import { useRef, useEffect } from "react";

export function useLogRender(componentName: string) {
  const renders = useRef(0);
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_LOG_RENDERS === "true") {
      renders.current += 1;
      console.log(`[${componentName}] rerender: `, renders.current);
    }
  });
}
