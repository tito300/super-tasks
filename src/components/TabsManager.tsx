import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, IconButton, Tab, styled, tabsClasses } from "@mui/material";
import { Tab as TabType } from "@src/config/settingsDefaults";
import React, { useEffect } from "react";
import { CalendarMonth, Checklist } from "@mui/icons-material";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { useUserSettings } from "@src/api/user.api";
import { useRootElement } from "@src/hooks/useRootElement";

export function TabsManager({
  tabs,
  hideTabs,
}: {
  hideTabs?: boolean;
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

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={userSettings.currentTab}>
        {!hideTabs && (
          <>
            <Box
              sx={{
                height: scriptType === "Popup" ? 28 : 32,
                width: "100%",
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: 1,
                borderColor: "divider",
                position: scriptType === "Popup" ? "fixed" : "absolute",
                top: scriptType === "Popup" ? 0 : 45,
                zIndex: 50,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              {/* <TabList
                sx={{ minHeight: 32, px: 1 }}
                onChange={handleChange}
                aria-label="lab API tabs example"
              > */}
              <IconButton
                size="small"
                color={
                  userSettings.currentTab === "tasks" ? "primary" : "default"
                }
                onClick={(e) => handleChange(e, "tasks")}
                children={<Checklist fontSize="small" />}
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
                color={
                  userSettings.currentTab === "calendar" ? "primary" : "default"
                }
                onClick={(e) => handleChange(e, "calendar")}
                children={<CalendarMonth fontSize="small" />}
              />
              {/* </TabList> */}
            </Box>
          </>
        )}
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
