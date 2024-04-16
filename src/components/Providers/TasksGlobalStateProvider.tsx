import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
export type TasksGlobalStateContextType = {
  selectedTaskListId: string | null;
  updateSelectedTaskListId: (id: string) => void;
};

const TasksGlobalStateContext = createContext<TasksGlobalStateContextType>(
  {} as TasksGlobalStateContextType
);
export function TasksGlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedTaskListId, setSelectedTaskListId] = useState<string | null>(
    ""
  );

  const updateSelectedTaskListId = useCallback((id: string) => {
    setSelectedTaskListId(id);
  }, []);

  const value = useMemo(
    () => ({
      selectedTaskListId,
      updateSelectedTaskListId,
    }),
    [selectedTaskListId, updateSelectedTaskListId]
  );

  return (
    <TasksGlobalStateContext.Provider value={value}>
      {children}
    </TasksGlobalStateContext.Provider>
  );
}

export const useTasksGlobalState = () => {
  const context = useContext(TasksGlobalStateContext);
  if (!context) {
    throw new Error(
      "useTasksGlobalState must be used within a TasksGlobalStateProvider"
    );
  }
  return context;
};
