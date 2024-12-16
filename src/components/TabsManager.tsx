import { TabContext } from "@mui/lab";
import {
  Box,
  IconButton,
  IconButtonProps,
  Paper,
  Stack,
  StackProps,
  styled,
} from "@mui/material";
import { TabName } from "@src/config/settingsDefaults";
import React, { useRef } from "react";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { useUserState } from "./Providers/UserStateProvider";
import { useLogRender } from "@src/hooks/useLogRender";
import googleCalendarIcon from "@assets/img/google-calendar-icon.png";
import AddIcon from "@mui/icons-material/Add";
import chatGptCalendarIcon from "@assets/img/chatgpt-icon.png";
import { constants } from "@src/config/constants";
import {
  AspectRatio,
  BorderColor,
  BorderLeft,
  Close,
  CloseFullscreen,
} from "@mui/icons-material";
import { useServicesContext } from "./Providers/ServicesProvider";
import { useUserSettings } from "./Providers/UserSettingsProvider";

const AppContainer = styled(Paper)<{ scriptType: ScriptType }>(
  ({ scriptType }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    overflowY: "auto",
    height: "450px",
    backgroundColor: "white",
    ...(scriptType === "Panel" && {
      flexGrow: 1,
    }),
  })
);

export function TabsManager({
  tabs,
  tabIconButtonProps,
  tabIconButtonPropsSelected,
  hideTabs,
  ...rootProps
}: {
  hideTabs?: boolean;
  tabIconButtonProps?: IconButtonProps;
  tabIconButtonPropsSelected?: IconButtonProps;
  tabs: Record<TabName, React.ReactNode>;
} & StackProps) {
  const {
    data: { currentTab, selectedApps, buttonExpanded, useSidePanel },
    updateData,
  } = useUserState();
  const scriptType = useScriptType();
  const defaultTabOpened = ["Popup", "Panel"].includes(scriptType);

  // we do not want to render tabs that haven't been selected to save on bandwidth and performance
  const openedApps = useRef<Record<TabName, boolean>>({
    tasks: defaultTabOpened,
    calendar: defaultTabOpened,
    chatGpt: defaultTabOpened,
    add: defaultTabOpened,
  });

  if (buttonExpanded) {
    openedApps.current[currentTab] = true;
  }

  useLogRender("TabsManager");

  const handleExtensionClose = () => {
    if (scriptType === "Content") {
      updateData({ buttonExpanded: false });
    } else if (scriptType === "Popup") {
      window.close();
    }
  };

  if (useSidePanel && scriptType === "Content") return null;
  const hide = !useSidePanel && scriptType === "Panel";

  return (
    <TabsManagerContainer
      onDrag={(e) => e.stopPropagation()}
      onDragStart={(e) => e.stopPropagation()}
      onDragEnd={(e) => e.stopPropagation()}
      hide={hide}
      scriptType={scriptType}
      {...rootProps}
    >
      <TabContext value={currentTab}>
        {!hideTabs && <NavigationTabs onClose={handleExtensionClose} />}
        <AppContainer
          elevation={0}
          scriptType={scriptType}
          onMouseDown={(e) => e.stopPropagation()}
          id={`${constants.EXTENSION_NAME}-scrollable-container`}
        >
          {selectedApps.gTasks && openedApps.current.tasks && (
            <TabContainer
              flexGrow={1}
              sx={{
                display:
                  currentTab === "tasks" || !tabs[currentTab] ? "flex" : "none",
              }}
            >
              {tabs["tasks"]}
            </TabContainer>
          )}
          {selectedApps.gCalendar &&
            openedApps.current.calendar &&
            tabs["calendar"] && (
              <TabContainer
                flexGrow={1}
                sx={{
                  display: currentTab === "calendar" ? "flex" : "none",
                }}
              >
                {tabs["calendar"]}
              </TabContainer>
            )}
          {selectedApps.chatGpt && tabs["chatGpt"] && (
            <TabContainer
              flexGrow={1}
              sx={{
                display: currentTab === "chatGpt" ? "flex" : "none",
              }}
            >
              {tabs["chatGpt"]}
            </TabContainer>
          )}
          {tabs["add"] && (
            <TabContainer
              flexGrow={1}
              sx={{
                display: currentTab === "add" ? "flex" : "none",
              }}
            >
              {tabs["add"]}
            </TabContainer>
          )}
        </AppContainer>
      </TabContext>
    </TabsManagerContainer>
  );
}

const TabsManagerContainer = styled(Stack)<{
  hide?: boolean;
  scriptType: ScriptType;
}>(({ hide, scriptType, theme }) => ({
  width: "100%",
  typography: "body1",
  ":hover": {
    [`& #summary-tabs-container`]: {
      bottom: scriptType === "Content" ? "calc(100% - 10px)" : "auto",
      transition: "bottom 0.1s",
    },
  },
  boxShadow: theme.shadows[3],
  borderRadius: 2,
  ...(scriptType === "Panel" && {
    height: "100vh",
  }),
  transition: "all 0.3s",
  ...(hide && {
    transform: "scale(0) translateX(-100%)",
  }),
}));

const TabContainer = styled(Stack)({
  height: "100%",
});

function NavigationTabs({ onClose }: { onClose: () => void }) {
  const scriptType = useScriptType();
  const {
    data: { selectedApps, useSidePanel },
    updateData,
  } = useUserState();
  const { user: userService } = useServicesContext();
  const { updateUserSettings, userSettings } = useUserSettings();

  const tasksAvailable = selectedApps.gTasks;
  const calendarAvailable = selectedApps.gCalendar;
  const chatGptAvailable = selectedApps.chatGpt;

  const canAddMore = !tasksAvailable || !calendarAvailable || !chatGptAvailable;

  const handleToggleSidePanel = () => {
    const _useSidePanel = !useSidePanel;

    if (_useSidePanel) {
      updateData({ useSidePanel: _useSidePanel, buttonExpanded: true });
      userService.openSidePanel();
    } else {
      updateUserSettings({ syncButtonExpanded: true });

      // todo: no working - it needs to open content script again
      setTimeout(() => {
        updateData({ useSidePanel: _useSidePanel, buttonExpanded: true });
        setTimeout(() => {
          updateUserSettings({
            syncButtonExpanded: userSettings.buttonExpanded,
          });
        }, 500);
      }, 500);
    }
  };

  return (
    <>
      <TabIconsContainer
        onClick={scriptType === "Content" ? onClose : undefined}
        scriptType={scriptType}
        id="summary-tabs-container"
      >
        <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
          {chatGptAvailable && <TabOption tabName="chatGpt" />}
          {calendarAvailable && <TabOption tabName="calendar" />}
          {tasksAvailable && <TabOption tabName="tasks" />}
          {canAddMore && scriptType === "Popup" && <TabOption tabName="add" />}
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton size="small" onClick={handleToggleSidePanel}>
            {useSidePanel && scriptType !== "Popup" ? (
              <CloseFullscreen fontSize="small" color="action" />
            ) : (
              <AspectRatio fontSize="small" color="action" />
            )}
          </IconButton>
          {scriptType !== "Panel" && (
            <IconButton sx={{ ml: "auto" }} size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </TabIconsContainer>
      {scriptType === "Popup" && (
        <Box
          sx={{
            height: 32,
            width: "100%",
          }}
        />
      )}
    </>
  );
}

function TabOption({ tabName }: { tabName: TabName }) {
  const scriptType = useScriptType();
  const {
    data: { currentTab },
    updateData: updateUserState,
  } = useUserState();

  const selected = currentTab === tabName;
  const tabIcon =
    tabName === "tasks" ? (
      <img
        src={chrome.runtime.getURL("google-tasks-icon.png")}
        alt="tasks"
        width={18}
        height={18}
      />
    ) : tabName === "calendar" ? (
      <img src={googleCalendarIcon} alt="calendar" width={18} height={18} />
    ) : tabName === "chatGpt" ? (
      <img
        src={chrome.runtime.getURL("chatgpt-icon.png")}
        alt="calendar"
        width={18}
        height={18}
      />
    ) : (
      <AddIcon fontSize="small" />
    );

  return (
    <TabIconStyled
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        updateUserState({ currentTab: tabName });
      }}
      selected={selected}
      scriptType={scriptType}
    >
      {tabIcon}
    </TabIconStyled>
  );
}

const TabIconsContainer = styled(Stack)<{
  scriptType: ScriptType;
}>(({ theme, scriptType }) => ({
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "space-between",
  position: "fixed",
  backgroundColor: "#eee8c8",
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  zIndex: 50,
  padding: "6px 8px 0px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: scriptType === "Popup" ? "100%" : "auto",
  ...(["Content", "Panel"].includes(scriptType) && { position: "initial" }),
}));

const TabIconStyled = styled(IconButton)<{
  selected?: boolean;
  scriptType: ScriptType;
}>(({ theme, selected, scriptType }) => ({
  // @ts-ignore
  // backgroundColor: "#f3f3f3",
  border: "none",
  // @ts-ignore
  borderRadius: 0,
  // @ts-ignore
  padding: "4px 18px",
  // @ts-ignore
  ":nth-child(even)": {
    borderRight: `2px solid ${theme.palette.divider}`,
    borderLeft: `2px solid ${theme.palette.divider}`,
  },
  ":hover": {
    backgroundColor: "#d3cfb9",
    borderColor: "#d3cfb9",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    "& + button": {
      borderColor: "#transparent",
    },
    "&:previous-child": {
      borderColor: "#transparent",
    },
  },
  ...(selected && {
    padding: "6px 18px 7px",
    backgroundColor: theme.palette.background.paper,
    border: `none`,
    borderRight: "none",
    borderLeft: "none",
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "transparent",
    transform: "scale(1.05)",
    marginBottom: -2,
    zIndex: 1,

    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
  }),
}));
