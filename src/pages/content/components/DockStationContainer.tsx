import { PropsWithChildren, useEffect, useState } from "react";
import {
  Badge,
  Box,
  IconButton,
  Stack,
  badgeClasses,
  styled,
} from "@mui/material";
import { Close, MenuOpen, Remove, WidthFull } from "@mui/icons-material";
import { constants } from "@src/config/constants";
import { DraggablePopper } from "@src/components/DraggablePopper";
import { TasksReminderBadge } from "./TasksReminderBadge";
import { focusAddTaskInput } from "./DockStationAccordion";
import { CalendarIcon } from "@mui/x-date-pickers";
import { calendarTheme } from "@src/theme/google.theme";
import googleCalendarIcon from "@assets/img/google-calendar-icon.png";
import { cyan } from "@mui/material/colors";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { CalendarIconBadge } from "./CalendarIconBadge";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { runtime } from "webextension-polyfill";

// const ReminderBadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   right: 0,
// }));

export function DockStationContainer({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const {
    data: { buttonExpanded },
    updateData: updateUserState,
  } = useUserState();

  const [removed, setRemoved] = useState(false);

  if (removed) {
    return null;
  }

  const defaultPositions = {
    x: window.innerWidth - 38,
    y: window.innerHeight - 32,
  };

  const handleButtonClick = (app: "calendar" | "tasks" | "chatGpt") => {
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
          {/* <Box
            id="temp-container"
            sx={{ display: buttonExpanded ? "block" : "none" }}
          > */}
          {children}
          {/* </Box> */}
        </BadgeStyled>
      }
    >
      {!buttonExpanded && (
        <ButtonsContainer>
          <ExtensionAiButton
            onClick={() => handleButtonClick("chatGpt")}
            id={`${constants.EXTENSION_NAME}-ai-button`}
          >
            <img
              src={runtime.getURL("chatgpt-icon.png")}
              alt="calendar"
              width={28}
              height={28}
            />
          </ExtensionAiButton>
          <ExtensionCalendarButton
            onClick={() => handleButtonClick("calendar")}
            id={`${constants.EXTENSION_NAME}-calendar-btn`}
          >
            <CalendarIconBadge>
              <img
                src={googleCalendarIcon}
                alt="calendar"
                width={28}
                height={28}
              />
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
                <img
                  src={runtime.getURL("google-tasks-icon.png")}
                  alt="tasks"
                  width={35}
                  height={35}
                />
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
    right: 0,
    boxShadow: theme.shadows[3],
    backgroundColor: "#fff",
    fontSize: 0,
    cursor: "grab",
    [":hover"]: {
      backgroundColor: "#fff",
    },
  };
});

const ExtensionCalendarButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    right: 0,
    boxShadow: theme.shadows[3],
    marginBottom: 2,
    backgroundColor: "#fff",
    color: "white",
    transform: "translateY(6%)",
    fontSize: 0,
    padding: "12px",
    cursor: "grab",
    ["&:hover"]: {
      boxShadow: theme.shadows[6],
    },
  };
});

const ExtensionAiButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    right: 0,
    boxShadow: theme.shadows[3],
    marginBottom: 2,
    backgroundColor: "#fff",
    color: "white",
    transform: "translateY(12%)",
    fontSize: 0,
    padding: "12px",
    cursor: "grab",
    ["&:hover"]: {
      boxShadow: theme.shadows[6],
    },
  };
});

const ButtonsContainer = styled(Stack)(({ theme }) => {
  return {
    height: 51,
    width: 51,
    "&:hover": {
      height: 120,
      width: 120,
    },
    [`:hover& #${constants.EXTENSION_NAME}-calendar-btn`]: {
      transform: "translateY(-108%)",
    },
    [`:hover& #${constants.EXTENSION_NAME}-ai-button`]: {
      transform: "translateX(-116%)",
    },
  };
});
