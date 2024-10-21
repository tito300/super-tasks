import { createContext, useContext } from "react";
import { useUserSettings } from "./UserSettingsProvider";
import { TabName, UserSettings } from "@src/config/settingsDefaults";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useScriptType } from "./ScriptTypeProvider";

export type UserState = {
  currentTab: TabName;
  buttonExpanded: boolean;
  accordionExpanded: boolean;
  blurText: boolean;
  darkMode: boolean;
  tokens: UserSettings["tokens"];
  selectedApps: UserSettings["selectedApps"];
  position: { x: number | null; y: number | null };
};

export type UserStateContextType = {
  data: UserState;
  updateData: (newPartialState: Partial<UserState>) => void;
  dataSyncing: boolean;
};

const UserStateContext = createContext<UserStateContextType>(null!);
export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const scriptType = useScriptType();
  const { userSettings } = useUserSettings();
  const syncedState = useSyncedState<UserState>("userState", userSettings, {
    buttonExpanded: userSettings.buttonExpanded,
    accordionExpanded: userSettings.accordionExpanded,
    currentTab: userSettings.currentTab,
    blurText: userSettings.blurText,
    darkMode: userSettings.darkMode,
    tokens: userSettings.tokens,
    selectedApps: userSettings.selectedApps,
    position:
      scriptType === "Content"
        ? { x: window.innerWidth - 38, y: window.innerHeight - 32 }
        : { x: null, y: null },
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
