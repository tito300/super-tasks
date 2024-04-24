import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { Box } from "@mui/material";
import { TasksApp } from "./TasksApp";

export function DockStation() {
  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 385 }}>
        <AppManager />
      </OauthRequired>
    </DockStationContainer>
  );
}

function AppManager() {
  const { userSettings } = useUserSettingsContext();

  return <>
    <Box sx={{ display: userSettings.currentTab === "tasks" ? "block" : "none" }}>
      <TasksApp />
    </Box>
    <Box sx={{ display: userSettings.currentTab === "calendar" ? "block" : "none" }}>
      Calendar
    </Box>
  </>
}