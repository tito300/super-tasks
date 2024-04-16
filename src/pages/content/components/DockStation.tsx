import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { AccordionSummary } from "./DockStation.styled";
import { Accordion, Typography, AccordionDetails } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useTasks } from "@src/api/task.api";
import { DockStationAccordionSummary } from "./DockStationAccordionSummary";

export function DockStation() {
  return (
    <DockStationContainer>
      <DockStationAccordion>
        <DockStationAccordionSummary />
        <AccordionDetails
          sx={{
            maxHeight: "50vh",
            overflowY: "auto",
            overflowX: "clip",
            padding: (theme) => theme.spacing(1),
          }}
        >
          <TaskListManager />
        </AccordionDetails>
      </DockStationAccordion>
    </DockStationContainer>
  );
}
