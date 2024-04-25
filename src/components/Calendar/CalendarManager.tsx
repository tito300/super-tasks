import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";

export function CalendarManager() {
  const { data: calendarEvents, isLoading } = useCalendarEvents({
    calendarId: "1",
  });

  if (isLoading) return <div>Loading...</div>;

  return <CalendarTable calendarEvents={calendarEvents!} />;
}
