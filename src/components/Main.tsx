import { ThemeProvider } from "@mui/material";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { ServicesProvider } from "./Providers/ServicesProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageEngineProvider } from "./Providers/MessageEngineProvider";
import { calendarTheme, tasksTheme } from "../theme/google.theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ScriptTypeProvider } from "./Providers/ScriptTypeProvider";
import { deepmerge } from "@mui/utils";
import { GlobalStateProvider } from "./Providers/globalStateProvider";
import {
  UserSettingsProvider,
  useUserSettings,
} from "./Providers/UserSettingsProvider";
import { UserStateProvider, useUserState } from "./Providers/UserStateProvider";
import { CalendarSettingsProvider } from "./Providers/CalendarSettingsProvider";
import { CalendarsStateProvider } from "./Providers/CalendarStateProvider";
import { TasksSettingsProvider } from "./Providers/TasksSettingsProvider";
import { TasksStateProvider } from "./Providers/TasksStateProvider";

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
  useEffect(() => {
    console.log("mounted");
  }, []);
  return (
    <ScriptTypeProvider scriptType={scriptType}>
      <QueryClientProvider client={queryClient}>
        <MessageEngineProvider scriptType={scriptType}>
          <ServicesProvider scriptType={scriptType}>
            <GlobalStateProvider>
              <UserSettingsProvider>
                <UserStateProvider>
                  <CustomThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TasksSettingsProvider>
                        <TasksStateProvider>
                          <CalendarSettingsProvider>
                            <CalendarsStateProvider>
                              {children}
                            </CalendarsStateProvider>
                          </CalendarSettingsProvider>
                        </TasksStateProvider>
                      </TasksSettingsProvider>
                    </LocalizationProvider>
                  </CustomThemeProvider>
                </UserStateProvider>
              </UserSettingsProvider>
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
  const {
    data: { currentTab },
  } = useUserState();

  const theme = useMemo(() => {
    return deepmerge(themeMap[currentTab], inTheme);
  }, [currentTab]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
