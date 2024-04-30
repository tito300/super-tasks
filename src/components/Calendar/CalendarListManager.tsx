import { useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useMemo } from "react";

export function CalendarListManager() {
    const { data: calendarList, isLoading } = useCalendarLists();

    const primaryCalendar = useMemo(() => {
        return calendarList?.find((calendar) => calendar.primary) || null;
    }, [calendarList]);

    return <CalendarManager calendarId={primaryCalendar?.id} isLoading={isLoading} />;
}