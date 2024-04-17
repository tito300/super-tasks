import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { AccordionSummary } from "./DockStation.styled";
import { Accordion, Typography, AccordionDetails } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useTasks } from "@src/api/task.api";
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
