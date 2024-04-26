import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { constants } from "@src/config/constants";
import { useMemo } from "react";

export function useRootElement() {
  const scriptType = useScriptType();
  return useMemo(() => {
    const root = document.getElementById(`${constants.EXTENSION_NAME}-root`);
    if (!root) return document.body;

    if (scriptType === "Content" && root.shadowRoot) {
      return root.shadowRoot.getElementById(`${constants.EXTENSION_NAME}-shadow-root`)!;
    } else {
      return root;
    }
  }, []);
}
