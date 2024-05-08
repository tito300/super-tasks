import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useEffect, useMemo } from "react";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { LinearProgress, Stack } from "@mui/material";
import { CalendarControls } from "./CalendarControls";

export function CalendarListManager() {
  const { data: calendarList, isFetching: isListFetching } = useCalendarLists();
  const {
    data: { selectedCalendarId },
    updateData: updateCalendarState,
  } = useCalendarState();
  const { data, isFetching: isEventsFetching } = useCalendarEvents({
    calendarId: selectedCalendarId,
  });

  useEffect(() => {
    if (!selectedCalendarId && !!calendarList?.length) {
      updateCalendarState({ selectedCalendarId: calendarList[0].id });
    }
  }, [calendarList, selectedCalendarId]);

  const primaryCalendar = useMemo(() => {
    return calendarList?.find((calendar) => calendar.primary) || null;
  }, [calendarList]);

  const isLoading = isListFetching || isEventsFetching;

  return (
    <Stack>
      <CalendarControls pl={1} isLoading={isLoading} />
      <CalendarManager calendarId={primaryCalendar?.id} isLoading={isLoading} />
    </Stack>
  );
}
