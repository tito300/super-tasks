import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { useEffect } from "react";
import { useUserState } from "../Providers/UserStateProvider";

export function CalendarManager({
  calendarId,
  isLoading: isCalendarsLoading,
}: {
  calendarId?: string | null;
  isLoading: boolean;
}) {
  const {
    data: { selectedCalendarId },
  } = useCalendarState();
  const {
    data: { accordionExpanded },
  } = useUserState();
  const {
    data: calendarEvents,
    isLoading,
    refetch,
  } = useCalendarEvents({
    calendarId: selectedCalendarId,
  });

  useEffect(() => {
    if (accordionExpanded) {
      refetch();
    }
  }, [accordionExpanded]);

  return (
    <CalendarTable
      isLoading={isCalendarsLoading || isLoading}
      calendarEvents={calendarEvents!}
    />
  );
}
