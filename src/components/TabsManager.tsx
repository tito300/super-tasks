import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  Tab,
  styled,
  tabsClasses,
} from "@mui/material";
import { Tab as TabType } from "@src/config/settingsDefaults";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { CalendarMonth, Checklist } from "@mui/icons-material";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { useUserSettings } from "@src/api/user.api";
import { useRootElement } from "@src/hooks/useRootElement";
import deepmerge from "@mui/utils/deepmerge";

export function TabsManager({
  tabs,
  tabIconButtonProps,
  tabIconButtonPropsSelected,
  renderTabsElement,
  hideTabs,
}: {
  hideTabs?: boolean;
  tabIconButtonProps?: IconButtonProps;
  tabIconButtonPropsSelected?: IconButtonProps;
  renderTabsElement?: (tabsEl: ReactNode) => React.ReactNode;
  tabs: Record<TabType, React.ReactNode>;
}) {
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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={userSettings.currentTab}>
        {!hideTabs && renderTabs}
        <Box
          sx={{
            display: userSettings.currentTab === "tasks" ? "block" : "none",
          }}
        >
          {tabs["tasks"]}
        </Box>
        <Box
          sx={{
            display: userSettings.currentTab === "calendar" ? "block" : "none",
          }}
        >
          {tabs["calendar"]}
        </Box>
      </TabContext>
    </Box>
  );
}

function SummaryTabs({
  handleChange,
  currentTab,
}: {
  handleChange: (e: any, tab: TabType) => void;
  currentTab: TabType;
}) {
  const { userSettings } = useUserSettings();

  return (
    <Box
      id="summary-tabs-container"
      sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        bottom: userSettings.accordionExpanded
          ? "calc(100% - 10px)"
          : "calc(100% - 38px)",
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
