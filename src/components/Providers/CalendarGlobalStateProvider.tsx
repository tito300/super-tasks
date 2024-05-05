// CalendarGlobalStateProvidor.tsx
import dayjs from 'dayjs';
import React, { createContext, useContext, useMemo, useReducer, useState } from 'react';

type CalendarGlobalState = {
  selectedDate: Date;
};

const calendarGlobalStateContext = createContext<CalendarGlobalState>(null!);

export const CalendarGlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalState, setGlobalState] = useState<CalendarGlobalState>({
    selectedDate: dayjs().toDate(),
  });

  const value = useMemo(() => ({
    ...globalState,
    updateSelectedDate: (date: Date) => {
      setGlobalState(globalState => ({ ...globalState, selectedDate: date }));
    },
  }), [globalState]);

  return (
    <calendarGlobalStateContext.Provider value={value}>
      {children}
    </calendarGlobalStateContext.Provider>
  );
};

export const useCalendarGlobalState = () => {
  const context = useContext(calendarGlobalStateContext);
  if (!context) {
    throw new Error(
      'useCalendarGlobalState must be used within a CalendarGlobalStateProvider',
    );
  }
  return context;
};