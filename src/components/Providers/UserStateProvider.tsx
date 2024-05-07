import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TaskType } from "../Task/Task";
import { storageService } from "@src/storage/storage.service";
import { useUserSettings } from "./UserSettingsProvider";
import { capitalize } from "@mui/material";
import { TabName } from "@src/config/settingsDefaults";

export type UserState = {
  currentTab: TabName;
  buttonExpanded: boolean;
  accordionExpanded: boolean;
  blurText: boolean;
  darkMode: boolean;
};

export type UserStateContextType = UserState & {
  updateUserState: (newPartialState: Partial<UserState>) => void;
};

const UserStateContext = createContext<UserStateContextType>(null!);
export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const { userSettings } = useUserSettings();
  const [userState, setUserState] = useState<UserState>(() => {
    return {
      buttonExpanded: userSettings.buttonExpanded,
      accordionExpanded: userSettings.accordionExpanded,
      currentTab: userSettings.currentTab,
      blurText: userSettings.blurText,
      darkMode: userSettings.darkMode,
    };
  });

  useEffect(() => {
    storageService.get("userState").then((data) => {
      setUserState((userState) => ({ ...userState, ...data }));
    });

    storageService.onChange("userState", (changes) => {
      function setSyncedState(
        existingValues: UserState,
        newValues: Partial<UserState>
      ) {
        const mergedValues = { ...existingValues };
        Object.keys(existingValues).forEach((key) => {
          // @ts-ignore
          if (userSettings[`sync${capitalize(key)}`]) {
            // @ts-ignore
            mergedValues[key] = newValues[key];
          }
        });

        return mergedValues;
      }

      if (changes?.userState) {
        setUserState((userState) =>
          setSyncedState(userState, changes.userState.newValue ?? {})
        );
      }
    });
  }, []);

  const updateUserState = useCallback((newPartialState: Partial<UserState>) => {
    setUserState((userState) => {
      let Updates: Partial<UserState> | undefined;
      Object.keys(newPartialState).forEach((key) => {
        // @ts-ignore
        if (userSettings[`sync${capitalize(key)}`]) {
          Updates = {
            ...Updates,
            // @ts-ignore
            [key]: newPartialState[key],
          };
        }
      });
      if (Updates) {
        storageService.set({ userState: Updates });
      }

      return { ...userState, ...newPartialState };
    });
  }, []);

  const value = useMemo(
    () => ({
      ...userState,
      updateUserState,
    }),
    [userState, updateUserState]
  );

  return (
    <UserStateContext.Provider value={value}>
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
