import { BadgeProps, Badge } from "@mui/material";
import { useTasks, useUpdateTask, TaskList } from "@src/api/task.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { SavedTask } from "@src/components/Task/Task";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function ReminderBadge(props: BadgeProps) {
  const [tasksWithAlertNotSeen, setTasksWithAlert] = useState<SavedTask[]>([]);
  const queryClient = useQueryClient();
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks } = useTasks({ listId: selectedTaskListId });
  const { userSettings } = useUserSettingsContext();
  const mutateTask = useUpdateTask(selectedTaskListId!);

  useEffect(() => {
    const allTasks: SavedTask[] = [];

    const queryState = queryClient.getQueryState<TaskList[]>(["taskLists"]);

    if (queryState?.status === "success") {
      queryState.data?.forEach((list) => {
        allTasks.push(
          ...(queryClient.getQueryData<SavedTask[]>(["tasks", list.id]) || [])
        );
      });
    }

    const alertOnTasksNotSeen = allTasks.filter(
      (task) => task.alertOn && !task.alertSeen
    );
    setTasksWithAlert(alertOnTasksNotSeen);
  }, [queryClient, tasks]);

  useEffect(() => {
    if (userSettings.tasksExpanded) {
      tasksWithAlertNotSeen.forEach((task) => {
        if (!task.alertSeen) {
          mutateTask.mutateAsync({ ...task, alertSeen: true });
        }
      });
    }
    // intentionally not including tasksWithAlertNotSeen in the dependencies
    // to avoid infinite loop, we only care about last state when tasksExpanded changes
  }, [userSettings.tasksExpanded, userSettings.taskButtonExpanded]);

  return (
    <Badge
      badgeContent={
        !!tasksWithAlertNotSeen.length ? tasksWithAlertNotSeen.length : null
      }
      color="warning"
      {...props}
    />
  );
}
