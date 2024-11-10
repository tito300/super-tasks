import { useRef, useEffect } from "react";

const timeThreshold = 1000 * 10;

export function useLogRender(
  componentName: string,
  renderWarning: boolean = true
) {
  const renders = useRef(0);
  const lastResetTime = useRef(Date.now());
  const rendersSinceLastReset = useRef(0);

  useEffect(() => {
    if (import.meta.env.DEV) {
      renders.current += 1;
      rendersSinceLastReset.current += 1;

      if (Date.now() - lastResetTime.current > 1000 * 10) {
        lastResetTime.current = Date.now();
        rendersSinceLastReset.current = 0;
      }

      if (renderWarning && rendersSinceLastReset.current > 20) {
        window.alert(
          `[${componentName}] has rendered ${
            rendersSinceLastReset.current
          } times in the last ${timeThreshold / 1000} seconds.`
        );
        console.error(
          `[${componentName}] has rendered ${
            rendersSinceLastReset.current
          } times in the last ${timeThreshold / 1000} seconds.`
        );
      }

      if (import.meta.env.VITE_LOG_RENDERS === "true") {
        console.log(`[${componentName}] rerender: `, renders.current);
      }
    }
  });
}
