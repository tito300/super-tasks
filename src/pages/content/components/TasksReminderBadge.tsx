import { BadgeProps, Badge } from "@mui/material";
import { useTasks, useUpdateTask, TaskList, useTaskLists, useEnhancedTasks } from "@src/api/task.api";
import { useUserSettings } from "@src/api/user.api";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { SavedTask, TaskEnhanced } from "@src/components/Task/Task";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function TasksReminderBadge(props: BadgeProps) {
  const [tasksWithAlertNotSeen, setTasksWithAlert] = useState<TaskEnhanced[]>([]);
  const queryClient = useQueryClient();
  const { selectedTaskListId } = useTasksGlobalState();
  const [enhancedTasks] = useEnhancedTasks();
  const { userSettings } = useUserSettings();
  const mutateTask = useUpdateTask(selectedTaskListId!);


  // todo: currently it only triggers on one list of tasks
  useEffect(() => {
    const alertOnTasksNotSeen = enhancedTasks.filter(
      (task) => task.alertOn && !task.alertSeen
    );
    setTasksWithAlert(alertOnTasksNotSeen);
  }, [queryClient, enhancedTasks]);

  // useEffect(() => {
  //   if (userSettings.accordionExpanded) {
  //     tasksWithAlertNotSeen.forEach((task) => {
  //       if (!task.alertSeen) {
  //         mutateTask.mutateAsync({ ...task, alertSeen: true });
  //       }
  //     });
  //   }
  //   // intentionally not including tasksWithAlertNotSeen in the dependencies
  //   // to avoid infinite loop, we only care about last state when tasksExpanded changes
  // }, [userSettings.accordionExpanded, userSettings.buttonExpanded]);

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
