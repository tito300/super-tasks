import React from "react";
import { PropsWithChildren, createContext, useCallback, useMemo, useState } from "react";

export type UIControls = {
    darkMode: boolean;
    toggleDarkMode: () => void;

    defaultOpen: boolean;
    toggleDefaultOpen: () => void;
};

const UIControlsContext = createContext<UIControls>(null!);
export function UIControlsProvider({ children, defaultOpen: inDefaultOpen }: PropsWithChildren & { defaultOpen?: boolean }) {
    const [darkMode, setDarkMode] = useState(false);
    const [defaultOpen, setDefaultOpen] = useState(inDefaultOpen ?? false);

    const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);
    const toggleDefaultOpen = useCallback(() => setDefaultOpen((prev) => !prev), []);
    
    const uiControls = useMemo(() => {
        return {
            darkMode: false,
            toggleDarkMode: toggleDarkMode,

            defaultOpen: false,
            toggleDefaultOpen: toggleDarkMode,
        };
    }, [darkMode, defaultOpen, toggleDarkMode, toggleDefaultOpen]);

    return <UIControlsContext.Provider value={uiControls}>{children}</UIControlsContext.Provider>;
}

export const useUIControls = () => {
    const context = React.useContext(UIControlsContext);
    if (context === undefined) {
        throw new Error("useUIControls must be used within a UIControlsProvider");
    }
    return context;
}