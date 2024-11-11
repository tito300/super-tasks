import { CacheProvider } from "@emotion/react";
import {
  SxProps,
  PopoverProps,
  Popover,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { constants } from "@src/config/constants";
import { commonTheme } from "@src/theme/common.theme";
import { useState, useMemo } from "react";
import createCache from "@emotion/cache";
import { styled } from "@mui/material";

const StyledPopoverContainer = styled("div")({});

export function StyledPopover({
  children,
  sx,
  ...rest
}: { children: React.ReactNode; sx?: SxProps } & PopoverProps) {
  const [containerEl, setOpenRewriteContainerEl] =
    useState<HTMLDivElement | null>(null);

  const cache = useMemo(() => {
    if (!containerEl) return null;

    return createCache({
      key: `${constants.EXTENSION_NAME}-css`,
      container: containerEl as HTMLElement,
    });
  }, [containerEl]);

  return (
    <Popover sx={{ zIndex: 1000 }} {...rest}>
      <StyledPopoverContainer
        id={`${constants.EXTENSION_NAME}-popover-container`}
        sx={sx}
        ref={(el) => setOpenRewriteContainerEl(el)}
      >
        <style>{`
          *{box-sizing: border-box;}
        `}</style>
        {cache && (
          <CacheProvider value={cache!}>
            <ThemeProvider theme={commonTheme}>{children}</ThemeProvider>
          </CacheProvider>
        )}
      </StyledPopoverContainer>
    </Popover>
  );
}
