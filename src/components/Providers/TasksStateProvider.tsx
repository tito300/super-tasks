import {
  createContext,
  useContext,
} from "react";
import { TaskType } from "../Task/Task";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useTasksSettingsContext } from "./TasksSettingsProvider";
import { TasksSettings } from "@src/config/settingsDefaults";

export type TasksState = {
  selectedTaskListId?: string | null;
  defaultTaskListId?: string | null;
  filters: TasksSettings["filters"];
  tasks?: {
    [taskId: string]: TaskType | undefined;
  };
};

export type TasksStateContextType = {
  data: TasksState;
  updateData: (id: Partial<TasksState>) => void;
};

const TasksStateContext = createContext<TasksStateContextType>(
  null!
);
export function TasksStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tasksSettings } = useTasksSettingsContext();
  const syncedState = useSyncedState<TasksState>(
    "tasksState",
    tasksSettings,
    {
      selectedTaskListId: null,
      defaultTaskListId: null,
      filters: tasksSettings.filters,
      tasks: {},
    }
  );

  return (
    <TasksStateContext.Provider value={syncedState}>
      {children}
    </TasksStateContext.Provider>
  );
}

export const useTasksState = () => {
  const context = useContext(TasksStateContext);
  if (!context) {
    throw new Error(
      "useTasksGlobalState must be used within a TasksGlobalStateProvider"
    );
  }
  return context;
};
