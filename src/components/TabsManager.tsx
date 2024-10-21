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
import React from "react";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { useUserState } from "./Providers/UserStateProvider";
import { useLogRender } from "@src/hooks/useLogRender";
import googleCalendarIcon from "@assets/img/google-calendar-icon.png";
import AddIcon from "@mui/icons-material/Add";
import chatGptCalendarIcon from "@assets/img/chatgpt-icon.png";
import { constants } from "@src/config/constants";
import { Close } from "@mui/icons-material";

const AppContainer = styled(Paper)({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  overflowX: "clip",
  height: "450px",
  backgroundColor: "white",
});

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
    data: { currentTab },
    updateData,
  } = useUserState();
  const scriptType = useScriptType();

  useLogRender("TabsManager");

  const handleExtensionClose = () => {
    updateData({ buttonExpanded: false });
  };

  return (
    <Stack
      onDrag={(e) => e.stopPropagation()}
      onDragStart={(e) => e.stopPropagation()}
      onDragEnd={(e) => e.stopPropagation()}
      {...rootProps}
      sx={{
        width: "100%",
        typography: "body1",
        ":hover": {
          [`& #summary-tabs-container`]: {
            bottom: scriptType === "Content" ? "calc(100% - 10px)" : "auto",
            transition: "bottom 0.1s",
          },
        },
        ...rootProps?.sx,
      }}
    >
      <TabContext value={currentTab}>
        {!hideTabs && <NavigationTabs onClose={handleExtensionClose} />}
        <AppContainer
          elevation={2}
          id={`${constants.EXTENSION_NAME}-scrollable-container`}
        >
          <Stack
            flexGrow={1}
            sx={{
              display:
                currentTab === "tasks" || !tabs[currentTab] ? "flex" : "none",
            }}
          >
            {tabs["tasks"]}
          </Stack>
          {tabs["calendar"] && (
            <Stack
              flexGrow={1}
              sx={{
                display: currentTab === "calendar" ? "block" : "none",
              }}
            >
              {tabs["calendar"]}
            </Stack>
          )}
          {tabs["chatGpt"] && (
            <Stack
              flexGrow={1}
              sx={{
                display: currentTab === "chatGpt" ? "block" : "none",
              }}
            >
              {tabs["chatGpt"]}
            </Stack>
          )}
          {tabs["add"] && (
            <Stack
              flexGrow={1}
              sx={{
                display: currentTab === "add" ? "block" : "none",
              }}
            >
              {tabs["add"]}
            </Stack>
          )}
        </AppContainer>
      </TabContext>
    </Stack>
  );
}

function NavigationTabs({ onClose }: { onClose: () => void }) {
  const scriptType = useScriptType();
  const {
    data: { selectedApps },
  } = useUserState();

  const tasksAvailable = selectedApps.gTasks;
  const calendarAvailable = selectedApps.gCalendar;
  const chatGptAvailable = selectedApps.chatGpt;

  const canAddMore = !tasksAvailable || !calendarAvailable || !chatGptAvailable;

  return (
    <>
      <TabIconsContainer scriptType={scriptType} id="summary-tabs-container">
        {tasksAvailable && <TabOption tabName="tasks" />}
        {calendarAvailable && <TabOption tabName="calendar" />}
        {chatGptAvailable && <TabOption tabName="chatGpt" />}
        {canAddMore && scriptType === "Popup" && <TabOption tabName="add" />}
        <IconButton sx={{ ml: "auto" }} size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
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
      onClick={() => updateUserState({ currentTab: tabName })}
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
  alignItems: "flex-end",
  position: "fixed",
  backgroundColor: "#d1d5de",
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  zIndex: 50,
  width: "100%",
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...(scriptType === "Content" && { position: "initial" }),
}));

const TabIconStyled = styled(IconButton)<{
  selected?: boolean;
  scriptType: ScriptType;
}>(({ theme, selected, scriptType }) => ({
  // @ts-ignore
  backgroundColor: theme.palette.background.paper,
  // @ts-ignore
  border: `1px solid ${theme.palette.divider}`,
  borderBottom: "none",
  borderTopRightRadius: 2,
  borderTopLeftRadius: 2,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  // @ts-ignore
  padding: "5px 10px",
  ":hover": {
    backgroundColor: "#f1f1f1",
  },

  ...(selected
    ? {
        backgroundColor: "#f1f1f1",
        border: `1px solid #9e9e9e`,
        boxShadow:
          scriptType === "Content" ? "none" : "0px 0px 4px 2px #0000004a",
      }
    : {
        // marginLeft: "-4px",
        zIndex: -1,
        // ":hover": {
        //   backgroundColor: #f1f1f1,
        // },
      }),
}));
