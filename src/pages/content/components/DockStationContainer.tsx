import { PropsWithChildren, useState } from "react";
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
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { constants } from "@src/config/constants";
import { DraggablePopper } from "@src/components/DraggablePopper";
import { ReminderBadge } from "./ReminderBadge";
import { focusAddTaskInput } from "./DockStationAccordion";
import { CalendarIcon } from "@mui/x-date-pickers";

// const ReminderBadgeStyled = styled(Badge)<BadgeProps>(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   right: 0,
// }));

export function DockStationContainer({ children }: PropsWithChildren) {
  const { userSettings, updateUserSettings } = useUserSettingsContext();
  const [localExpanded, setLocalExpanded] = useState(false);

  const [removed, setRemoved] = useState(false);

  if (removed) {
    return null;
  }

  const defaultPositions = {
    x: window.innerWidth - 32,
    y: window.innerHeight - 32,
  };

  const open = userSettings.syncExpanded
    ? userSettings.buttonExpanded
    : localExpanded;

    const handleButtonClick = (app: "calendar" | "tasks") => {
      if (userSettings.syncExpanded) {
        updateUserSettings({
          currentTab: app,
          buttonExpanded: true,
          accordionExpanded: true,
        });
      } else {
        updateUserSettings({ currentTab: app });
        setLocalExpanded(true);
      }
      focusAddTaskInput();
    }


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
              if (userSettings.syncExpanded) {
                updateUserSettings({ buttonExpanded: false });
              } else {
                setLocalExpanded(false);
              }
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
            onClick={() => handleButtonClick('calendar')}
            id={`${constants.EXTENSION_NAME}-calendar-btn`}
          >
            <CalendarIcon />
          </ExtensionCalendarButton>
          <ExtensionIconButton
            id={`${constants.EXTENSION_NAME}-tasks-button`}
            onClick={() => handleButtonClick('tasks')}
          >
            <ReminderBadge>
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
            </ReminderBadge>
          </ExtensionIconButton>
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

const ExtensionIconButton = styled(IconButton)(({ theme }) => {
  return {
    position: "absolute",
    bottom: 0,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.gTasks,
    fontSize: 0,
    cursor: "grab",
    [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
      display: "none",
    },
    [":hover"]: {
      backgroundColor: theme.palette.background.gTasks,
      [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
        display: "block",
      },
    },
  };
});

const ExtensionCalendarButton = styled(IconButton)(({ theme }) => {
  return {
    position: 'absolute',
    bottom: 0,
    boxShadow: theme.shadows[3],
    padding: 14,
    marginBottom: 6,
    backgroundColor: theme.palette.background.gCalendar,
    color: "white",
    transform: "translateY(7%)",
    fontSize: 0,
    cursor: "grab",
    [`& .${badgeClasses.badge}#${constants.EXTENSION_NAME}-remove-button`]: {
      display: "none",
    },
    [":hover"]: {
      backgroundColor: theme.palette.background.gCalendar,
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
      transform: "translateY(-108%)"
    },
  };
});
