import { DockStationContainer } from "./DockStationContainer";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { Box, Stack } from "@mui/material";
import { TasksApp } from "./TasksApp";
import { CalendarApp } from "./CalendarApp";
import { Tab } from "@src/config/settingsDefaults";
import { TabsManager } from "@src/components/TabsManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { useRootElement } from "@src/hooks/useRootElement";
import { useUserSettings } from "@src/api/user.api";
import { useEffect } from "react";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";

export function DockStation() {
  const scriptSource = useScriptType();
  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 385 }}>
        <TabsManager
          hideTabs
          flexGrow={1}
          tabs={{ tasks: <TasksApp />, 
          // calendar: <CalendarApp />
          calendar: <></>
         }}
        />
      </OauthRequired>
      {/* <ScrollTopOnLoad /> */}
    </DockStationContainer>
  );
}

function ScrollTopOnLoad() {
  const root = useRootElement();
  const scriptType = useScriptType();
  const { userSettings } = useUserSettings();

  useEffect(() => {
    if (userSettings.currentTab === "calendar") return;

    if (scriptType === "Content") {
      if (!root?.querySelector("#accordion-details")) return;

      root.querySelector("#accordion-details")!.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [userSettings.currentTab]);
  return null;
}
