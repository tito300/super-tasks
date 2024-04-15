import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { AccordionSummary } from "./DockStation.styled";
import { Accordion, Typography, AccordionDetails } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { DockStationContainer } from "./DockStationContainer";
import { DockStationAccordion } from "./DockStationAccordion";

export function DockStation() {
  return (
    <DockStationContainer>
      <DockStationAccordion>
        <AccordionSummary
          sx={{ backgroundColor: (theme) => theme.palette.background.accent }}
          expandIcon={<ArrowDropDown />}
        >
          <Typography>Finish upcoming report</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          <TaskListManager />
        </AccordionDetails>
      </DockStationAccordion>
    </DockStationContainer>
  );
}
