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
import { useUpdateUserSettings, useUserSettings } from "@src/api/user.api";

export type UserSettingsContext = {
  userSettings: UserSettings;
  isNewTab: boolean;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
};

const userSettingsContext = createContext<UserSettingsContext>(null!);

export function UseSettingsProvider({
  children,
  userSettings: inUserSettings,
}: PropsWithChildren & { userSettings?: Partial<UserSettings> }) {
  // const [userSettings, setUserSettings] = useState<UserSettings>(() =>
  //   deepmerge(userSettingsDefaults, inUserSettings ?? {})
  // );
  const { data: userSettings } = useUserSettings();
  const mutateUserSettings = useUpdateUserSettings();

  const updateUserSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      const settings = { ...userSettings, ...newSettings } as UserSettings;
      mutateUserSettings.mutateAsync(settings);
    },
    [userSettings, mutateUserSettings]
  );

  const uiControls = useMemo(() => {
    return {
      userSettings: userSettings!,
      isNewTab: document.location.search.includes("=newtab"),
      updateUserSettings,
    };
  }, [userSettings, updateUserSettings]);

  return (
    <userSettingsContext.Provider value={uiControls}>
      {children}
    </userSettingsContext.Provider>
  );
}

export const useUserSettingsContext = () => {
  const context = React.useContext(userSettingsContext);
  if (context === undefined) {
    throw new Error("useUIControls must be used within a UIControlsProvider");
  }
  return context;
};
