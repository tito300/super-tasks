import {
  createContext,
  useContext,
} from "react";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useCalendarSettings } from "./CalendarSettingsProvider";

export type CalendarsGlobalState = {
  selectedDate: Date | null;
};

export type CalendarsGlobalStateContextType = {
  data: CalendarsGlobalState;
  updateData: (id: CalendarsGlobalState) => void;
};

const CalendarsGlobalStateContext = createContext<CalendarsGlobalStateContextType>(
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
      selectedDate: new Date()
    }
  );

  return (
    <CalendarsGlobalStateContext.Provider value={syncedState}>
      {children}
    </CalendarsGlobalStateContext.Provider>
  );
}

export const useCalendarsState = () => {
  const context = useContext(CalendarsGlobalStateContext);
  if (!context) {
    throw new Error(
      "useCalendarsGlobalState must be used within a CalendarsGlobalStateProvider"
    );
  }
  return context;
};
