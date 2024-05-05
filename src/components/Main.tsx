import { Theme, ThemeProvider } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import { ServicesProvider } from "./Providers/ServicesProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageEngineProvider } from "./Providers/MessageEngineProvider";
import { calendarTheme, tasksTheme } from "../theme/google.theme";
import { TasksGlobalStateProvider } from "./Providers/TasksGlobalStateProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ScriptTypeProvider } from "./Providers/ScriptTypeProvider";
import { useUserSettings } from "@src/api/user.api";
import { deepmerge } from "@mui/utils";
import { GlobalStateProvider } from "./Providers/globalStateProvider";
import { TasksSettingsProvider } from "./Providers/TasksSettingsProvider";
import { TasksLocalStateProvider } from "./Providers/TasksLocalStateProvider";

const queryClient = new QueryClient();

/**
 * use Main in every script (content, popup)
 */
export const Main = ({
  children,
  scriptType,
  theme,
}: PropsWithChildren & {
  scriptType: ScriptType;
  theme?: unknown;
  remount?: () => void;
}) => {
  return (
    <ScriptTypeProvider scriptType={scriptType}>
      <QueryClientProvider client={queryClient}>
        <MessageEngineProvider scriptType={scriptType}>
          <ServicesProvider scriptType={scriptType}>
            <GlobalStateProvider>
              <CustomThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TasksSettingsProvider>
                    <TasksGlobalStateProvider>
                      <TasksLocalStateProvider>
                        {children}
                      </TasksLocalStateProvider>
                    </TasksGlobalStateProvider>
                  </TasksSettingsProvider>
                </LocalizationProvider>
              </CustomThemeProvider>
            </GlobalStateProvider>
          </ServicesProvider>
        </MessageEngineProvider>
      </QueryClientProvider>
    </ScriptTypeProvider>
  );
};

const themeMap = {
  tasks: tasksTheme,
  calendar: calendarTheme,
};

function CustomThemeProvider({
  children,
  theme: inTheme,
}: PropsWithChildren & { theme?: unknown }) {
  const { userSettings } = useUserSettings();

  const theme = useMemo(() => {
    return deepmerge(themeMap[userSettings.currentTab], inTheme);
  }, [userSettings.currentTab]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
