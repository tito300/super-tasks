import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Stack, Typography, IconButton, Box } from "@mui/material";
import { TasksReminderBadge } from "./TasksReminderBadge";
import { useState } from "react";
import { useFilteredTasks } from "@src/hooks/useFilteredTasks";
import { useTasksSettings } from "@src/api/task.api";

export function TasksAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { tasksSettings, updateTasksSettings } = useTasksSettings();
  const { filteredTasks, isFetching } = useFilteredTasks();

  const task = filteredTasks?.find(
    (task) => task.status !== "completed" && task.title && task.id
  );

  const title =
    isFetching && !filteredTasks?.length
      ? "loading..."
      : task?.title || "No tasks found";

  return (
    <Stack
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      direction="row"
      alignItems="center"
      width={"100%"}
    >
      <Typography
        fontWeight={500}
        pl={1}
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        sx={{
          filter: tasksSettings.blurText ? "blur(7px)" : "none",
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" ml="auto" gap={0.25}>
        <IconButton
          onClick={(e) => e.stopPropagation()}
          sx={{ opacity: hovered ? 1 : 0 }}
        >
          {tasksSettings.blurText ? (
            <Visibility
              color="action"
              fontSize="small"
              onClick={() => updateTasksSettings({ blurText: false })}
            />
          ) : (
            <VisibilityOff
              color="action"
              fontSize="small"
              onClick={() => updateTasksSettings({ blurText: true })}
            />
          )}
        </IconButton>
        <TasksReminderBadge key="summary" sx={{ mx: 1 }}></TasksReminderBadge>
      </Stack>
    </Stack>
  );
}
