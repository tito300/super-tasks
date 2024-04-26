import { createRoot } from "react-dom/client";
import { initializeServices } from "../../services/index";
import { Main } from "@src/components/Main";
import { Reminder } from "./Reminder";

const root = createRoot(document.getElementById("root")!);

root.render(
      <Main scriptType="Reminder">
        <Reminder />
      </Main>
  );