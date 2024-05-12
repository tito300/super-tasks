import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import {
  DockStationAccordion,
  focusAddTaskInput,
} from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { useEnhancedTasks } from "@src/hooks/useEnhancedTasks";
import { useCallback, useEffect } from "react";
import Stack from "@mui/material/Stack";
import {
  TasksStateProvider,
  useTasksGlobalState,
} from "@src/components/Providers/TasksStateProvider";
import { TasksSettingsProvider } from "@src/components/Providers/TasksSettingsProvider";
import { ArrowDropDown } from "@mui/icons-material";
import { TasksAccordionSummary } from "./TasksAccordionSummary";
import { AccordionProps } from "@mui/material";
import { AccordionSummaryStyled } from "./AccordionSummary.styled";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";

export function TasksApp() {
  const scriptType = useScriptType();

  useEnhancedTasks();

  return (
    // <TasksSettingsProvider>
    //   <TasksStateProvider>
    scriptType === "Content" ? (
      <TasksAccordion>
        <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
          <TasksAccordionSummary />
        </AccordionSummaryStyled>
        <DockStationAccordionDetails id="accordion-details">
          <Stack sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}>
            <TaskListManager />
          </Stack>
        </DockStationAccordionDetails>
      </TasksAccordion>
    ) : (
      <TaskListManager />
    )
    //   </TasksStateProvider>
    // </TasksSettingsProvider>
  );
}

function TasksAccordion({
  children,
}: {
  children: AccordionProps["children"];
}) {
  const messageEngine = useMessageEngine();
  const queryClient = useQueryClient();
  const scriptType = useScriptType();
  const {
    data: { selectedTaskListId },
  } = useTasksGlobalState();

  useEffect(() => {
    console.log("mounted TasksApp");
  }, []);

  const handleExpansion = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", selectedTaskListId],
        });
        focusAddTaskInput();
        messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");
      } else {
        messageEngine.sendMessage("StopFetchTasksTimer", null, "Background");
      }
    },
    [selectedTaskListId, queryClient, messageEngine]
  );

  return (
    <DockStationAccordion handleExpand={handleExpansion}>
      {children}
    </DockStationAccordion>
  );
}
