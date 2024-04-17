import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { OauthRequired } from "@src/components/Oauth/OauthGate";

export function DockStation() {
  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 385 }}>
        <DockStationAccordion sx={{ width: 385 }}>
          <DockStationAccordionSummary />
          <DockStationAccordionDetails>
            <TaskListManager />
          </DockStationAccordionDetails>
        </DockStationAccordion>
      </OauthRequired>
    </DockStationContainer>
  );
}
