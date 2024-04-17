import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "../components/Task/Task";
import { arrayMove } from "@dnd-kit/sortable";
import { useServices } from "@src/components/Providers/ServicesProvider";

export type TaskList = {
  id: string;
  title: string;
};

export const useTasks = ({
  enabled,
  listId,
}: {
  listId: string | null;
  enabled?: boolean;
}) => {
  const { task } = useServices();
  return useQuery<Task[]>({
    queryKey: ["tasks", listId],
    initialData: [],
    queryFn: async () => {
      if (!listId) return [];

      const data = await task.getTasks(listId);

      const sortedData = data.sort((a, b) =>
        a.position.localeCompare(b.position)
      );

      return sortedData;
    },
    enabled,
  });
};

export const useTaskLists = ({ enabled }: { enabled?: boolean } = {}) => {
  const { task } = useServices();
  return useQuery<TaskList[]>({
    queryKey: ["taskLists"],
    initialData: [],
    queryFn: async () => {
      return task.getTaskLists();
    },
    enabled,
  });
};

export const useMoveTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServices();
  return useMutation({
    mutationFn: ({
      taskId,
      previousTaskId,
    }: {
      taskId: string;
      previousTaskId: string | null;
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
      queryClient.setQueryData(["tasks", listId], (old: Task[]) => {
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
  const { task: taskService } = useServices();
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
      queryClient.setQueryData(["tasks", listId], (old: Task[]) =>
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
  const { task: taskService } = useServices();

  return useMutation({
    mutationFn: ({
      task,
      previousTaskId,
    }: {
      task: Task;
      previousTaskId?: string;
    }) => {
      return taskService.addTask(listId, task, previousTaskId);
    },
    onMutate: async ({ task }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", listId], (old?: Task[]) => {
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
  });
};

export const useUpdateTask = (listId: string) => {
  const queryClient = useQueryClient();
  const { task: taskService } = useServices();

  return useMutation({
    mutationFn: async (task: Task) => {
      return taskService.updateTask(listId, task);
    },
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value

      queryClient.setQueryData(["tasks", listId], (old: Task[]) => {
        return old.map((currentTask) => {
          if (task.id === currentTask.id) return task;

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
