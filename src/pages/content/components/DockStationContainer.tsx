import {
  PropsWithChildren,
  useState,
} from "react";
import { DockStationControls } from "./DockStationControls";
import {
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { useUserSettingsContext } from "@src/components/Providers/UserSettingsContext";
import { constants } from "@src/config/constants";
import { DraggablePopper } from "@src/components/DraggablePopper";

export function DockStationContainer({ children }: PropsWithChildren) {
  const { userSettings, isNewTab, updateUserSettings } = useUserSettingsContext();

  const [removed, setRemoved] = useState(false);
  const theme = useTheme();

  if (removed) {
    return null;
  }

  const defaultPositions = {
    x: window.innerWidth - 32,
    y: window.innerHeight - 16,
  };

  const open = userSettings.taskButtonExpanded;

  return (
    <DraggablePopper
      id={`${constants.EXTENSION_NAME}-expand-wrapper`}
      defaultPosition={defaultPositions}
      sx={{ width: open ? 0 : 51, height: 51 }}
      popperProps={{ open, placement: "right-end", keepMounted: true }}
      popperChildren={
        <>
          <DockStationControls
            onMinimize={() => updateUserSettings({ taskButtonExpanded: false })}
            onRemove={() => setRemoved(true)}
          />
          <Box sx={{ display: open ? "block" : "none" }}>{children}</Box>
        </>
      }
    >
      {!open && (
        <IconButton
          id={`${constants.EXTENSION_NAME}-expand-button`}
          sx={{
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.accent,
            fontSize: 0,
            [":hover"]: {
              backgroundColor: theme.palette.background.accent,
              opacity: open ? 0 : 0.9,
            },
          }}
          onClick={() => updateUserSettings({ taskButtonExpanded: true })}
        >
          <MenuOpen fontSize="large" />
        </IconButton>
      )}
    </DraggablePopper>
  );
}
