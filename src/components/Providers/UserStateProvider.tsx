import { createContext, useContext } from "react";
import { useUserSettings } from "./UserSettingsProvider";
import { TabName, UserSettings } from "@src/config/settingsDefaults";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useScriptType } from "./ScriptTypeProvider";

export type SubscriptionType = "free" | "premium";

export type UserState = {
  currentTab: TabName;
  buttonExpanded: boolean;
  accordionExpanded: boolean;
  blurText: boolean;
  darkMode: boolean;
  tokens: UserSettings["tokens"];
  email: string;
  chromeId: string;
  subscriptionType: SubscriptionType;
  selectedApps: UserSettings["selectedApps"];
  authWarningDismissed: boolean;
  authWarningDismissedAt: number | null;
  position: {
    distanceFromRight: number | null;
    distanceFromTop: number | null;
  };
};

export type UserStateContextType = {
  data: UserState;
  updateData: (newPartialState: Partial<UserState>) => void;
  dataSyncing: boolean;
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
    tokens: userSettings.tokens,
    selectedApps: userSettings.selectedApps,
    position: { distanceFromRight: null, distanceFromTop: null },
    authWarningDismissed: false,
    authWarningDismissedAt: null,
    email: "",
    chromeId: "",
    subscriptionType: "free",
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
