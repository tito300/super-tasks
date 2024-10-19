import { TabContext } from "@mui/lab";
import {
  Box,
  IconButton,
  IconButtonProps,
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
  } = useUserState();
  const scriptType = useScriptType();

  useLogRender("TabsManager");

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
        {!hideTabs && <NavigationTabs />}
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
      </TabContext>
    </Stack>
  );
}

function NavigationTabs() {
  const scriptType = useScriptType();
  const {
    data: { accordionExpanded, selectedApps },
  } = useUserState();

  const tasksAvailable = selectedApps.gTasks;
  const calendarAvailable = selectedApps.gCalendar;
  const chatGptAvailable = selectedApps.chatGpt;

  const canAddMore = !tasksAvailable || !calendarAvailable || !chatGptAvailable;

  return (
    <>
      <TabIconsContainer
        scriptType={scriptType}
        id="summary-tabs-container"
        accordionOpen={accordionExpanded}
      >
        {tasksAvailable && <TabOption tabName="tasks" />}
        {calendarAvailable && <TabOption tabName="calendar" />}
        {chatGptAvailable && <TabOption tabName="chatGpt" />}
        {canAddMore && scriptType === "Popup" && <TabOption tabName="add" />}
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
        width={20}
        height={20}
      />
    ) : tabName === "calendar" ? (
      <img src={googleCalendarIcon} alt="calendar" width={18} height={18} />
    ) : tabName === "chatGpt" ? (
      <img src={chatGptCalendarIcon} alt="calendar" width={18} height={18} />
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
  accordionOpen: boolean;
}>(({ theme, scriptType, accordionOpen }) => ({
  flexDirection: "row",
  alignItems: "flex-end",
  ...(scriptType === "Content"
    ? {
        position: "absolute",
        bottom: accordionOpen ? "calc(100% - 10px)" : "calc(100% - 40px)",
        top: "auto",
        right: 5,
        zIndex: -1,
        paddingBottom: 8,
        padding: "0px 4px 6px",
      }
    : {
        position: "fixed",
        overflow: "hidden",
        backgroundColor: "#f4f5f7",
        zIndex: 50,
        width: "100%",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
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
  borderTopRightRadius: scriptType === "Content" ? 4 : 2,
  borderTopLeftRadius: scriptType === "Content" ? 4 : 2,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  // @ts-ignore
  padding: scriptType === "Content" ? "3px 14px" : "5px 14px",
  ":hover": {
    backgroundColor: "#f1f1f1",
  },

  ...(selected
    ? {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        padding: "5px 14px",
        boxShadow:
          scriptType === "Content" ? "none" : "0px 0px 4px 2px #0000004a",
      }
    : {
        marginLeft: "-4px",
        zIndex: -1,
        // ":hover": {
        //   backgroundColor: #f1f1f1,
        // },
      }),
}));
