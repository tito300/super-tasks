import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useEffect, useMemo, useState } from "react";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { Alert, LinearProgress, Stack, StackProps } from "@mui/material";
import { CalendarControls } from "./CalendarControls";
import { Settings } from "../shared/Settings/Settings";

export function CalendarListManager(stackProps: StackProps) {
  const { data: calendarList, isError, isLoading } = useCalendarLists();
  const {
    data: { selectedCalendarId },
    updateData: updateCalendarState,
  } = useCalendarState();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!selectedCalendarId && !!calendarList?.length) {
      updateCalendarState({
        selectedCalendarId: calendarList.find((c) => c.primary)?.id,
        // selectedCalendarId: "tarek.demachkie@gmail.com",
      });
    }
  }, [calendarList, selectedCalendarId]);

  return (
    <Stack
      {...stackProps}
      sx={{
        position: "relative",
        ...(stackProps.sx || {}),
      }}
    >
      <CalendarControls
        pl={1}
        settingsOpen={settingsOpen}
        onSettingsClick={() => setSettingsOpen(!settingsOpen)}
      />
      {isError ? (
        <Alert severity="error">Error loading calendars</Alert>
      ) : settingsOpen ? (
        <Settings />
      ) : (
        <CalendarManager />
      )}
    </Stack>
  );
}
