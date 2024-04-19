import { useTasks } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { isTaskPastDue } from "@src/utils/isTaskPastDue";
import { useMemo } from "react";

export function useFilteredTasks() {
  const { userSettings } = useUserSettingsContext();
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks, ...rest } = useTasks({ listId: selectedTaskListId });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.status === "completed") return false;
      if (!task.title) return false;

      if (userSettings.tasksFilters.today) {
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
      if (userSettings.tasksFilters.pastDue) {
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
      if (userSettings.tasksFilters.upcoming) {
        if (task.due) {
          const dueDate = new Date(task.due);
          const today = new Date();
          if (dueDate > today) {
            return true;
          }
        }
      }
      return false;
    });
  }, [tasks, userSettings.tasksFilters]);

  const completedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => task.status === "completed");
  }, [tasks]);

  return { filteredTasks, completedTasks, ...rest };
}
