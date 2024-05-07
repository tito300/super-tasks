import { Fade, collapseClasses, styled } from "@mui/material";
import MuiAccordion, {
  AccordionProps,
  AccordionSlots,
} from "@mui/material/Accordion";
import { useTasksGlobalState } from "@src/components/Providers/TasksStateProvider";
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

export function DockStationAccordion({
  children,
  handleExpand,
  ...props
}: AccordionProps & {
  handleExpand?: (expanded: boolean) => void;
}) {
  const {
    data: { accordionExpanded },
    updateData: updateUserState,
  } = useUserState();

  const handleExpansion = useCallback(
    (e: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      updateUserState({
        accordionExpanded: expanded,
      });
      handleExpand?.(expanded);
    },
    [accordionExpanded, handleExpand]
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
