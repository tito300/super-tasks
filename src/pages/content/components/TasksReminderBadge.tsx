import { BadgeProps, Badge } from "@mui/material";
import {
  useEnhancedTasks,
} from "@src/api/task.api";
import { TaskEnhanced } from "@src/components/Task/Task";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function TasksReminderBadge(props: BadgeProps) {
  const [tasksWithAlertNotSeen, setTasksWithAlert] = useState<TaskEnhanced[]>(
    []
  );
  const queryClient = useQueryClient();
  const [enhancedTasks] = useEnhancedTasks();

  // todo: currently it only triggers on one list of tasks
  useEffect(() => {
    const alertOnTasksNotSeen = enhancedTasks.filter(
      (task) => task.alertOn && !task.alertSeen
    );
    setTasksWithAlert(alertOnTasksNotSeen);
  }, [queryClient, enhancedTasks]);

  if (!tasksWithAlertNotSeen.length) {
    return props.children as JSX.Element;
  }

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
