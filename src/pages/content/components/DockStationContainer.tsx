import { PropsWithChildren, useState } from "react";
import { DockStationControls } from "./DockStationControls";
import { Box, IconButton, styled, useTheme } from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { useUIControls } from "@src/components/Providers/UIControlsProvider";

const Container = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

export function DockStationContainer({ children }: PropsWithChildren) {
  const uiControls = useUIControls();
  const [open, setOpen] = useState(uiControls.defaultOpen);
  const [removed, setRemoved] = useState(false);
  const theme = useTheme();

  if (removed) {
    return null;
  }

  return (
    <Container>
      {open && (
        <DockStationControls
          onMinimize={() => setOpen(false)}
          onRemove={() => setRemoved(true)}
        />
      )}
      <Box sx={{ display: open ? "block" : "none" }}>{children}</Box>
      <IconButton
        sx={{
          display: open ? "none" : "block",
          boxShadow: theme.shadows[3],
          backgroundColor: theme.palette.background.paper,
          fontSize: 0,
          [":hover"]: {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={() => setOpen(true)}
      >
        <MenuOpen fontSize="large" />
      </IconButton>
    </Container>
  );
}
