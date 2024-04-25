import {
  UserSettings,
  userSettingsDefaults,
} from "@src/config/userSettingsDefaults";
import { deepmerge } from "@mui/utils";
import React, { useEffect } from "react";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useUpdateUserSettings, useUserSettings } from "@src/api/user.api";
import { useMessageEngine } from "./MessageEngineProvider";
import { useQueryClient } from "@tanstack/react-query";
import { DeepPartial } from "react-hook-form";

export type UserSettingsContext = {
  userSettings: UserSettings;
  isNewTab: boolean;
  updateUserSettings: (newSettings: DeepPartial<UserSettings>) => void;
};

const userSettingsContext = createContext<UserSettingsContext>(null!);

export function UserSettingsProvider({
  children,
  userSettings: inUserSettings,
}: PropsWithChildren & {
  userSettings?: DeepPartial<Omit<UserSettings, "tasks" | "calendar">>;
}) {
  // const [userSettings, setUserSettings] = useState<UserSettings>(() =>
  //   deepmerge(userSettingsDefaults, inUserSettings ?? {})
  // );
  const { data: userSettings } = useUserSettings();
  const mutateUserSettings = useUpdateUserSettings();
  const messageEngine = useMessageEngine();
  const queryClient = useQueryClient();

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.userSettings) {
        queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      }
    });
  }, []);

  const updateUserSettings = useCallback(
    (newSettings: DeepPartial<UserSettings>) => {
      const settings = deepmerge(userSettings, newSettings) as UserSettings;
      mutateUserSettings.mutate(settings);
    },
    [userSettings, mutateUserSettings, messageEngine]
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
