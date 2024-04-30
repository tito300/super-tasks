import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";

export function CalendarManager({
  calendarId,
  isLoading: isCalendarsLoading,
}: {
  calendarId?: string | null;
  isLoading: boolean;
}) {
  const { data: calendarEvents, isLoading } = useCalendarEvents({
    calendarId,
  });

  if (isCalendarsLoading || isLoading) return <div>Loading...</div>;

  return <CalendarTable calendarEvents={calendarEvents!} />;
}
