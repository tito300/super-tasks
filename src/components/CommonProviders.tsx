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
import { useLogRender } from "@src/hooks/useLogRender";
import { AppRenderer } from "./AppRenderer";
import { ChatGptSettingsProvider } from "./Providers/ChatGptSettingsProvider";
import { ChatGptStateProvider } from "./Providers/ChatGptStateProvider";
import { chatGptTheme } from "@src/theme/chatGpt.theme";

const queryClient = new QueryClient();

/**
 * use Main in every script (content, popup)
 */
export const CommonProviders = ({
  children,
  scriptType,
  theme,
}: {
  scriptType: ScriptType;
  theme?: unknown;
  remount?: () => void;
  children: (ready: boolean) => React.ReactNode;
}) => {
  useLogRender("Main");

  return (
    <ScriptTypeProvider scriptType={scriptType}>
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
                            <ChatGptSettingsProvider>
                              <ChatGptStateProvider>
                                <QueryClientProvider client={queryClient}>
                                  <AppRenderer>{children}</AppRenderer>
                                </QueryClientProvider>
                              </ChatGptStateProvider>
                            </ChatGptSettingsProvider>
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
    </ScriptTypeProvider>
  );
};

const themeMap = {
  tasks: tasksTheme,
  calendar: calendarTheme,
  chatGpt: chatGptTheme,
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
