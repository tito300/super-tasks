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

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
  width: "100%",
  [`& .${accordionSummaryClasses.content}`]: {
    width: "100%",
  },
}));

export function DockStationAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { userSettings, updateUserSettings } = useUserSettingsContext();
  const { filteredTasks, isFetching } = useFilteredTasks();

  const title =
    isFetching && !filteredTasks.length
      ? "loading..."
      : filteredTasks.find(
          (task) => task.status !== "completed" && task.title && task.id
        )?.title;

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
          sx={{ filter: userSettings.blurText ? "blur(7px)" : "none" }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={(e) => e.stopPropagation()}
          sx={{ opacity: hovered ? 1 : 0, ml: "auto", mr: 0.5 }}
        >
          {userSettings.blurText ? (
            <Visibility
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ blurText: false })}
            />
          ) : (
            <VisibilityOff
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ blurText: true })}
            />
          )}
        </IconButton>
      </Stack>
    </AccordionSummary>
  );
}
