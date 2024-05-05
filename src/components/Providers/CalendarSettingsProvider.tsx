import { CalendarSettings, calendarSettingsDefaults } from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useServicesContext } from "./ServicesProvider";
import { deepmerge } from "@mui/utils";

type CalendarSettingsContext = {
  calendarSettings: CalendarSettings;
  updateCalendarSettings: (newSettings: Partial<CalendarSettings>) => void;
};

const CalendarSettingsContext = createContext<CalendarSettingsContext>(null!);

export function CalendarSettingsProvider({ children }: PropsWithChildren) {
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(
    calendarSettingsDefaults
  );
  const { calendar: calendarService } = useServicesContext();

  useEffect(() => {
    calendarService.getCalendarSettings().then(setCalendarSettings);
    storageService.onChange("calendarSettings", (changes) => {
      setCalendarSettings(
        changes?.calendarSettings?.newValue ?? {
          ...calendarSettingsDefaults,
        }
      );
    });
  }, []);

  const updateCalendarSettings = useCallback(
    (newSettings: Partial<CalendarSettings>) => {
      setCalendarSettings((prevSettings) => {
        const settings = deepmerge(prevSettings, newSettings);
        calendarService.updateCalendarSettings(settings);
        return settings;
      });
    },
    [calendarService]
  );

  const value = useMemo(() => ({
    calendarSettings,
    updateCalendarSettings,
  }), [calendarSettings, updateCalendarSettings]);

  return (
    <CalendarSettingsContext.Provider value={value}>
      {children}
    </CalendarSettingsContext.Provider>
  );
}

export const useCalendarSettings = () => {
    const context = useContext(CalendarSettingsContext);
    if (!context) {
        throw new Error(
        "useCalendarSettings must be used within a CalendarSettingsProvider"
        );
    }
    return context;
}