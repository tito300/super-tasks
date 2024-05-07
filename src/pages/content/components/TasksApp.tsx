import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { useEnhancedTasks } from "@src/hooks/useEnhancedTasks";
import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { TasksGlobalStateProvider } from "@src/components/Providers/TasksGlobalStateProvider";
import { TasksLocalStateProvider } from "@src/components/Providers/TasksLocalStateProvider";
import { TasksSettingsProvider } from "@src/components/Providers/TasksSettingsProvider";
import { ArrowDropDown } from "@mui/icons-material";
import { TasksAccordionSummary } from "./TasksAccordionSummary";
import {
  AccordionSummary as MuiAccordionSummary,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { AccordionSummaryStyled } from "./AccordionSummary.styled";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";

export function TasksApp() {
  const scriptType = useScriptType();
  useEnhancedTasks();

  useEffect(() => {
    console.log("mounted TasksApp");
    console.log("scriptType", scriptType);
  }, []);

  return (
    <TasksSettingsProvider>
      <TasksGlobalStateProvider>
        <TasksLocalStateProvider>
          {scriptType === "Content" ? (
            <DockStationAccordion>
              <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
                <TasksAccordionSummary />
              </AccordionSummaryStyled>
              <DockStationAccordionDetails id="accordion-details">
                <Stack
                  sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}
                >
                  <TaskListManager />
                </Stack>
              </DockStationAccordionDetails>
            </DockStationAccordion>
          ) : (
            <TaskListManager />
          )}
        </TasksLocalStateProvider>
      </TasksGlobalStateProvider>
    </TasksSettingsProvider>
  );
}
