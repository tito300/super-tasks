import { PropsWithChildren, useEffect, useRef, useState } from "react";
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
import { useMountedRef } from "@src/hooks/useMountedRef";
import { useLazyMounted } from "@src/hooks/useMounted";
import { convertRelativeToAbsolutePosition } from "@src/components/Draggable";
import { SmartExpand } from "./SmartExpand";
import { useLogRender } from "@src/hooks/useLogRender";

// const ReminderBadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   right: 0,
// }));

export function DockStationContainer({ children }: PropsWithChildren) {
  useLogRender("DockStationContainer");
  const [isDragging, setIsDragging] = useState(false);
  const mounted = useLazyMounted();
  const queryClient = useQueryClient();
  const {
    data: { buttonExpanded, position, authWarningDismissed, selectedApps },
    updateData: updateUserState,
  } = useUserState();

  const [removed, setRemoved] = useState(false);

  if (removed) {
    return null;
  }

  const handleButtonClick = (app: "calendar" | "tasks" | "chatGpt") => {
    if (isDragging) return;

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

  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const defaultDistanceFromRight = position.percentageFromLeft ?? 95;
  const defaultDistanceFromTop = position.percentageFromTop ?? 95;
  const defaultPosition = convertRelativeToAbsolutePosition(
    defaultDistanceFromRight,
    defaultDistanceFromTop
  );

  const pagePosition = getPagePosition(
    defaultDistanceFromRight,
    defaultDistanceFromTop
  );

  const appButtons: JSX.Element[] = [];

  if (selectedApps["chatGpt"]) {
    appButtons.push(
      <AppIconButton
        onClick={() => handleButtonClick("chatGpt")}
        sx={{ backgroundColor: "white" }}
      >
        <img
          src={runtime.getURL("chatgpt-icon.png")}
          alt="calendar"
          width={32}
          height={32}
        />
      </AppIconButton>
    );
  }

  if (selectedApps["gCalendar"]) {
    appButtons.push(
      <AppIconButton
        onClick={() => handleButtonClick("calendar")}
        sx={{ backgroundColor: "white" }}
      >
        <CalendarIconBadge>
          <img src={googleCalendarIcon} alt="calendar" width={32} height={32} />
        </CalendarIconBadge>
      </AppIconButton>
    );
  }

  if (selectedApps["gTasks"]) {
    appButtons.push(
      <AppIconButton
        onClick={() => handleButtonClick("tasks")}
        sx={{ backgroundColor: "white" }}
      >
        <TasksReminderBadge>
          <img
            src={runtime.getURL("google-tasks-icon.png")}
            alt="tasks"
            width={32}
            height={32}
          />
        </TasksReminderBadge>
      </AppIconButton>
    );
  }

  if (authWarningDismissed) return null;

  return (
    <DraggablePopperStyled
      id={`${constants.EXTENSION_NAME}-expand-wrapper`}
      defaultPosition={defaultPosition}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      popperProps={{
        open: mounted && !!buttonExpanded,
        placement:
          pagePosition === "bottom-right"
            ? "bottom-end"
            : pagePosition === "bottom-left"
            ? "bottom-start"
            : pagePosition === "top-right"
            ? "top-end"
            : "top-start",
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
        >
          {children}
        </BadgeStyled>
      }
    >
      {!buttonExpanded && (
        <SmartExpand
          pagePosition={pagePosition}
          elementSize={58}
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
          primaryElement={
            <LogoIcon
              onClick={() => handleButtonClick("chatGpt")}
              id={`${constants.EXTENSION_NAME}-logo-button`}
            >
              <img
                src={runtime.getURL("logo_3_128x128.png")}
                alt="logo"
                width={28}
                height={28}
              />
            </LogoIcon>
          }
          elements={appButtons}
        />
      )}
    </DraggablePopperStyled>
  );
}

const AppIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: theme.shadows[3],
  "&:hover": {
    backgroundColor: "#ebebeb",
  },
}));

export const BadgeStyled = styled(Badge)(() => {
  return {
    [`& #${constants.EXTENSION_NAME}-remove-button`]: {
      padding: "0 0",
      backgroundColor: "#4d4d4d",
      border: "1px solid white",
      color: "white",
    },
  };
});

const DraggablePopperStyled = styled(DraggablePopper)(() => ({}));

const LogoIcon = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    boxShadow: theme.shadows[3],
    backgroundColor: "#fff",
    transform: "translate(-50%, -50%)",
    fontSize: 0,
    cursor: "grab",
    padding: "8px",
    [":hover"]: {
      backgroundColor: "#fff",
    },
  };
});

type PagePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function getPagePosition(
  percentageFromLeft: number,
  percentageFromTop: number
): PagePosition {
  return percentageFromLeft >= 50 && percentageFromTop >= 50
    ? "bottom-right"
    : percentageFromLeft >= 50 && percentageFromTop < 50
    ? "top-right"
    : percentageFromLeft < 50 && percentageFromTop >= 50
    ? "bottom-left"
    : "top-left";
}
