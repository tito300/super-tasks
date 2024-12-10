import {
  useCachedTaskLists,
  useCachedTasks,
  useTaskLists,
  useTasks,
} from "@src/api/task.api";
import { useTasksState } from "@src/components/Providers/TasksStateProvider";
import { useDeferredValue, useMemo } from "react";

export function useFilteredTasks() {
  const { data: tasksState } = useTasksState();
  const { isLoading: isListLoading } = useTaskLists({
    enabled: false,
  });
  const { data: cachedTasks } = useCachedTasks();
  const {
    data: inTasks,
    isLoading: isTasksLoading,
    isFetching: isTasksPending,
    ...rest
  } = useTasks();

  const tasks = isTasksLoading ? cachedTasks : inTasks;
  const isLoading = isListLoading || isTasksLoading;

  const filters = useDeferredValue(tasksState.filters);
  const searchedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => {
      if (filters.search) {
        return task.title?.toLowerCase().includes(filters.search.toLowerCase());
      }
      return true;
    });
  }, [tasks, filters.search]);

  const filteredTasks = useMemo(() => {
    return (
      searchedTasks
        ?.filter((task) => {
          if (task.status === "completed") return false;
          if (task.pinned) return false;
          if (!task.title) return false;

          if (filters?.today) {
            if (!task.due) return true;
            if (task.due) {
              const dueDate = new Date(task.due);
              const today = new Date();
              if (
                dueDate.getUTCDate() === today.getDate() &&
                dueDate.getUTCMonth() === today.getMonth() &&
                dueDate.getUTCFullYear() === today.getFullYear()
              ) {
                return true;
              }
            }
          }
          if (filters?.pastDue) {
            if (task.due) {
              const dueDate = new Date(task.due);
              const today = new Date();
              if (
                dueDate.getUTCDate() < today.getDate() &&
                dueDate.getUTCMonth() <= today.getMonth() &&
                dueDate.getUTCFullYear() <= today.getFullYear()
              ) {
                return true;
              }
            }
          }
          if (filters?.upcoming) {
            if (task.due) {
              const dueDate = new Date(task.due);
              const today = new Date();
              if (
                dueDate.getUTCDate() > today.getDate() &&
                dueDate.getUTCMonth() >= today.getMonth() &&
                dueDate.getUTCFullYear() >= today.getFullYear()
              ) {
                return true;
              }
            }
          }
          return false;
        })
        .sort((a, b) => {
          if (a.due && !b.due) return -1;
          if (!a.due && b.due) return 1;

          if (filters.sort === "desc") {
            return (
              new Date(a.due || 0).getTime() - new Date(b.due || 0).getTime()
            );
          } else if (filters.sort === "asc") {
            return (
              new Date(b.due || 0).getTime() - new Date(a.due || 0).getTime()
            );
          } else {
            return 0;
          }
        }) || []
    );
  }, [searchedTasks, filters]);

  const completedTasks = useMemo(() => {
    if (!searchedTasks) return [];
    return searchedTasks.filter((task) => task.status === "completed");
  }, [searchedTasks]);

  const pinnedTasks = useMemo(() => {
    if (!searchedTasks) return [];
    return searchedTasks.filter((task) => task.pinned);
  }, [searchedTasks]);

  return {
    filteredTasks,
    completedTasks,
    pinnedTasks,
    isLoading,
    tasks,
    ...rest,
  };
}
