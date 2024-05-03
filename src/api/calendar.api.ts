import { ListCalendar, SavedCalendarEvent } from "@src/calendar.types";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { CalendarSettings, calendarSettingsDefaults } from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { deepmerge } from "@mui/utils";

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
        console.log("useCalendars queryFn called: ", calendarId);
        if (!calendarId) return [];
  
        try {
          const data = await calendarService.getCalendarEvents(calendarId);
            console.log("useCalendarEvents queryFn data: ", data)
          return data;
        } catch (err) {
          console.log("error fetching calendar");
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

  export function useCalendarSettings() {
    const [calendarSettings, setCalendarsSettings] = useState<CalendarSettings>(
      calendarSettingsDefaults
    );
    const { calendar: calendarService } = useServicesContext();
  
    useEffect(() => {
      calendarService.getCalendarSettings().then(setCalendarsSettings);
      storageService.onChange("calendarSettings", (changes) => {
        setCalendarsSettings(
          changes?.calendarSettings?.newValue ?? {
            ...calendarSettingsDefaults,
          }
        );
      });
    }, []);
  
    const updateCalendarsSettings = useCallback(
      (newSettings: Partial<CalendarSettings>) => {
        setCalendarsSettings((prevSettings) => {
          const settings = deepmerge(prevSettings, newSettings);
          calendarService.updateCalendarSettings(settings);
          return settings;
        });
      },
      [calendarService]
    );
  
    return {
      calendarSettings,
      updateCalendarsSettings,
    };
  }