import { storageService } from "@src/storage/storage.service";
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { useUserSettings } from "./UserSettingsProvider";

type UserLocalState = {
  accordionOpen?: boolean;
  buttonExpanded?: boolean;
};

const UserLocalStateContext = createContext<UserLocalState>(null!);

/**
 * This provider is for state that is only local to one tab
 */
export function UserLocalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localState, setLocalState] = useState<UserLocalState>({
    accordionOpen: false,
    buttonExpanded: false,
  });
  const { userSettings } = useUserSettings();

  useEffect(() => {
    storageService.onChange("userState", (changes) => {
      if (changes?.userState) {
        if (true) setLocalState(changes.userState.newValue ?? {});
      }
    });
  }, [userSettings]);

  const value = useMemo(
    () => ({
      ...localState,
      updateLocalState: (newState: Partial<UserLocalState>) => {
        setLocalState((prevState) => ({
          ...prevState,
          ...newState,
        }));
      },
    }),
    [localState]
  );

  return (
    <UserLocalStateContext.Provider value={value}>
      {children}
    </UserLocalStateContext.Provider>
  );
}

export const useUserLocalState = () => {
  const context = useContext(UserLocalStateContext);
  if (!context) {
    throw new Error(
      "useUserLocalState must be used within a UserLocalStateProvider"
    );
  }
  return context;
};
