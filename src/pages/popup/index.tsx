import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { setupServices } from "@src/services";
import { setupToken } from "@src/oauth/setupToken";
import { Main } from "@src/components/Main";

const messageEngine = getMessageEngine('Popup');
setupServices('Popup');
setupToken()

async function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");

  const root = createRoot(rootContainer);
  root.render(<Main scriptType="Popup"><Popup /></Main>);
}

init();