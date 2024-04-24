import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { DockStationAccordion } from "./DockStationAccordion";
import { DockStationAccordionDetails } from "./DockStationAccordionDetails";
import { AccordionSummary, DockStationAccordionSummary } from "./DockStationAccordionSummary";
import { Accordion, AccordionProps } from "@mui/material";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { useQueryClient } from "@tanstack/react-query";
import { constants } from "buffer";
import { useCallback } from "react";

export function CalendarApp() {
    return (
      <CalendarAccordion>
        <CalendarAccordionSummary />
        <DockStationAccordionDetails>
          <CalendarManager />
        </DockStationAccordionDetails>
      </CalendarAccordion>
    );
  }

export function CalendarAccordion({ children, ...props }: AccordionProps) {
    const { userSettings, updateUserSettings, isNewTab } =
      useUserSettingsContext();
    const queryClient = useQueryClient();
    const messageEngine = getMessageEngine("Content");

    const handleExpansion = useCallback(() => {
      updateUserSettings({
        accordionExpanded: !userSettings.accordionExpanded,
      });
    }, [updateUserSettings, userSettings.accordionExpanded])
  
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

function CalendarAccordionSummary() {
    return (
      <AccordionSummary>
        Calendar
      </AccordionSummary>
    );
  }