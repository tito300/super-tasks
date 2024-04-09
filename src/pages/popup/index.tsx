import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";

async function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");

  const tokenRes = await chrome.identity.getAuthToken({ interactive: false });

  const root = createRoot(rootContainer);
  root.render(<Popup oauthToken={tokenRes?.token} />);
}

init();
