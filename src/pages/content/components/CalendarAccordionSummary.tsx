import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Stack, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useUserSettings } from "@src/api/user.api";
import { useCalendarEvents } from "@src/api/calendar.api";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { CalendarEvent } from "@src/calendar.types";
import {
  filterFutureEvents,
  sortCalendarEvents,
} from "@src/utils/calendarUtils";

dayjs.extend(duration);

export function CalendarAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const { userSettings, updateUserSettings } = useUserSettings();
  const {
    isLoading,
  } = useCalendarEvents({
    calendarId: "tarek.demachkie@gmail.com",
  });

  const { nextEvent, timeToNextEvent } = useNextEventTimer();

  const title = nextEvent ? (
    <>
      <Typography
        component={"span"}
        sx={{
          color: (theme) => theme.palette.warning.main,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 8,
          mr: 0.5,
          p: (theme) => theme.spacing(0.25, 0.75),
        }}
      >
        {timeToNextEvent?.format("HH:mm") || ""}
      </Typography>{" "}
      <span style={{ filter: userSettings.blurText ? "blur(7px)" : "none" }}>
        {nextEvent.summary}
      </span>
    </>
  ) : isLoading ? (
    "Loading..."
  ) : (
    "No upcoming events"
  );

  return (
    <Stack
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      direction="row"
      alignItems="center"
      width={"100%"}
    >
      <Typography
        fontWeight={500}
        pl={1}
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        overflow="hidden"
        sx={{
          color: (theme) => theme.palette.primary.contrastText,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" ml="auto" gap={0.25}>
        <IconButton
          onClick={(e) => e.stopPropagation()}
          sx={{ opacity: hovered ? 1 : 0 }}
        >
          {userSettings.blurText ? (
            <Visibility
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ blurText: false })}
            />
          ) : (
            <VisibilityOff
              color="action"
              fontSize="small"
              onClick={() => updateUserSettings({ blurText: true })}
            />
          )}
        </IconButton>
        {/* <ReminderBadge sx={{ mx: 1 }} /> */}
      </Stack>
    </Stack>
  );
}

export function useNextEventTimer() {
  const [nextEvent, setNextEvent] = useState<CalendarEvent | null>(null);
  const [timeToNextEvent, setTimeToNextEvent] = useState<Duration | null>(null);
  const {
    data: calendarEvents,
  } = useCalendarEvents({
    calendarId: "tarek.demachkie@gmail.com",
  });

  useEffect(() => {
    if (!calendarEvents?.length) return;

    // sort event by date
    const filteredEvents = filterFutureEvents(
      sortCalendarEvents(calendarEvents)
    );

    const nextEvent = filteredEvents[0];
    setNextEvent(nextEvent);

    function getTimeToNextEvent() {
      const nextEventStartDatetime = dayjs(nextEvent.start.dateTime);
      const timeToNextEvent = dayjs.duration(
        nextEventStartDatetime.diff(dayjs())
      );
      setTimeToNextEvent(timeToNextEvent);
    }

    getTimeToNextEvent();
    const timeout = setInterval(getTimeToNextEvent, 1000 * 60);

    return () => {
      clearInterval(timeout);
    };
  }, [calendarEvents]);

  return {
    nextEvent,
    timeToNextEvent,
  };
}
