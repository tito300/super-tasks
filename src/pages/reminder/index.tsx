import { createRoot } from "react-dom/client";
import { CommonProviders } from "@src/components/CommonProviders";
import { Reminder } from "./Reminder";

const root = createRoot(document.getElementById("root")!);

root.render(
  <CommonProviders scriptType="Reminder">
    {(ready) => ready && <Reminder />}
  </CommonProviders>
);
