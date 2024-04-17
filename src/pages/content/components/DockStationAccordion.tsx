import { collapseClasses, styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
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
  const { userSettings, updateUserSettings } = useUserSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();

  const handleExpansion = useCallback(() => {
    const newValue = !userSettings.tasksExpanded;
    if (newValue)
      queryClient.invalidateQueries({
        queryKey: ["tasks", selectedTaskListId],
      });

    updateUserSettings({ tasksExpanded: newValue });
  }, [selectedTaskListId, userSettings, queryClient]);

  const expanded = document.location?.search?.includes?.("=newtab")
    ? userSettings.tasksOpenOnNewTab
    : userSettings.tasksExpanded;

  return (
    <Accordion expanded={expanded} onChange={handleExpansion} {...props}>
      {children}
    </Accordion>
  );
}
