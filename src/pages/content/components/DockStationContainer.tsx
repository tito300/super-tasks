import { PropsWithChildren, useEffect, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Stack,
  badgeClasses,
  styled,
} from "@mui/material";
import { Close, MenuOpen, Remove } from "@mui/icons-material";
import { constants } from "@src/config/constants";
import { DraggablePopper } from "@src/components/DraggablePopper";
import { TasksReminderBadge } from "./TasksReminderBadge";
import { focusAddTaskInput } from "./DockStationAccordion";
import { CalendarIcon } from "@mui/x-date-pickers";
import { calendarTheme } from "@src/theme/google.theme";
import { cyan } from "@mui/material/colors";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { CalendarIconBadge } from "./CalendarIconBadge";
import { useUserState } from "@src/components/Providers/UserStateProvider";

// const ReminderBadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   right: 0,
// }));

export function DockStationContainer({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { buttonExpanded, updateUserState } = useUserState();
  const messageEngine = useMessageEngine();

  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    console.log("mounted DockStationContainer");
  }, []);

  if (removed) {
    return null;
  }

  const defaultPositions = {
    x: window.innerWidth - 32,
    y: window.innerHeight - 32,
  };

  const handleButtonClick = (app: "calendar" | "tasks") => {
    updateUserState({
      currentTab: app,
      buttonExpanded: true,
      accordionExpanded: true,
    });

    if (app === "tasks") {
      queryClient.invalidateQueries({
        queryKey: ["taskLists"],
      });
    }
    messageEngine.sendMessage("StartFetchTasksTimer", null, "Background");

    focusAddTaskInput();
  };

  return (
    <DraggablePopperStyled
      id={`${constants.EXTENSION_NAME}-expand-wrapper`}
      defaultPosition={defaultPositions}
      // sx={{ width: open ? 0 : 51, height: 51 }}
      popperProps={{
        open: !!buttonExpanded,
        placement: "right-end",
        keepMounted: true,
      }}
      popperChildren={
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
                updateUserState({ buttonExpanded: false });
              }}
            >
              <Remove sx={{ fontSize: 14, color: "white" }} />
            </IconButton>
          }
        >
          <Box
            id="temp-container"
            sx={{ display: buttonExpanded ? "block" : "none" }}
          >
            {children}
          </Box>
        </BadgeStyled>
      }
    >
      {!buttonExpanded && (
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
    </DraggablePopperStyled>
  );
}

const BadgeStyled = styled(Badge)(() => {
  return {
    [`& #${constants.EXTENSION_NAME}-remove-button`]: {
      right: -6,
      padding: "0 0",
      backgroundColor: "#797979",
      border: "1px solid white",
      color: "white",
    },
  };
});

const DraggablePopperStyled = styled(DraggablePopper)(({ theme }) => ({
  [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
    display: "none",
  },
  [":hover"]: {
    [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
      display: "block",
    },
  },
}));

const ExtensionTaskButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    boxShadow: theme.shadows[3],
    backgroundColor: cyan[400],
    fontSize: 0,
    cursor: "grab",
    [":hover"]: {
      backgroundColor: cyan[500],
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
    [":hover"]: {
      backgroundColor: calendarTheme.palette.background.accent,
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
