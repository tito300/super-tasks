import { Theme, ThemeProvider } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import { ServicesProvider } from "./Providers/ServicesProvider";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageEngineProvider } from "./Providers/MessageEngineProvider";
import { theme as v1Theme } from "../theme/v1.theme";
import { deepmerge } from "@mui/utils";
import { UIControlsProvider } from "./Providers/UIControlsProvider";

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
}) => {
  const enhancedTheme = useMemo(() => {
    return deepmerge(theme ?? {}, v1Theme);
  }, [theme]);
  return (
    <ThemeProvider theme={enhancedTheme ?? {}}>
      <QueryClientProvider client={queryClient}>
        <MessageEngineProvider scriptType={scriptType}>
          <ServicesProvider scriptType={scriptType}>
            <UIControlsProvider >
              {children}
            </UIControlsProvider>
          </ServicesProvider>
        </MessageEngineProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
