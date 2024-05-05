import { useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useTasksSettingsContext } from "@src/components/Providers/TasksSettingsProvider";
import { useMemo } from "react";

export function useFilteredTasks() {
  const { tasksSettings } = useTasksSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks, ...rest } = useTasks({ listId: selectedTaskListId });

  // useEffect(() => {
  //   if (selectedTaskListId) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["tasks", selectedTaskListId],
  //     });
  //   }
  // }, [selectedTaskListId]);

  const filteredTasks = useMemo(() => {
    return (
      tasks?.filter((task) => {
        if (task.status === "completed") return false;
        if (!task.title) return false;

        if (tasksSettings.tasksFilters?.today) {
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
        if (tasksSettings.tasksFilters?.pastDue) {
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
        if (tasksSettings.tasksFilters?.upcoming) {
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
      }) || []
    );
  }, [tasks, tasksSettings.tasksFilters]);

  const completedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => task.status === "completed");
  }, [tasks]);

  return { filteredTasks, completedTasks, ...rest };
}
