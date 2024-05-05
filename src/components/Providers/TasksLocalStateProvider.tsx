import { createContext, useState, useMemo, useContext } from "react";

type TasksLocalState = {
    accordionOpen?: boolean;
    buttonExpanded?: boolean;
}

const TasksLocalStateContext = createContext<TasksLocalState>(null!);

/**
 * This provider is for state that is only local to one tab
 */
export function TasksLocalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localState, setLocalState] = useState<TasksLocalState>({
    accordionOpen: false,
    buttonExpanded: false,
  });

  const value = useMemo(
    () => ({
      ...localState,
      updateLocalState: (newState: Partial<TasksLocalState>) => {
        setLocalState((prevState) => ({
          ...prevState,
          ...newState,
        }));
      },
    }),
    [localState]
  );

  return (
    <TasksLocalStateContext.Provider value={value}>
      {children}
    </TasksLocalStateContext.Provider>
  );
}

export const useTasksLocalState = () => {
  const context = useContext(TasksLocalStateContext);
  if (!context) {
    throw new Error(
      "useTasksLocalState must be used within a TasksLocalStateProvider"
    );
  }
  return context;
}