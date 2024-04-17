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
  const { userSettings } = useUserSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState<boolean>(() => {
    return userSettings.tasksOpenOnNewTab &&
      !!document.location.search.includes("=newtab")
  });

  const handleExpansion = useCallback(() => {
    setExpanded((prevExpanded) => {
      const expanded = !prevExpanded === true;
      if (expanded) queryClient.invalidateQueries({ queryKey: ["tasks", selectedTaskListId] });
      
      return !prevExpanded
    });
  }, [selectedTaskListId]);

  return (
    <Accordion expanded={expanded} onChange={handleExpansion} {...props}>
      {children}
    </Accordion>
  );
}
