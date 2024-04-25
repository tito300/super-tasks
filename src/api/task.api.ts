import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SavedTask, TaskEnhanced } from "../components/Task/Task";
import { arrayMove } from "@dnd-kit/sortable";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useCallback, useEffect, useState } from "react";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { TasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettings } from "./user.api";
import {
  TasksSettings,
  tasksSettingsDefaults,
} from "@src/config/userSettingsDefaults";
import React from "react";
import { deepmerge } from "@mui/utils";

export type TaskList = {
  id: string;
  title: string;
};

export function useTasksSettings() {
  const [tasksSettings, setTasksSettings] = React.useState<TasksSettings>(
    tasksSettingsDefaults
  );
  const { task: taskService } = useServicesContext();

  useEffect(() => {
    taskService.getTasksSettings().then(setTasksSettings);
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes.tasksSettings) {
        setTasksSettings(changes.tasksSettings.newValue);
      }
    });
  }, []);

  const updateTasksSettings = useCallback(
    (newSettings: Partial<TasksSettings>) => {
      setTasksSettings((prevSettings) => {
        const settings = deepmerge(prevSettings, newSettings);
        taskService.updateTasksSettings(settings);
        return settings;
      });
    },
    [taskService]
  );

  return {
    tasksSettings,
    updateTasksSettings,
  };
}

export function useTasksState() {
  const [tasksState, setTasksState] = useState<TasksGlobalState>({});

  useEffect(() => {
    chrome.storage.local.get("tasksState").then((data) => {
      setTasksState({ ...data?.tasksState });
    });

    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes.tasksState) {
        setTasksState(changes.tasksState.newValue);
      }
    });
  }, []);

  const updateTasksState = useCallback(
    (newState: Partial<TasksGlobalState>) => {
      setTasksState((oldState) => {
        const mergedState = { ...oldState, ...newState };
        chrome.storage.local.set({ tasksState: mergedState });
        return mergedState;
      });
    },
    []
  );

  return { tasksState, updateTasksState };
}

export const useTasks = ({
  enabled,
  listId,
}: {
  listId: string | null | undefined;
  enabled?: boolean;
}) => {
  const { task } = useServicesContext();

  return useQuery<SavedTask[]>({
    queryKey: ["tasks", listId],
    placeholderData: [] as SavedTask[],
    queryFn: async () => {
      console.log("useTasks queryFn called: ", listId);
      if (!listId) return [];

      try {
        const data = await task.getTasks(listId);
        const sortedData = data.sort((a, b) =>
          a.position.localeCompare(b.position)
        );

        return sortedData;
      } catch (err) {
        console.log("error fetching tasks");
        console.error(err);
        return [];
      }
    },
    enabled: !!listId,
    staleTime: 1000 * 60, // 60 seconds
  });
};

export const useTaskLists = ({ enabled }: { enabled?: boolean } = {}) => {
  const { task } = useServicesContext();
  return useQuery<TaskList[]>({
    queryKey: ["tasks"],
    placeholderData: [] as TaskList[],
    queryFn: async () => {
      return task.getTaskLists();
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMoveTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServicesContext();
  return useMutation({
    mutationFn: ({
      taskId,
      previousTaskId,
    }: {
      taskId: string;
      previousTaskId?: string | null;
    }) => {
      return taskService.moveTask(listId, taskId, previousTaskId);
    },
    onMutate: async ({ previousTaskId, taskId }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", listId], (old: SavedTask[]) => {
        const oldUncomplete = old.filter((task) => task.status !== "completed");
        const oldIndex = old?.findIndex((task) => taskId === task.id);
        const newIndex = old?.findIndex((task) => previousTaskId === task.id);

        const newOrder = arrayMove(
          old,
          oldIndex,
          newIndex < oldIndex ? newIndex + 1 : newIndex
        );
        // newOrder.push(...old.filter((task) => task.status === "completed"));
        return newOrder;
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      console.error(err);
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
  });
};

export const useDeleteTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServicesContext();
  return useMutation({
    mutationFn: (id: string) => {
      return taskService.deleteTask(listId, id);
    },
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", listId], (old: SavedTask[]) =>
        old
          .map((task) => {
            if (task.id === id) return null;

            return task;
          })
          .filter((task) => !!task)
      );

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      console.error(err);
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
  });
};

export const useAddTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServicesContext();

  return useMutation({
    mutationFn: ({
      task,
      previousTaskId,
    }: {
      task: SavedTask;
      previousTaskId?: string;
    }) => {
      return taskService.addTask(listId, task, null);
    },
    onMutate: async ({ task }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", listId], (old?: SavedTask[]) => {
        const newData = [task, ...(old || [])];
        return newData;
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      console.error(err);
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useUpdateTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServicesContext();

  return useMutation({
    mutationFn: async (task: Partial<SavedTask> & { id: string }) => {
      if (!listId) {
        console.error("listId is required to update task");
        return task;
      }
      const savedTask = queryClient
        .getQueryData<SavedTask[]>(["tasks", listId])
        ?.find((cTask) => cTask.id === task.id);

      if (task.alert && !task.alertOn) {
        taskService.setReminder(task.id, listId, task.alert);
      }
      return taskService.updateTask(listId, {
        ...savedTask,
        ...(task as SavedTask),
      });
    },
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      queryClient.setQueryData(["tasks", listId], (old: SavedTask[]) => {
        return old.map((currentTask) => {
          if (task.id === currentTask.id) {
            return { ...currentTask, ...task };
          }

          return currentTask;
        });
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      console.error(err);
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
  });
};
