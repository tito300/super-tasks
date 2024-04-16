import { createRoot } from "react-dom/client";
import { Main } from "@src/components/Main";
import { Content } from "./Content";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { constants } from "@src/config/constants";

hook();

/**
 * Create a root with shadow dom and renders the main component in the shadow dom
 */
function hook() {
  const rootContainer = document.createElement("div");
  const headElement = document.createElement("head");
  const shadowRootEl = document.createElement("div");
  rootContainer.style.zIndex = "2147483647";
  rootContainer.style.position = "relative";

  rootContainer.id = "__root";
  document.body.appendChild(rootContainer);
  const shadowRoot = rootContainer.attachShadow({ mode: "open" });
  shadowRoot.appendChild(headElement); // used like document.head (styles only)
  shadowRoot.appendChild(shadowRootEl);

  const stylesCache = createCache({
    key: "css-tasks",
    container: headElement,
  });

  const root = createRoot(shadowRoot);

  const theme = createTheme({
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
  });

  root.render(
    <CacheProvider value={stylesCache}>
      <Main theme={theme} scriptType="Content">
        <Content />
      </Main>
    </CacheProvider>
  );
}
