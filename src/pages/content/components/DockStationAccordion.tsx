import { collapseClasses, styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { useTaskLists, useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const Accordion = styled(MuiAccordion)(() => ({
  [`& .${collapseClasses.hidden}`]: {
    display: "none",
  },
}));

export function DockStationAccordion({ children, ...props }: AccordionProps) {
  const { userSettings, updateUserSettings, isNewTab } =
    useUserSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();

  const handleExpansion = useCallback(() => {
    const newValue = !userSettings.tasksExpanded;
    if (newValue)
      queryClient.invalidateQueries({
        queryKey: ["tasks", selectedTaskListId],
      });

    updateUserSettings({
      tasksExpanded: newValue,
      tasksOpenOnNewTab: isNewTab ? newValue : userSettings.tasksOpenOnNewTab,
    });
  }, [selectedTaskListId, userSettings, queryClient]);

  const expanded = isNewTab
    ? userSettings.tasksOpenOnNewTab
    : userSettings.tasksExpanded;

  return (
    <Accordion expanded={expanded} onChange={handleExpansion} {...props}>
      {children}
    </Accordion>
  );
}
