import { TaskListManager } from "@src/components/Task/TaskListManager/TaskListManager";
import {
  DockStationAccordion,
  focusAddTaskInput,
} from "../../pages/content/components/DockStationAccordion";
import { useEnhancedTasks } from "@src/hooks/useEnhancedTasks";
import { useCallback } from "react";
import { useTasksState } from "@src/components/Providers/TasksStateProvider";
import { AccordionProps } from "@mui/material";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useLogRender } from "@src/hooks/useLogRender";

export function TasksApp() {
  useLogRender("TasksApp");
  useEnhancedTasks();

  return (
    // <TasksSettingsProvider>
    //   <TasksStateProvider>
    // scriptType === "Content" ? (
    //   <TasksAccordion>
    //     <AccordionSummaryStyled expandIcon={<ArrowDropDown />}>
    //       <TasksAccordionSummary />
    //     </AccordionSummaryStyled>
    //     <DockStationAccordionDetails id="accordion-details">
    //       <Stack sx={{ height: "50vh", overflowY: "auto", overflowX: "clip" }}>
    //         <TaskListManager />
    //       </Stack>
    //     </DockStationAccordionDetails>
    //   </TasksAccordion>
    // ) : (
    <TaskListManager />
    // )
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
  } = useTasksState();

  const handleExpansion = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", selectedTaskListId],
        });
        focusAddTaskInput();
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
