import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";
import { useCalendarState } from "../Providers/CalendarStateProvider";

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
  const { data: calendarEvents, isLoading } = useCalendarEvents({
    calendarId: selectedCalendarId,
  });

  return (
    <CalendarTable
      isLoading={isCalendarsLoading || isLoading}
      calendarEvents={calendarEvents!}
    />
  );
}
