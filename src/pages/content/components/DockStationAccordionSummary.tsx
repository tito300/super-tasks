import {
  ArrowDropDown,
  NotificationImportant,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Badge,
  IconButton,
  AccordionSummary as MuiAccordionSummary,
  Stack,
  Typography,
  accordionSummaryClasses,
  styled,
} from "@mui/material";
import { TaskList, useUpdateTask } from "@src/api/task.api";
import { useServices } from "@src/components/Providers/ServicesProvider";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { SavedTask, TaskType } from "@src/components/Task/Task";
import { useTasks } from "@src/api/task.api";
import { useFilteredTasks } from "@src/hooks/useFilteredTasks";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  const [hasAlarm, setHasAlarm] = useState(false);

  const task = filteredTasks.find(
    (task) => task.status !== "completed" && task.title && task.id
  );

  const handleAlarms = (hasAlarm: boolean) => {
    setHasAlarm(hasAlarm);
  };

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
          sx={{ filter: userSettings.blurText ? "blur(7px)" : "none" }}
        >
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" ml="auto" gap={0.25}>
          <IconButton
            onClick={(e) => e.stopPropagation()}
            sx={{ opacity: hovered ? 1 : 0 }}
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
          <ReminderBadge onAlarms={handleAlarms} />
        </Stack>
      </Stack>
    </AccordionSummary>
  );
}

function ReminderBadge({
  onAlarms,
}: {
  onAlarms: (hasAlarm: boolean) => void;
}) {
  const [tasksWithAlertNotSeen, setTasksWithAlert] = useState<SavedTask[]>([]);
  const queryClient = useQueryClient();
  const { selectedTaskListId } = useTasksGlobalState();
  const { data: tasks } = useTasks({ listId: selectedTaskListId });
  const { userSettings } = useUserSettingsContext();
  const mutateTask = useUpdateTask(selectedTaskListId!);

  useEffect(() => {
    const allTasks: SavedTask[] = [];

    const queryState = queryClient.getQueryState<TaskList[]>(["taskLists"]);
    console.log({ queryState });

    if (queryState?.status === "success") {
      queryState.data?.forEach((list) => {
        allTasks.push(
          ...(queryClient.getQueryData<SavedTask[]>(["tasks", list.id]) || [])
        );
      });
    }

    const alertOnTasksNotSeen = allTasks.filter((task) => task.alertOn && !task.alertSeen);
    setTasksWithAlert(alertOnTasksNotSeen);
    onAlarms(!!tasksWithAlertNotSeen.length);
  }, [queryClient, tasks]);

  useEffect(() => {
    if (userSettings.tasksExpanded) {
      tasksWithAlertNotSeen.forEach((task) => {
        if (!task.alertSeen) {
          mutateTask.mutateAsync({...task, alertSeen: true});
        }
      })
    }
    // intentionally not including tasksWithAlertNotSeen in the dependencies
    // to avoid infinite loop, we only care about last state when tasksExpanded changes
  }, [userSettings.tasksExpanded]);

  if (!tasksWithAlertNotSeen.length) return null;

  return (
    <Badge
      badgeContent={tasksWithAlertNotSeen.length}
      color="warning"
      sx={{ mx: 1 }}
    ></Badge>
  );
}
