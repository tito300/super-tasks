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

export type TasksGlobalState = {
  selectedTaskListId?: string | null;
  defaultTaskListId?: string | null;
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
  const { tasksState, updateTasksState } = useTasksState();
  const queryClient = useQueryClient();
  const messageEngine = useMessageEngine();

  /**
   * Invalidate tasks query when tasks are updated on background script
   * due to alarm trigger
   */
  useEffect(() => {
    console.log("useEffect");
    const cleanup = messageEngine.onMessage("TasksUpdated", async () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", tasksState.selectedTaskListId]});
      console.log("TasksUpdated")
    })
    return () => {
      cleanup();
    }
  }, [tasksState.selectedTaskListId, messageEngine, queryClient]);

  const updateSelectedTaskListId = useCallback((id: string) => {
    updateTasksState({ selectedTaskListId: id });
  }, []);

  const value = useMemo(
    () => ({
      selectedTaskListId: tasksState.selectedTaskListId,
      defaultTaskListId: tasksState.selectedTaskListId,
      updateSelectedTaskListId,
    }),
    [tasksState.selectedTaskListId, updateSelectedTaskListId]
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
