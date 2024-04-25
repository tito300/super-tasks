import { DockStationContainer } from "./DockStationContainer";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { Box } from "@mui/material";
import { TasksApp } from "./TasksApp";
import { CalendarApp } from "./CalendarApp";
import { Tab } from "@src/config/userSettingsDefaults";
import { TabsManager } from "@src/components/TabsManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";

export function DockStation() {
  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 385 }}>
        <DockStationAccordion>
          <DockStationAccordionSummary />
          <DockStationAccordionDetails>
            <TabsManager
              tabs={{ tasks: <TasksApp />, calendar: <CalendarApp /> }}
            />
          </DockStationAccordionDetails>
        </DockStationAccordion>
      </OauthRequired>
    </DockStationContainer>
  );
}
