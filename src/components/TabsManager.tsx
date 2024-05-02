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

export function TabsManager({
  tabs,
  tabIconButtonProps,
  renderTabsElement,
  hideTabs,
}: {
  hideTabs?: boolean;
  tabIconButtonProps?: IconButtonProps;
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
    <>
      <IconButton
        size="small"
        color={userSettings.currentTab === "tasks" ? "primary" : "default"}
        onClick={(e) => handleChange(e, "tasks")}
        children={<Checklist fontSize="small" />}
        {...tabIconButtonProps}
      />
      <Box
        sx={{
          width: "1px",
          height: 16,
          backgroundColor: (theme) => theme.palette.divider,
        }}
      />
      <IconButton
        size="small"
        color={userSettings.currentTab === "calendar" ? "primary" : "default"}
        onClick={(e) => handleChange(e, "calendar")}
        children={<CalendarMonth fontSize="small" />}
        {...tabIconButtonProps}
      />
    </>
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

const TabItem = styled(Tab)(({ theme }) => ({
  padding: 1,
  minHeight: 32,
  minWidth: 45,
}));
