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

export type TasksGlobalState = {
  selectedTaskListId?: string | null;
  defaultTaskListId?: string | null;
  tasks?: {
    [taskId: string]: TaskType | undefined 
  }
};

export type TasksGlobalStateContextType = TasksGlobalState & {
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
  const [tasksState, setTasksState] = useState<TasksGlobalState>({});

  useEffect(() => {
    storageService.get("tasksState").then((data) => {
      setTasksState({ ...data });
    });

    storageService.onChange("tasksState", (changes) => {
      if (changes?.tasksState) {
        setTasksState(changes.tasksState.newValue ?? {});
      }
    });
  }, []);

  const updateSelectedTaskListId = useCallback((id: string) => {
    setTasksState(tasksState => ({ ...tasksState, selectedTaskListId: id }));
  }, []);

  const value = useMemo(
    () => ({
      ...tasksState,
      selectedTaskListId: tasksState.selectedTaskListId,
      defaultTaskListId: tasksState.selectedTaskListId,
      updateSelectedTaskListId,
    }),
    [tasksState, updateSelectedTaskListId]
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

