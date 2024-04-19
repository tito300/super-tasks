import { Theme, ThemeProvider } from "@mui/material";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ServicesProvider } from "./Providers/ServicesProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageEngineProvider } from "./Providers/MessageEngineProvider";
import { theme as v1Theme } from "../theme/v1.theme";
import { deepmerge } from "@mui/utils";
import { UserSettingsProvider } from "./Providers/UserSettingsContext";
import { TasksGlobalStateProvider } from "./Providers/TasksGlobalStateProvider";
import { OauthRequired } from "./Oauth/OauthGate";

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
  theme?: Theme;
  remount?: () => void;
}) => {
  const enhancedTheme = useMemo(() => {
    return deepmerge(theme ?? {}, v1Theme);
  }, [theme]);

  useEffect(() => {}, []);

  return (
    <ThemeProvider theme={enhancedTheme ?? {}}>
      <QueryClientProvider client={queryClient}>
        <MessageEngineProvider scriptType={scriptType}>
          <ServicesProvider scriptType={scriptType}>
            <UserSettingsProvider>
              <TasksGlobalStateProvider>{children}</TasksGlobalStateProvider>
            </UserSettingsProvider>
          </ServicesProvider>
        </MessageEngineProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
