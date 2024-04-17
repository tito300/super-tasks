import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";

export function DockStation() {
  return (
    <DockStationContainer>
      <DockStationAccordion sx={{ width: 385 }}>
        <DockStationAccordionSummary />
        <DockStationAccordionDetails>
          <TaskListManager />
        </DockStationAccordionDetails>
      </DockStationAccordion>
    </DockStationContainer>
  );
}
