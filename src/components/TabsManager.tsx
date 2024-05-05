import { TabContext } from "@mui/lab";
import {
  Box,
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
} from "@mui/material";
import { Tab as TabType } from "@src/config/settingsDefaults";
import React, { ReactNode, useEffect } from "react";
import { CalendarMonth, Checklist } from "@mui/icons-material";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { useUserSettings } from "@src/api/user.api";
import { useRootElement } from "@src/hooks/useRootElement";

export function TabsManager({
  tabs,
  tabIconButtonProps,
  tabIconButtonPropsSelected,
  renderTabsElement,
  hideTabs,
  ...rootProps
}: {
  hideTabs?: boolean;
  tabIconButtonProps?: IconButtonProps;
  tabIconButtonPropsSelected?: IconButtonProps;
  renderTabsElement?: (tabsEl: ReactNode) => React.ReactNode;
  tabs: Record<TabType, React.ReactNode>;
} & StackProps) {
  const { userSettings, updateUserSettings } = useUserSettings();
  const scriptType = useScriptType();
  const rootElement = useRootElement();

  const handleChange = (event: React.SyntheticEvent, newValue: TabType) => {
    updateUserSettings({ currentTab: newValue });
  };

  useEffect(() => {
    if (userSettings.currentTab === "calendar") {
      rootElement.querySelector("#current-time-indicator")?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    } else if (userSettings.currentTab === "tasks") {
      rootElement.scrollTo(0, 0);
    }
  }, [userSettings.currentTab, rootElement]);

  const tabsEl: ReactNode = (
    <SummaryTabs
      handleChange={handleChange}
      currentTab={userSettings.currentTab}
    />
  );
  const renderTabs = renderTabsElement ? (
    renderTabsElement(tabsEl)
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {tabsEl}
    </Box>
  );

  return (
    <Stack
      {...rootProps}
      sx={{
        width: "100%",
        typography: "body1",
        ":hover": {
          [`& #summary-tabs-container`]: {
            bottom: "calc(100% - 10px)",
            transition: "bottom 0.1s",
          },
        },
        ...rootProps?.sx,
      }}
    >
      <TabContext value={userSettings.currentTab}>
        {!hideTabs && renderTabs}
        <Stack
          flexGrow={1}
          sx={{
            display: userSettings.currentTab === "tasks" ? "flex" : "none",
          }}
        >
          {tabs["tasks"]}
        </Stack>
        <Stack
          flexGrow={1}
          sx={{
            display: userSettings.currentTab === "calendar" ? "block" : "none",
          }}
        >
          {tabs["calendar"]}
        </Stack>
      </TabContext>
    </Stack>
  );
}

function SummaryTabs({
  handleChange,
  currentTab,
}: {
  handleChange: (e: any, tab: TabType) => void;
  currentTab: TabType;
}) {
  return (
    <Box
      id="summary-tabs-container"
      sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        bottom: "calc(100% - 38px)",
        right: 5,
        zIndex: -1,
        paddingBottom: 8,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        padding: "0px 4px 6px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        size="small"
        onClick={(e) => handleChange(e, "tasks")}
        children={<Checklist fontSize="small" color={"inherit"} />}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.light,
          borderTopRightRadius: "4px",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: "3px 14px",
          ":hover": {
            backgroundColor: (theme) => theme.palette.primary.main,
          },
          ...(currentTab === "tasks"
            ? {
                backgroundColor: (theme) => theme.palette.primary.main,
                borderRight: (theme) =>
                  `1px solid ${theme.palette.primary.contrastText}`,
                padding: "5px 14px",
                zIndex: 1,
              }
            : {
                marginRight: "-4px",
                ":hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }),
        }}
      />
      <IconButton
        size="small"
        onClick={(e) => handleChange(e, "calendar")}
        children={<CalendarMonth fontSize="small" color={"inherit"} />}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.light,
          borderTopRightRadius: "4px",
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          padding: "3px 14px",
          ":hover": {
            backgroundColor: (theme) => theme.palette.primary.main,
          },
          ...(currentTab === "calendar"
            ? {
                backgroundColor: (theme) => theme.palette.primary.main,
                borderLeft: (theme) =>
                  `1px solid ${theme.palette.primary.contrastText}`,
                padding: "5px 14px",
              }
            : {
                marginLeft: "-4px",
                zIndex: -1,
                ":hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }),
        }}
      />
    </Box>
  );
}
