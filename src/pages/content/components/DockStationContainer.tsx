import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DockStationControls } from "./DockStationControls";
import {
  Box,
  IconButton,
  Popper,
  SxProps,
  styled,
  useTheme,
} from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { useUIControls } from "@src/components/Providers/UIControlsProvider";
import { Draggable } from "@src/components/Draggable";
import { constants } from "@src/config/constants";

export function DockStationContainer({ children }: PropsWithChildren) {
  const { userSettings, isNewTab } = useUIControls();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(
    isNewTab && userSettings.tasksOpenOnNewTab
      ? true
      : userSettings.taskButtonExpanded
  );
  const [removed, setRemoved] = useState(false);
  const theme = useTheme();

  if (removed) {
    return null;
  }

  return (
    <>
      <Popper
        keepMounted
        placement="top-start"
        open={open}
        anchorEl={() => buttonRef.current!}
      >
        <DockStationControls
          onMinimize={() => setOpen(false)}
          onRemove={() => setRemoved(true)}
        />
        <Box sx={{ display: open ? "block" : "none" }}>{children}</Box>
      </Popper>
      <Draggable>
        <IconButton
          ref={buttonRef}
          id={`${constants.EXTENSION_NAME}-expand-button`}
          sx={{
            opacity: open ? 0 : 1,
            pointerEvents: open ? "none" : "auto",
            marginRight: open ? "-100%" : 0,
            marginBottom: open ? "-100%" : 0,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.accent,
            fontSize: 0,
            [":hover"]: {
              backgroundColor: theme.palette.background.accent,
              opacity: open ? 0 : 0.9,
            },
          }}
          onClick={() => setOpen(true)}
        >
          <MenuOpen fontSize="large" />
        </IconButton>
      </Draggable>
    </>
  );
}
