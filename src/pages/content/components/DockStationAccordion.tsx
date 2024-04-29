import { Fade, collapseClasses, styled } from "@mui/material";
import MuiAccordion, {
  AccordionProps,
  AccordionSlots,
} from "@mui/material/Accordion";
import { useTaskLists, useTasks } from "@src/api/task.api";
import { useUserSettings } from "@src/api/user.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { constants } from "@src/config/constants";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const Accordion = styled(MuiAccordion)(() => ({
  [`& .${collapseClasses.hidden}`]: {
    display: "none",
  },
}));

export function DockStationAccordion({ children, ...props }: AccordionProps) {
  const { userSettings, updateUserSettings } = useUserSettings();
  const [localExpanded, setLocalExpanded] = useState(
    userSettings.accordionExpanded
  );
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();
  const messageEngine = getMessageEngine("Content");

  const handleExpansion = useCallback(
    (e: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      const newValue = expanded;
      setLocalExpanded(newValue);
      if (newValue) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", selectedTaskListId],
        });
        messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");
      } else {
        messageEngine.sendMessage("StopFetchTasksTimer", null, "Background");
      }
      focusAddTaskInput();

      if (!userSettings.syncAccordionExpanded) return;

      updateUserSettings({
        accordionExpanded: newValue,
      });
    },
    [selectedTaskListId, userSettings.accordionExpanded, queryClient]
  );

  const expanded = userSettings.syncAccordionExpanded
    ? userSettings.accordionExpanded
    : localExpanded;

  return (
    <Accordion
      disableGutters
      slotProps={{ transition: { timeout: { appear: 1, enter: 1, exit: 1 } } }}
      expanded={expanded}
      onChange={handleExpansion}
      {...props}
    >
      {children}
    </Accordion>
  );
}

export function focusAddTaskInput() {
  requestIdleCallback(() => {
    const shadowHost = document.getElementById(
      `${constants.EXTENSION_NAME}-root`
    )?.shadowRoot;
    const addTaskButton = shadowHost?.getElementById(
      `${constants.EXTENSION_NAME}-add-task`
    );
    if (addTaskButton) {
      addTaskButton.click();
    }
    requestAnimationFrame(() => {
      const taskTitle = shadowHost?.getElementById(
        `${constants.EXTENSION_NAME}-task-title-field`
      );
      if (taskTitle) {
        taskTitle.focus();
      }
    });
  });
}
