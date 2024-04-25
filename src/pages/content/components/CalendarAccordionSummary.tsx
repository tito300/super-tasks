import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Stack, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { useTasksSettings } from "@src/api/task.api";

export function CalendarAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { tasksSettings, updateTasksSettings } = useTasksSettings();

  const title = "(30 min) All hands meeting";

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
        sx={{ filter: tasksSettings.blurText ? "blur(7px)" : "none" }}
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
        {/* <ReminderBadge sx={{ mx: 1 }} /> */}
      </Stack>
    </Stack>
  );
}
