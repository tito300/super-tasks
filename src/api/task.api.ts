import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SavedTask, TaskEnhanced } from "../components/Task/Task";
import { arrayMove } from "@dnd-kit/sortable";
import { useServicesContext } from "@src/components/Providers/ServicesProvider";
import { useCallback, useEffect, useState } from "react";
import { useTasksState } from "@src/components/Providers/TasksStateProvider";
import { StorageData, storageService } from "@src/storage/storage.service";
import { useCustomQuery } from "@src/hooks/useCustomQuery";

export type TaskList = {
  id: string;
  title: string;
};

export const useTasks = ({
  enabled,
}: {
  enabled?: boolean;
} = {}) => {
  const { task: taskService } = useServicesContext();
  const {
    data: { selectedTaskListId },
  } = useTasksState();

  return useCustomQuery<SavedTask[]>({
    queryKey: ["tasks", selectedTaskListId],
    queryFn: async () => {
      if (!selectedTaskListId) return [];

      const data = await taskService.getTasks(selectedTaskListId);

      return data;
    },

    enabled: enabled ?? !!selectedTaskListId,
  });
};

export const useCachedTasks = () => {
  const { task: taskService } = useServicesContext();
  const {
    data: { selectedTaskListId },
  } = useTasksState();

  return useCustomQuery<SavedTask[]>({
    queryKey: ["tasks", "cached", selectedTaskListId],
    queryFn: async () => {
      if (!selectedTaskListId) return [];

      const data = await taskService.getTasks(selectedTaskListId, {
        useCacheOnly: true,
      });
      const sortedData = data.sort((a: any, b: any) =>
        a.position.localeCompare(b.position)
      );

      return sortedData;
    },
    enabled: true,
  });
};

export const useTaskLists = ({ enabled }: { enabled?: boolean } = {}) => {
  const { task } = useServicesContext();
  return useCustomQuery<TaskList[]>({
    queryKey: ["taskLists"],
    queryFn: () => task.getTaskLists(),
    enabled,
  });
};

export const useCachedTaskLists = () => {
  const { task } = useServicesContext();
  return useCustomQuery<TaskList[]>({
    queryKey: ["taskLists", "cached"],
    queryFn: () => task.getTaskLists({ useCacheOnly: true }),
    enabled: true,
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
