import { ListCalendar, SavedCalendarEvent } from "@src/calendar.types";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import {
  CalendarSettings,
  calendarSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { useState, useEffect, useCallback } from "react";
import { deepmerge } from "@mui/utils";
import { useCalendarState } from "@src/components/Providers/CalendarStateProvider";
import { useCustomQuery } from "@src/hooks/useCustomQuery";
import { UseQueryOptions } from "@tanstack/react-query";

export const useCalendarEvents = ({
  enabled,
}: {
  enabled?: boolean;
} = {}) => {
  const { calendar: calendarService } = useServicesContext();
  const {
    data: { selectedCalendarId },
  } = useCalendarState();

  return useCustomQuery<SavedCalendarEvent[]>({
    queryKey: ["calendar", selectedCalendarId],
    queryFn: async () => {
      const data = await calendarService.getCalendarEvents(selectedCalendarId);
      return data;
    },
    enabled: !!selectedCalendarId || enabled,
    // stale time prevents refetching for things like when user focuses on page
    // If you need to force a refetch, use queryClient.invalidateQueries
  });
};

export const useCachedCalendarEvents = () => {
  const { calendar: calendarService } = useServicesContext();
  const {
    data: { selectedCalendarId },
  } = useCalendarState();

  return useCustomQuery<SavedCalendarEvent[]>({
    queryKey: ["calendar", "cached", selectedCalendarId],
    queryFn: async () => {
      const data = await calendarService.getCalendarEvents(selectedCalendarId, {
        useCacheOnly: true,
      });
      return data;
    },
    enabled: !!selectedCalendarId,
  });
};

export const useCachedCalendarLists = () => {
  const { calendar: calendarService } = useServicesContext();

  return useCustomQuery<ListCalendar[]>({
    queryKey: ["calendarLists", "cached"],
    queryFn: async () => {
      const data = await calendarService.getCalendars({ useCacheOnly: true });
      return data;
    },
    enabled: true,
  });
};

export function useCalendarLists(options: { enabled?: boolean } = {}) {
  const { calendar: calendarService } = useServicesContext();

  return useCustomQuery<ListCalendar[]>({
    ...options,
    queryKey: ["calendarLists"],
    queryFn: async () => {
      const data = await calendarService.getCalendars();
      return data;
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
