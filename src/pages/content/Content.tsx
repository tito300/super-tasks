import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useEffect } from "react";
import { DockStation } from "./components/DockStation";
import { constants } from "@src/config/constants";
import { useTaskReminders } from "@src/hooks/useTaskReminders";
import { useLogRender } from "@src/hooks/useLogRender";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";

export function Content() {
  useTaskReminders();
  useLogRender("Content");
  const {
    userSettings: { popupOnly },
  } = useUserSettings();

  useEffect(() => {
    const rootEl = document.getElementById(`${constants.EXTENSION_NAME}-root`);
    if (rootEl) {
      requestAnimationFrame(() => {
        rootEl.style.opacity = "1";
      });
    }
  }, []);
  if (popupOnly) return null;

  return <DockStation />;
}
