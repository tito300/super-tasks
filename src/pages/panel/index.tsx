import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";
import { initializeServices } from "@src/services";
import { CommonProviders } from "@src/components/CommonProviders";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import Panel from "@src/pages/panel/Panel";

initializeServices("Panel");

async function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Panel root element");

  const root = createRoot(rootContainer);
  root.render(
    <CommonProviders scriptType="Panel">
      {(ready) =>
        ready ? (
          <OauthRequired>
            <Panel />
          </OauthRequired>
        ) : null
      }
    </CommonProviders>
  );
}

init();
