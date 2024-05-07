import {
  UserSettings,
  userSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useServicesContext } from "./ServicesProvider";
import { deepmerge } from "@mui/utils";

type UserSettingsContext = {
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
};

const UserSettingsContext = createContext<UserSettingsContext>(null!);

export function UserSettingsProvider({ children }: PropsWithChildren) {
  const [userSettings, setUserSettings] =
    useState<UserSettings>(userSettingsDefaults);
  const { user: userService } = useServicesContext();

  useEffect(() => {
    userService.getUserSettings().then(setUserSettings);
    storageService.onChange("userSettings", (changes) => {
      setUserSettings(
        changes?.userSettings?.newValue ?? {
          ...userSettingsDefaults,
        }
      );
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

  const value = useMemo(
    () => ({
      userSettings,
      updateUserSettings,
    }),
    [userSettings, updateUserSettings]
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettingsContext must be used within a UserSettingsProvider"
    );
  }
  return context;
};
