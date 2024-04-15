import {
  UserSettings,
  userSettingsDefaults,
} from "@src/config/userSettingsDefaults";
import { deepmerge } from "@mui/utils";
import React from "react";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

export type UIControls = {
  userSettings: UserSettings;
  isNewTab: boolean;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
};

const UIControlsContext = createContext<UIControls>(null!);

export function UIControlsProvider({
  children,
  userSettings: inUserSettings,
}: PropsWithChildren & { userSettings?: Partial<UserSettings> }) {
  const [userSettings, setUserSettings] = useState<UserSettings>(() =>
    deepmerge(userSettingsDefaults, inUserSettings ?? {})
  );

  const updateUserSettings = useCallback(
    (newSettings: Partial<UserSettings>) =>
      setUserSettings((userSettings) => ({
        ...userSettings,
        ...newSettings
      })),
    []
  );

  const uiControls = useMemo(() => {
    return {
      userSettings,
      isNewTab: document.location.search.includes("=newtab"),
      updateUserSettings,
    };
  }, [userSettings, updateUserSettings]);

  return (
    <UIControlsContext.Provider value={uiControls}>
      {children}
    </UIControlsContext.Provider>
  );
}

export const useUIControls = () => {
  const context = React.useContext(UIControlsContext);
  if (context === undefined) {
    throw new Error("useUIControls must be used within a UIControlsProvider");
  }
  return context;
};
