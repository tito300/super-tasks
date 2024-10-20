import { Refresh, Settings } from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import { Stack, StackProps } from "@mui/material";
import { CircularProgress, IconButton, styled } from "@mui/material";
import { Box } from "@mui/material";
import { cloneElement } from "react";

const Container = styled(Stack)(({ theme }) => ({
  position: "sticky",
  top: 0,
  right: 0,
  left: 0,
  zIndex: 100,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0.25, 1),
}));

const ControlsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(0.25),
}));

export function AppControls({
  children,
  reloading,
  reloadIcon: inReloadIcon,
  settingsOpen,
  onReloadClick,
  onSettingsClick,
  ...rest
}: StackProps & {
  reloading: boolean;
  reloadIcon?: React.ReactElement;
  settingsOpen: boolean;
  onReloadClick: () => void;
  onSettingsClick: () => void;
}) {
  const reloadIcon = inReloadIcon
    ? cloneElement(inReloadIcon, { fontSize: "small" })
    : null;

  return (
    <Container {...rest}>
      <Wrapper>
        {children}
        <ControlsContainer>
          <IconButton
            color={settingsOpen ? "primary" : "default"}
            onClick={onSettingsClick}
            size="small"
          >
            <Settings fontSize="small" />
          </IconButton>
          <IconButton size="small" disabled={reloading} onClick={onReloadClick}>
            {reloading ? (
              <CircularProgress size="20px" />
            ) : (
              reloadIcon || <Refresh fontSize="small" />
            )}
          </IconButton>
        </ControlsContainer>
      </Wrapper>
      <LinearProgress
        sx={{
          position: "absolute",
          bottom: -4,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          visibility: reloading ? "visible" : "hidden",
        }}
      />
    </Container>
  );
}
