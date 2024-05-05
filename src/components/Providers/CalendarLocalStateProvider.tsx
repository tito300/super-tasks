import { createContext, useState, useMemo, useContext } from "react";

type CalendarLocalState = {
    accordionOpen?: boolean;
}

const CalendarLocalStateContext = createContext<CalendarLocalState>(null!);

/**
 * This provider is for state that is only local to one tab
 */
export function CalendarLocalStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [localState, setLocalState] = useState<CalendarLocalState>({
        accordionOpen: false,
    });

    const value = useMemo(
        () => ({
            ...localState,
            updateLocalState: (newState: Partial<CalendarLocalState>) => {
                setLocalState((prevState) => ({
                    ...prevState,
                    ...newState,
                }));
            },
        }),
        [localState]
    );

    return (
        <CalendarLocalStateContext.Provider value={value}>
            {children}
        </CalendarLocalStateContext.Provider>
    );
}

export const useCalendarLocalState = () => {
    const context = useContext(CalendarLocalStateContext);
    if (!context) {
        throw new Error(
            "useCalendarLocalState must be used within a CalendarLocalStateProvider"
        );
    }
    return context;
}

