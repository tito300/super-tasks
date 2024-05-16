import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useEffect, useMemo } from "react";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { LinearProgress, Stack } from "@mui/material";
import { CalendarControls } from "./CalendarControls";

export function CalendarListManager() {
  const { data: calendarList, isLoading } = useCalendarLists();
  const {
    data: { selectedCalendarId },
    updateData: updateCalendarState,
  } = useCalendarState();

  useEffect(() => {
    if (!selectedCalendarId && !!calendarList?.length) {
      updateCalendarState({
        selectedCalendarId: calendarList.find((c) => c.primary)?.id,
      });
    }
  }, [calendarList, selectedCalendarId]);

  return (
    <Stack>
      <CalendarControls pl={1} isLoading={isLoading} />
      <CalendarManager isLoading={isLoading} />
    </Stack>
  );
}
