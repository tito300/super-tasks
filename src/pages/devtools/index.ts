import Browser from "webextension-polyfill";

Browser.devtools.panels
  .create("Dev Tools", "logo_1_32x32.png", "src/pages/panel/index.html")
  .catch(console.error);
