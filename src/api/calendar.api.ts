import { ListCalendar, SavedCalendarEvent } from "@src/calendar.types";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useQuery } from "@tanstack/react-query";

export const useCalendarEvents = ({
    enabled,
    calendarId,
  }: {
    calendarId: string | null | undefined;
    enabled?: boolean;
  }) => {
    const { calendar: calendarService } = useServicesContext();
  
    return useQuery<SavedCalendarEvent[]>({
      queryKey: ["calendar", calendarId],
      placeholderData: [] as SavedCalendarEvent[],
      queryFn: async () => {
        console.log("useTasks queryFn called: ", calendarId);
        if (!calendarId) return [];
  
        try {
          const data = await calendarService.getCalendarEvents(calendarId);
            console.log("useCalendarEvents queryFn data: ", data)
          return data;
        } catch (err) {
          console.log("error fetching tasks");
          console.error(err);
          return [];
        }
      },
      enabled: !!calendarId,
    });
  };

  export function useCalendarLists() {
    const { calendar: calendarService } = useServicesContext();
  
    return useQuery<ListCalendar[]>({
      queryKey: ["calendarLists"],
      queryFn: async () => {
        try {
          const data = await calendarService.getCalendars();
          return data;
        } catch (err) {
          console.log("error fetching calendar lists");
          console.error(err);
          return [];
        }
      },
    });
  }