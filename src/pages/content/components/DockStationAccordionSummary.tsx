import { ArrowDropDown, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  AccordionSummary as MuiAccordionSummary,
  Stack,
  Typography,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { useFilteredTasks } from "@src/hooks/useFilteredTasks";
import { useState } from "react";
import { ReminderBadge } from "./ReminderBadge";

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.gTasks,
  width: "100%",
  [`& .${accordionSummaryClasses.content}`]: {
    width: "100%",
    margin: 0,
    [`&.${accordionSummaryClasses.expanded}`]: {
      margin: 0,
    },
  },
}));

export function DockStationAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { userSettings, updateUserSettings } = useUserSettingsContext();
  const { filteredTasks, isFetching } = useFilteredTasks();

  const task = filteredTasks.find(
    (task) => task.status !== "completed" && task.title && task.id
  );

  const title =
    isFetching && !filteredTasks.length
      ? "loading..."
      : task?.title || "No tasks found";

  return (
    <AccordionSummary
      expandIcon={<ArrowDropDown />}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Stack direction="row" alignItems="center" width={"100%"}>
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
                onClick={() =>
                  updateUserSettings({ tasks: { blurText: false } })
                }
              />
            ) : (
              <VisibilityOff
                color="action"
                fontSize="small"
                onClick={() =>
                  updateUserSettings({ tasks: { blurText: true } })
                }
              />
            )}
          </IconButton>
          <ReminderBadge sx={{ mx: 1 }} />
        </Stack>
      </Stack>
    </AccordionSummary>
  );
}
