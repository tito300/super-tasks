import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Task } from "../components/Task/Task";
import { wait } from "../utils/wait";
import { arrayMove } from "@dnd-kit/sortable";

export type TaskList = {
  id: string;
  title: string;
};

export const useTasks = ({
  enabled,
  listId,
}: {
  listId: string;
  enabled?: boolean;
}) =>
  useQuery<Task[]>({
    queryKey: ["tasks", listId],
    initialData: [],
    queryFn: async () => {
      if (!listId) return [];

      const data = (await axios
        .get(`/tasks/${listId}/tasks`)
        .then((res) => res?.data?.items)) as Task[];

      const sortedData = data.sort((a, b) =>
        a.position.localeCompare(b.position)
      );

      return sortedData;
    },
    enabled,
  });

export const useTaskLists = ({ enabled }: { enabled?: boolean } = {}) =>
  useQuery<TaskList[]>({
    queryKey: ["taskList"],
    initialData: [],
    queryFn: async () => {
      return axios.get("/tasks").then((res) => res?.data?.items);
    },
    enabled,
  });

export const useMoveTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      previousTaskId,
    }: {
      taskId: string;
      previousTaskId: string | null;
    }) => {
      return axios
        .post(`tasks/${listId}/tasks/${taskId}/move`, {
          previousTaskId,
        })
        .then((res) => res.data);
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
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useDeleteTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/tasks/${listId}/tasks/${id}`);
      // return wait(2000);
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
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useAddTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      task,
      previousTaskId,
    }: {
      task: Task;
      previousTaskId?: string;
    }) => {
      return axios.post(
        `/tasks/${listId}/tasks?previous=${previousTaskId ?? ""}`,
        task
      );
      // return wait(2000);
    },
    onMutate: async ({ task }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks", listId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", listId], (old?: Task[]) => {
        [...(old || [])].push(task);
        return old;
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useUpdateTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      const updatedTask = await axios
        .post(`/tasks/${listId}/tasks/${task.id}`, task)
        .then((res) => res.data);
      return updatedTask;
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
      queryClient.setQueryData(["tasks", listId], context?.previousTasks || []);
    },
    onSuccess: async () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};
