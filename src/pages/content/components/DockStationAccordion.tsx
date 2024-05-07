import { Fade, collapseClasses, styled } from "@mui/material";
import MuiAccordion, {
  AccordionProps,
  AccordionSlots,
} from "@mui/material/Accordion";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { constants } from "@src/config/constants";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const Accordion = styled(MuiAccordion)(() => ({
  borderRadius: "14px 16px 0 14px !important",
  [`& .${collapseClasses.hidden}`]: {
    display: "none",
  },
}));

export function DockStationAccordion({ children, ...props }: AccordionProps) {
  const { accordionExpanded, updateUserState } = useUserState();
  const { selectedTaskListId } = useTasksGlobalState();
  const queryClient = useQueryClient();
  const messageEngine = getMessageEngine("Content");

  const handleExpansion = useCallback(
    (e: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      const newValue = expanded;
      updateUserState({ accordionExpanded: newValue });
      if (newValue) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", selectedTaskListId],
        });
        messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");
      } else {
        messageEngine.sendMessage("StopFetchTasksTimer", null, "Background");
      }
      focusAddTaskInput();

      updateUserState({
        accordionExpanded: newValue,
      });
    },
    [selectedTaskListId, accordionExpanded, queryClient]
  );

  return (
    <Accordion
      disableGutters
      slotProps={{ transition: { timeout: { appear: 1, enter: 1, exit: 1 } } }}
      expanded={accordionExpanded}
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
