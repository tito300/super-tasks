import {
  createContext,
  useContext,
} from "react";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useCalendarSettings } from "./CalendarSettingsProvider";

export type CalendarsGlobalState = {
  selectedDate?: Date | null;
  selectedCalendarId?: string | null;
};

export type CalendarsStateContextType = {
  data: CalendarsGlobalState;
  updateData: (id: CalendarsGlobalState) => void;
};

const CalendarsStateContext = createContext<CalendarsStateContextType>(
  null!
);
export function CalendarsStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { calendarSettings } = useCalendarSettings();
  const syncedState = useSyncedState<CalendarsGlobalState>(
    "calendarState",
    calendarSettings,
    {
      selectedDate: new Date(),
      selectedCalendarId: null,
    }
  );

  return (
    <CalendarsStateContext.Provider value={syncedState}>
      {children}
    </CalendarsStateContext.Provider>
  );
}

export const useCalendarState = () => {
  const context = useContext(CalendarsStateContext);
  if (!context) {
    throw new Error(
      "useCalendarState must be used within a CalendarsGlobalStateProvider"
    );
  }
  return context;
};
