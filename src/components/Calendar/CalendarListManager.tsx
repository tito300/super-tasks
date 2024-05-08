import { useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useEffect, useMemo } from "react";
import { useCalendarState } from "../Providers/CalendarStateProvider";

export function CalendarListManager() {
  const { data: calendarList, isLoading } = useCalendarLists();
  const {
    data: { selectedCalendarId },
    updateData: updateCalendarState,
  } = useCalendarState();

  useEffect(() => {
    if (!selectedCalendarId && !!calendarList?.length) {
      updateCalendarState({ selectedCalendarId: calendarList[0].id });
    }
  }, [calendarList, selectedCalendarId]);

  const primaryCalendar = useMemo(() => {
    return calendarList?.find((calendar) => calendar.primary) || null;
  }, [calendarList]);

  return (
    <CalendarManager calendarId={primaryCalendar?.id} isLoading={isLoading} />
  );
}
