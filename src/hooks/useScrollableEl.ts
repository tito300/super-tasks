import { constants } from "@src/config/constants";
import { useRootElement } from "./useRootElement";

export function useScrollableEl() {
  const rootEl = useRootElement();

  return rootEl.querySelector(
    `#${constants.EXTENSION_NAME}-scrollable-container`
  ) as HTMLDivElement | null;
}
