import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { initializeServices } from "@src/services";
import { CommonProviders } from "@src/components/CommonProviders";
import { OauthRequired } from "@src/components/Oauth/OauthGate";

initializeServices("Popup");

async function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");

  const root = createRoot(rootContainer);
  root.render(
    <CommonProviders scriptType="Popup">
      {(ready) =>
        ready ? (
          <OauthRequired>
            <Popup />
          </OauthRequired>
        ) : null
      }
    </CommonProviders>
  );
}

init();
