import { CacheProvider } from "@emotion/react";
import { SxProps, Popper, ThemeProvider, PopperProps } from "@mui/material";
import { constants } from "@src/config/constants";
import { commonTheme } from "@src/theme/common.theme";
import { useState, useMemo } from "react";
import createCache from "@emotion/cache";
import { styled } from "@mui/material";
import { ShadowDomPortal } from "./ShadowDomPortal";

const StyledPoPperContainer = styled("div")({});

export function StyledPopper({
  children,
  sx,
  ...rest
}: { children: React.ReactNode; sx?: SxProps } & PopperProps) {
  // const [containerEl, setOpenRewriteContainerEl] =
  //   useState<HTMLDivElement | null>(null);

  // const cache = useMemo(() => {
  //   if (!containerEl) return null;

  //   return createCache({
  //     key: `${constants.EXTENSION_NAME}-css`,
  //     container: containerEl as HTMLElement,
  //   });
  // }, [containerEl]);

  return (
    <ShadowDomPortal>
      <Popper disablePortal style={{ zIndex: 1000 }} {...rest}>
        {/* <StyledPoPperContainer
          sx={sx}
          ref={(el) => setOpenRewriteContainerEl(el)}
        >
          <style>{`
          *{box-sizing: border-box;}
        `}</style>
          {cache && (
            <CacheProvider value={cache!}>
              <ThemeProvider theme={commonTheme}> */}
        {children}
        {/* </ThemeProvider>
            </CacheProvider>
          )}
        </StyledPoPperContainer> */}
      </Popper>
    </ShadowDomPortal>
  );
}
