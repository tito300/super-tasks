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
import React, { useEffect } from "react";
import { CalendarMonth, Checklist } from "@mui/icons-material";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { useRootElement } from "@src/hooks/useRootElement";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { useUserSettings } from "./Providers/UserSettingsProvider";
import { useUserState } from "./Providers/UserStateProvider";
import { useLogRender } from "@src/hooks/useLogRender";

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
    updateData: updateUserState,
  } = useUserState();
  const scriptType = useScriptType();

  useLogRender("TabsManager");

  const handleChange = (event: React.SyntheticEvent, newValue: TabName) => {
    updateUserState({ currentTab: newValue });
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
        {!hideTabs && (
          <NavigationTabs handleChange={handleChange} currentTab={currentTab} />
        )}
        <Stack
          flexGrow={1}
          sx={{
            display: currentTab === "tasks" ? "flex" : "none",
          }}
        >
          {tabs["tasks"]}
        </Stack>
        <Stack
          flexGrow={1}
          sx={{
            display: currentTab === "calendar" ? "block" : "none",
          }}
        >
          {tabs["calendar"]}
        </Stack>
      </TabContext>
    </Stack>
  );
}

function NavigationTabs({
  handleChange,
  currentTab,
}: {
  handleChange: (e: any, tab: TabName) => void;
  currentTab: TabName;
}) {
  const scriptType = useScriptType();
  const {
    data: { accordionExpanded },
  } = useUserState();

  return (
    <>
      <TabIconsContainer
        scriptType={scriptType}
        id="summary-tabs-container"
        accordionOpen={accordionExpanded}
      >
        <TabOption tabName="tasks" />
        <TabOption tabName="calendar" />
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
      <Checklist fontSize="small" />
    ) : (
      <CalendarMonth fontSize="small" />
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
  backgroundColor: theme.palette.primary.light,
  borderTopRightRadius: scriptType === "Content" ? 4 : 2,
  borderTopLeftRadius: scriptType === "Content" ? 4 : 2,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  // @ts-ignore
  padding: scriptType === "Content" ? "3px 14px" : "5px 14px",
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },

  ...(selected
    ? {
        backgroundColor: theme.palette.primary.main,
        borderRight:
          scriptType === "Content"
            ? `1px solid ${theme.palette.primary.contrastText}`
            : "none",
        borderLeft:
          scriptType === "Content"
            ? `1px solid ${theme.palette.primary.contrastText}`
            : "none",
        padding: "5px 14px",
        boxShadow:
          scriptType === "Content" ? "none" : "0px 0px 4px 2px #0000004a",
      }
    : {
        marginLeft: "-4px",
        zIndex: -1,
        ":hover": {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
}));
