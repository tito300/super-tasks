import { ListCalendar, SavedCalendarEvent } from "@src/calendar.types";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import {
  CalendarSettings,
  calendarSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { deepmerge } from "@mui/utils";
import { useCalendarState } from "@src/components/Providers/CalendarStateProvider";

export const useCalendarEvents = ({
  enabled,
}: {
  enabled?: boolean;
} = {}) => {
  const { calendar: calendarService } = useServicesContext();
  const {
    data: { selectedCalendarId },
  } = useCalendarState();

  return useQuery<SavedCalendarEvent[]>({
    queryKey: ["calendar", selectedCalendarId],
    queryFn: async () => {
      if (!selectedCalendarId) return [];

      const data = await calendarService.getCalendarEvents(selectedCalendarId);
      console.log("data", data);
      return data;
    },
    enabled: !!selectedCalendarId,
    // stale time prevents refetching for things like when user focuses on page
    // If you need to force a refetch, use queryClient.invalidateQueries
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export function useCalendarLists() {
  const { calendar: calendarService } = useServicesContext();

  return useQuery<ListCalendar[]>({
    queryKey: ["calendarLists"],
    queryFn: async () => {
      const data = await calendarService.getCalendars();
      return data;
    },
    // stale time prevents refetching for things like when user focuses on page
    // If you need to force a refetch, use queryClient.invalidateQueries
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
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
