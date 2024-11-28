import { CacheProvider, ThemeProvider } from "@emotion/react";
import { commonTheme } from "@src/theme/common.theme";
import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import createCache from "@emotion/cache";
import { constants } from "@src/config/constants";
import { styled } from "@mui/material";

const Container = styled("div")({});

/**
 * WARNING: Do not use directly if you don't want to affect page styles
 *
 * StyledPortal should be used to render components that need to be styled by the extension's theme.
 * By default portals are rendered in the body of the document, which means they are not styled by the extension's theme.
 */
export function StyledPortal({
  children,
  container,
  ...rest
}: {
  children: React.ReactNode;
  container: HTMLElement | ShadowRoot;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [containerEl, setOpenRewriteContainerEl] =
    useState<HTMLDivElement | null>(null);

  const cache = useMemo(() => {
    if (!containerEl) return null;

    return createCache({
      key: `${constants.EXTENSION_NAME}-css`,
      container: containerEl as HTMLElement,
    });
  }, [containerEl]);
  return createPortal(
    <Container
      id="axess-styled-portal"
      ref={(el) => setOpenRewriteContainerEl(el)}
      {...rest}
    >
      <style>{`
          *{box-sizing: border-box;}
        `}</style>
      {cache && (
        <CacheProvider value={cache!}>
          <ThemeProvider theme={commonTheme}>{children}</ThemeProvider>
        </CacheProvider>
      )}
    </Container>,
    container
  );
}
