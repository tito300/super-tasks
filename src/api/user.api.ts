import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import {
  TasksSettings,
  UserSettings,
  tasksSettingsDefaults,
  userSettingsDefaults,
} from "@src/config/settingsDefaults";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { deepmerge } from "@mui/utils";

export function useUserSettings() {
  const [userSettings, setUserSettings] =
    React.useState<UserSettings>(userSettingsDefaults);
  const { user: userService } = useServicesContext();

  useEffect(() => {
    userService.getUserSettings().then(setUserSettings);
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.userSettings) {
        setUserSettings(changes.userSettings.newValue);
      }
    });
  }, []);

  const updateUserSettings = useCallback(
    (newSettings: Partial<UserSettings>) => {
      setUserSettings((prevSettings) => {
        const settings = deepmerge(prevSettings, newSettings);
        userService.updateUserSettings(settings);
        return settings;
      });
    },
    [userService]
  );

  return {
    userSettings,
    updateUserSettings,
  };
}

export function useUpdateUserSettings() {
  const { user: userService } = useServicesContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      return userService.updateUserSettings(settings);
    },
    onMutate: async (newSettings: UserSettings) => {
      await queryClient.cancelQueries({ queryKey: ["userSettings"] });
      const previousSettings = queryClient.getQueryData(["userSettings"]);
      queryClient.setQueryData(["userSettings"], newSettings);
      return { previousSettings };
    },
    /**
     * ⚠️ failures in userSettings should not cause disruption to user flow so we ignore them
     */
    // onError: (err, newSettings, context) => {
    //   queryClient.setQueryData(["userSettings"], context?.previousSettings);
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    // },
    // mutationKey: ["userSettings"],
  });
}
