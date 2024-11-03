import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { CalendarManager } from "./CalendarManager";
import { useEffect, useMemo } from "react";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { Alert, LinearProgress, Stack, StackProps } from "@mui/material";
import { CalendarControls } from "./CalendarControls";

export function CalendarListManager(stackProps: StackProps) {
  const { data: calendarList, isError, isLoading } = useCalendarLists();
  const {
    data: { selectedCalendarId },
    updateData: updateCalendarState,
  } = useCalendarState();

  useEffect(() => {
    if (!selectedCalendarId && !!calendarList?.length) {
      updateCalendarState({
        selectedCalendarId: calendarList.find((c) => c.primary)?.id,
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
      <CalendarControls pl={1} />
      {isError ? (
        <Alert severity="error">Error loading calendars</Alert>
      ) : (
        <CalendarManager />
      )}
    </Stack>
  );
}
