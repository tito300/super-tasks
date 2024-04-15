import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { AccordionSummary } from "./DockStation.styled";
import {
  Accordion,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { DockStationContainer } from "./DockStationContainer";

export function DockStation() {
  return (
    <DockStationContainer>
      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: theme => theme.palette.background.accent }}
          expandIcon={<ArrowDropDown />}
        >
          <Typography>Finish upcoming report</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TaskListManager />
        </AccordionDetails>
      </Accordion>
    </DockStationContainer>
  );
}
