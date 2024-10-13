import { createRoot } from "react-dom/client";
import { CommonProviders } from "@src/components/CommonProviders";
import { Content } from "./Content";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { constants } from "@src/config/constants";

hook();

/**
 * Create a root with shadow dom and renders the main component in the shadow dom
 */
function hook() {
  const rootContainer = document.createElement("div");
  rootContainer.id = `${constants.EXTENSION_NAME}-root`;
  rootContainer.style.zIndex = "2147483647";
  rootContainer.style.position = "absolute";
  rootContainer.style.opacity = "0";

  const headElement = document.createElement("head");

  const shadowRootEl = document.createElement("div");
  shadowRootEl.id = `${constants.EXTENSION_NAME}-shadow-root`;

  rootContainer.addEventListener("keydown", (e) => e.stopPropagation());
  rootContainer.addEventListener("keypress", (e) => e.stopPropagation());
  rootContainer.addEventListener("keyup", (e) => e.stopPropagation());
  rootContainer.addEventListener("input", (e) => e.stopPropagation());
  rootContainer.addEventListener("change", (e) => e.stopPropagation());
  rootContainer.addEventListener("focus", (e) => e.stopPropagation());
  rootContainer.addEventListener("drag", (e) => e.stopPropagation());
  rootContainer.addEventListener("dragenter", (e) => e.stopPropagation());
  rootContainer.addEventListener("dragleave", (e) => e.stopPropagation());
  rootContainer.addEventListener("dragstart", (e) => e.stopPropagation());
  rootContainer.addEventListener("auxclick", (e) => e.stopPropagation());

  document.body.appendChild(rootContainer);
  const shadowRoot = rootContainer.attachShadow({ mode: "open" });
  shadowRoot.appendChild(headElement); // used like document.head (styles only)
  shadowRoot.appendChild(shadowRootEl);

  const stylesCache = createCache({
    key: "css-tasks",
    container: headElement,
  });

  const root = createRoot(shadowRoot);

  const theme = {
    components: {
      MuiPopover: {
        defaultProps: {
          container: shadowRootEl,
        },
      },
      MuiPopper: {
        defaultProps: {
          container: shadowRootEl,
        },
      },
      MuiModal: {
        defaultProps: {
          container: shadowRootEl,
        },
      },
    },
  };

  root.render(
    <CacheProvider value={stylesCache}>
      <CommonProviders theme={theme} scriptType="Content">
        {(ready) => (ready ? <Content /> : null)}
      </CommonProviders>
    </CacheProvider>
  );
}
