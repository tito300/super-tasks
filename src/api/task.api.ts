import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SavedTask, TaskEnhanced } from "../components/Task/Task";
import { arrayMove } from "@dnd-kit/sortable";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useCallback, useEffect, useState } from "react";
import { TasksGlobalState } from "@src/components/Providers/TasksStateProvider";
import { StorageData, storageService } from "@src/storage/storage.service";
import { useTasksUpdateMessage } from "@src/hooks/useTasksUpdateMessage";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";

export type TaskList = {
  id: string;
  title: string;
};

export const useTasks = ({
  enabled,
  listId,
}: {
  listId: string | null | undefined;
  enabled?: boolean;
}) => {
  const { task: taskService } = useServicesContext();
  const scriptType = useScriptType();

  useTasksUpdateMessage();

  return useQuery<SavedTask[]>({
    queryKey: ["tasks", listId],
    placeholderData: [] as SavedTask[],
    queryFn: async () => {
      if (!listId) return [];

      try {
        const data = await taskService.getTasks(listId);
        const sortedData = data.sort((a, b) =>
          a.position.localeCompare(b.position)
        );

        return sortedData;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    enabled: enabled ?? !!listId,
    // stale time prevents refetching for things like when user focuses on page
    // If you need to force a refetch, use queryClient.invalidateQueries
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTaskLists = ({ enabled }: { enabled?: boolean } = {}) => {
  const { task } = useServicesContext();
  return useQuery<TaskList[]>({
    queryKey: ["taskLists"],
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

      // Optimistically update to the new valuetaskList
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

      // if (task.alert && !task.alertOn) {
      //   taskService.setReminder(task.id, listId, task.alert, userSettings);
      //   return task;
      // }

      // if (savedTask?.alert && !task.alert) {
      //   taskService.removeReminder(task.id, listId);
      //   return task;
      // }

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
        return (
          old?.map((currentTask) => {
            if (task.id === currentTask.id) {
              return { ...currentTask, ...task };
            }

            return currentTask;
          }) || []
        );
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

export function useTasksState() {
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

  const updateTasksState = useCallback(
    (newState: Partial<TasksGlobalState>) => {
      setTasksState((oldState) => {
        const mergedState = { ...oldState, ...newState };
        storageService.set({ tasksState: newState });
        return mergedState;
      });
    },
    []
  );

  return { tasksState, updateTasksState };
}

export function useEnhancedTasks() {
  const [enhancedTasks, setEnhancedTasks] = useState<TaskEnhanced[]>([]);

  useEffect(() => {
    function enhancedTasksMapToArray(
      enhancedTasks: Record<string, TaskEnhanced>
    ): TaskEnhanced[] {
      return Object.keys(enhancedTasks).map((key) => enhancedTasks[key]);
    }
    storageService.get("tasksEnhanced").then((data) => {
      setEnhancedTasks(enhancedTasksMapToArray(data ?? {}));
    });

    storageService.onChange("tasksEnhanced", (changes) => {
      if (changes?.tasksEnhanced) {
        setEnhancedTasks(
          enhancedTasksMapToArray(changes.tasksEnhanced.newValue ?? {})
        );
      }
    });
  }, []);

  const updateEnhancedTasks = useCallback((newTasks: TaskEnhanced[]) => {
    setEnhancedTasks(newTasks);
    storageService.set({
      tasksEnhanced: newTasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as StorageData["tasksEnhanced"]),
    });
  }, []);

  return [enhancedTasks, updateEnhancedTasks] as const;
}
