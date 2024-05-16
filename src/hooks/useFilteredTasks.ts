import { useTaskLists, useTasks } from "@src/api/task.api";
import { useTasksState } from "@src/components/Providers/TasksStateProvider";
import { useMemo } from "react";

export function useFilteredTasks() {
  const { data: tasksSettings } = useTasksState();
  const {
    data: { selectedTaskListId },
  } = useTasksState();
  const { isLoading: isListLoading } = useTaskLists({
    enabled: false,
  });
  const {
    data: tasks,
    isLoading: isTasksLoading,
    ...rest
  } = useTasks({ listId: selectedTaskListId });

  // useEffect(() => {
  //   if (selectedTaskListId) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["tasks", selectedTaskListId],
  //     });
  //   }
  // }, [selectedTaskListId]);

  const filteredTasks = useMemo(() => {
    return (
      tasks
        ?.filter((task) => {
          if (tasksSettings.filters.search) {
            if (
              !task.title
                ?.toLowerCase()
                .includes(tasksSettings.filters.search?.toLowerCase())
            )
              return false;
          }

          if (task.status === "completed") return false;
          if (task.pinned) return false;
          if (!task.title) return false;

          if (tasksSettings.filters?.today) {
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
          if (tasksSettings.filters?.pastDue) {
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
          if (tasksSettings.filters?.upcoming) {
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

          if (tasksSettings.filters.sort === "desc") {
            return (
              new Date(a.due || 0).getTime() - new Date(b.due || 0).getTime()
            );
          } else if (tasksSettings.filters.sort === "asc") {
            return (
              new Date(b.due || 0).getTime() - new Date(a.due || 0).getTime()
            );
          } else {
            return 0;
          }
        }) || []
    );
  }, [tasks, tasksSettings.filters]);

  const completedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => task.status === "completed");
  }, [tasks]);

  const pinnedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => task.pinned);
  }, [tasks]);

  const isLoading = isListLoading || isTasksLoading;

  return {
    filteredTasks,
    completedTasks,
    pinnedTasks,
    isLoading,
    tasks,
    ...rest,
  };
}
