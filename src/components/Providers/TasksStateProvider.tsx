import { useTasksState } from "@src/api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMessageEngine } from "./MessageEngineProvider";
import { TaskType } from "../Task/Task";
import { storageService } from "@src/storage/storage.service";
import { useSyncedState } from "@src/hooks/useSyncedState";
import { useTasksSettingsContext } from "./TasksSettingsProvider";

export type TasksGlobalState = {
  selectedTaskListId?: string | null;
  defaultTaskListId?: string | null;
  tasks?: {
    [taskId: string]: TaskType | undefined;
  };
};

export type TasksGlobalStateContextType = {
  data: TasksGlobalState;
  updateData: (id: TasksGlobalState) => void;
};

const TasksGlobalStateContext = createContext<TasksGlobalStateContextType>(
  null!
);
export function TasksStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tasksSettings } = useTasksSettingsContext();
  const syncedState = useSyncedState<TasksGlobalState>(
    "tasksState",
    tasksSettings,
    {
      selectedTaskListId: null,
      defaultTaskListId: null,
      tasks: {},
    }
  );

  return (
    <TasksGlobalStateContext.Provider value={syncedState}>
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
