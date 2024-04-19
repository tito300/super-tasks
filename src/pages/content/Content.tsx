import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useEffect } from "react";
import { DockStation } from "./components/DockStation";
import { constants } from "@src/config/constants";

export function Content() {
  const messageEngine = useMessageEngine();
  useEffect(() => {
    const rootEl = document.getElementById(`${constants.EXTENSION_NAME}-root`);
    if (rootEl) {
      requestAnimationFrame(() => {
        rootEl.style.opacity = "1";
      });
    }
    messageEngine.onMessage("DockTask", async (message) => {
      alert("DockTask");
    });
  }, []);

  return <DockStation />;
}
