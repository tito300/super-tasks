import { BadgeProps, Badge } from "@mui/material";
import { useTasks, useUpdateTask, TaskList } from "@src/api/task.api";
import { useUserSettings } from "@src/api/user.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { SavedTask } from "@src/components/Task/Task";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function ReminderBadge(props: BadgeProps) {
  const [tasksWithAlertNotSeen, setTasksWithAlert] = useState<SavedTask[]>([]);
  const queryClient = useQueryClient();
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks } = useTasks({ listId: selectedTaskListId });
  const { userSettings } = useUserSettings();
  const mutateTask = useUpdateTask(selectedTaskListId!);

  useEffect(() => {
    const allTasks: SavedTask[] = [];

    const queryState = queryClient.getQueryState<TaskList[]>(["tasks"]);

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
    if (userSettings.accordionExpanded) {
      tasksWithAlertNotSeen.forEach((task) => {
        if (!task.alertSeen) {
          mutateTask.mutateAsync({ ...task, alertSeen: true });
        }
      });
    }
    // intentionally not including tasksWithAlertNotSeen in the dependencies
    // to avoid infinite loop, we only care about last state when tasksExpanded changes
  }, [userSettings.accordionExpanded, userSettings.buttonExpanded]);

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
