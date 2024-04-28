import {
  PropsWithChildren,
  useContext,
  createContext,
  useState,
  useMemo,
} from "react";

export type GlobalState = {
  // whether the app is open. In the case of popup, it is always open.
  // in case of content script, it's only open when the user clicks on the extension icon
  open: boolean;
  toggleOpen: () => void;
};
const globalStateContext = createContext<GlobalState>(null!);

export function GlobalStateProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  const value = useMemo(() => {
    const toggleOpen = () => {
      setOpen((prev) => !prev);
    };

    return {
      open,
      toggleOpen,
    };
  }, [open]);
  return (
    <globalStateContext.Provider value={value}>
      {children}
    </globalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(globalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
