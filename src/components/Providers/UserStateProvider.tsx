import {
  createContext,
  useContext,
} from "react";
import { useUserSettings } from "./UserSettingsProvider";
import { TabName } from "@src/config/settingsDefaults";
import { useSyncedState } from "@src/hooks/useSyncedState";

export type UserState = {
  currentTab: TabName;
  buttonExpanded: boolean;
  accordionExpanded: boolean;
  blurText: boolean;
  darkMode: boolean;
};

export type UserStateContextType = {
  data: UserState;
  updateData: (newPartialState: Partial<UserState>) => void;
};

const UserStateContext = createContext<UserStateContextType>(null!);
export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const { userSettings } = useUserSettings();
  const syncedState = useSyncedState<UserState>("userState", userSettings, {
    buttonExpanded: userSettings.buttonExpanded,
    accordionExpanded: userSettings.accordionExpanded,
    currentTab: userSettings.currentTab,
    blurText: userSettings.blurText,
    darkMode: userSettings.darkMode,
  });

  return (
    <UserStateContext.Provider value={syncedState}>
      {children}
    </UserStateContext.Provider>
  );
}

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUserState must be used within a UserStateProvider");
  }
  return context;
};
