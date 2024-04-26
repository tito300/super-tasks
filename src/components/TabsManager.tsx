import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, styled, tabsClasses } from "@mui/material";
import { Tab as TabType } from "@src/config/userSettingsDefaults";
import React from "react";
import { CalendarMonth, Checklist } from "@mui/icons-material";
import { useScriptType } from "./Providers/ScriptTypeProvider";
import { useUserSettings } from "@src/api/user.api";

export function TabsManager({
  tabs,
  hideTabs,
}: {
  hideTabs?: boolean;
  tabs: Record<TabType, React.ReactNode>;
}) {
  const { userSettings, updateUserSettings } = useUserSettings();
  const scriptType = useScriptType();

  const handleChange = (event: React.SyntheticEvent, newValue: TabType) => {
    updateUserSettings({ currentTab: newValue });
  };

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
                borderBottom: 1,
                borderColor: "divider",
                position: scriptType === "Popup" ? "fixed" : "absolute",
                top: scriptType === "Popup" ? 0 : 45,
                zIndex: 10,
                backgroundColor: "white",
                width: "100%",
              }}
            >
              <TabList
                sx={{ minHeight: 32, px: 1 }}
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <TabItem value="tasks" icon={<Checklist fontSize="small" />} />
                <TabItem
                  value="calendar"
                  icon={<CalendarMonth fontSize="small" />}
                />
              </TabList>
            </Box>
          </>
        )}
        <TabPanel sx={{ p: 0 }} value="tasks">
          {tabs["tasks"]}
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="calendar">
          {tabs["calendar"]}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const TabItem = styled(Tab)(({ theme }) => ({
  padding: 1,
  minHeight: 32,
  minWidth: 45,
}));
