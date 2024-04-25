import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Stack, Typography, IconButton } from "@mui/material";
import { title } from "process";
import { ReminderBadge } from "./ReminderBadge";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { useState } from "react";
import { useFilteredTasks } from "@src/hooks/useFilteredTasks";

export function CalendarAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { userSettings, updateUserSettings } = useUserSettingsContext();

  const title = "1:1 John Doe";

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
        sx={{ filter: userSettings.tasks.blurText ? "blur(7px)" : "none" }}
      >
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" ml="auto" gap={0.25}>
        <IconButton
          onClick={(e) => e.stopPropagation()}
          sx={{ opacity: hovered ? 1 : 0 }}
        >
          {userSettings.tasks.blurText ? (
            <Visibility
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ tasks: { blurText: false } })}
            />
          ) : (
            <VisibilityOff
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ tasks: { blurText: true } })}
            />
          )}
        </IconButton>
        {/* <ReminderBadge sx={{ mx: 1 }} /> */}
      </Stack>
    </Stack>
  );
}
