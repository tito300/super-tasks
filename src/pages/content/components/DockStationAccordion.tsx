import { Fade, collapseClasses, styled } from "@mui/material";
import MuiAccordion, {
  AccordionProps,
  AccordionSlots,
} from "@mui/material/Accordion";
import { useTaskLists, useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
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
  const { userSettings, updateUserSettings, isNewTab } =
    useUserSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();
  const messageEngine = getMessageEngine("Content");

  const handleExpansion = useCallback(() => {
    const newValue = !userSettings.accordionExpanded;
    if (newValue) {
      queryClient.invalidateQueries({
        queryKey: ["tasks", selectedTaskListId],
      });
      messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");
    } else {
      messageEngine.sendMessage("StopFetchTasksTimer", null, "Background");
    }

    updateUserSettings({
      accordionExpanded: newValue,
    });

    focusAddTaskInput();
  }, [selectedTaskListId, userSettings, queryClient]);

  const expanded = userSettings.accordionExpanded;

  return (
    <Accordion
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
