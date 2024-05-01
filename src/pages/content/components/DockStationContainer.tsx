import { PropsWithChildren, useContext, useState } from "react";
import { DockStationControls } from "./DockStationControls";
import {
  Badge,
  Box,
  Grow,
  IconButton,
  Slide,
  Stack,
  badgeClasses,
  styled,
  useTheme,
} from "@mui/material";
import { Close, MenuOpen } from "@mui/icons-material";
import { constants } from "@src/config/constants";
import { DraggablePopper } from "@src/components/DraggablePopper";
import { TasksReminderBadge } from "./TasksReminderBadge";
import { focusAddTaskInput } from "./DockStationAccordion";
import { CalendarIcon } from "@mui/x-date-pickers";
import { useUserSettings } from "@src/api/user.api";
import { calendarTheme, tasksTheme } from "@src/theme/google.theme";
import { cyan } from "@mui/material/colors";
import { useQueryClient } from "@tanstack/react-query";
import { useTasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { useGlobalState } from "@src/components/Providers/globalStateProvider";
import { CalendarIconBadge } from "./CalendarIconBadge";

// const ReminderBadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   right: 0,
// }));

export function DockStationContainer({ children }: PropsWithChildren) {
  const { userSettings, updateUserSettings } = useUserSettings();
  const queryClient = useQueryClient();
  const { open: localOpen, toggleOpen } = useGlobalState();
  const messageEngine = useMessageEngine();

  const [removed, setRemoved] = useState(false);

  if (removed) {
    return null;
  }

  const defaultPositions = {
    x: window.innerWidth - 32,
    y: window.innerHeight - 32,
  };

  // todo: move logic to global state
  const open = userSettings.syncButtonExpanded
    ? userSettings.buttonExpanded
    : localOpen;

  const handleButtonClick = (app: "calendar" | "tasks") => {
    updateUserSettings({
      currentTab: app,
      buttonExpanded: true,
      accordionExpanded: true,
    });
    toggleOpen();

    if (app === "tasks") {
      queryClient.invalidateQueries({
        queryKey: ["taskLists"],
      });
    }
    messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");

    focusAddTaskInput();
  };

  return (
    <DraggablePopper
      id={`${constants.EXTENSION_NAME}-expand-wrapper`}
      defaultPosition={defaultPositions}
      // sx={{ width: open ? 0 : 51, height: 51 }}
      popperProps={{ open, placement: "right-end", keepMounted: true }}
      popperChildren={
        <>
          <DockStationControls
            onMinimize={() => {
              if (userSettings.syncButtonExpanded) {
                updateUserSettings({ buttonExpanded: false });
              }
              toggleOpen();
            }}
            onRemove={() => setRemoved(true)}
          />
          <Box sx={{ display: open ? "block" : "none" }}>{children}</Box>
        </>
      }
    >
      {!open && (
        <ButtonsContainer>
            <ExtensionCalendarButton
              onClick={() => handleButtonClick("calendar")}
              id={`${constants.EXTENSION_NAME}-calendar-btn`}
              >
              <CalendarIconBadge>
              <CalendarIcon />
          </CalendarIconBadge>
            </ExtensionCalendarButton>
          <ExtensionTaskButton
            id={`${constants.EXTENSION_NAME}-tasks-button`}
            onClick={() => handleButtonClick("tasks")}
          >
            <TasksReminderBadge>
              <BadgeStyled
                slotProps={{
                  badge: {
                    id: `${constants.EXTENSION_NAME}-remove-button`,
                  },
                }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                color="default"
                badgeContent={
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRemoved(true);
                    }}
                  >
                    <Close sx={{ fontSize: 14, color: "white" }} />
                  </IconButton>
                }
              >
                <MenuOpen fontSize="large" />
              </BadgeStyled>
            </TasksReminderBadge>
          </ExtensionTaskButton>
        </ButtonsContainer>
      )}
    </DraggablePopper>
  );
}

const BadgeStyled = styled(Badge)(() => {
  return {
    "& .MuiBadge-badge": {
      right: -6,
      padding: "0 0",
      backgroundColor: "#797979",
      border: "1px solid white",
      color: "white",
    },
  };
});

const ExtensionTaskButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    boxShadow: theme.shadows[3],
    backgroundColor: cyan[400],
    fontSize: 0,
    cursor: "grab",
    [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
      display: "none",
    },
    [":hover"]: {
      backgroundColor: cyan[500],
      [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
        display: "block",
      },
    },
  };
});

const ExtensionCalendarButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    boxShadow: theme.shadows[3],
    padding: 14,
    marginBottom: 6,
    backgroundColor: calendarTheme.palette.background.accent,
    color: "white",
    transform: "translateY(6%)",
    fontSize: 0,
    cursor: "grab",
    [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
      display: "none",
    },
    [":hover"]: {
      backgroundColor: calendarTheme.palette.background.accent,
      [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
        display: "block",
      },
    },
  };
});

const ButtonsContainer = styled(Stack)(({ theme }) => {
  return {
    height: 51,
    width: 51,
    ":hover": {
      height: 200,
    },
    [`:hover& #${constants.EXTENSION_NAME}-calendar-btn`]: {
      transform: "translateY(-108%)",
    },
  };
});
