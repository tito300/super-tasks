import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Stack, Typography, IconButton, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCachedCalendarEvents,
  useCalendarEvents,
  useCalendarSettings,
} from "@src/api/calendar.api";
import dayjs from "dayjs";
import duration, { Duration } from "dayjs/plugin/duration";
import { CalendarEvent } from "@src/calendar.types";
import {
  filterFutureEvents,
  getEventStartTime,
  getTodaysEvents,
} from "@src/utils/calendarUtils";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { useCalendarState } from "@src/components/Providers/CalendarStateProvider";

dayjs.extend(duration);

export function CalendarAccordionSummary() {
  const [hovered, setHovered] = useState(false);
  const {
    data: { blurText },
    updateData: updateUserState,
  } = useUserState();
  const { calendarSettings } = useCalendarSettings();
  const { isLoading } = useCalendarEvents();

  const { nextEvent, timeToNextEvent } = useNextEventTimer();

  const hoursToNextEvent = timeToNextEvent?.asHours() || 0;
  const minutesToNextEvent = timeToNextEvent?.asMinutes() || 0;
  const warnBadge =
    timeToNextEvent &&
    hoursToNextEvent <= 1 &&
    minutesToNextEvent <= calendarSettings.badgeCountDownMinutes;

  const title = nextEvent ? (
    <>
      <Chip
        // component={"span"}
        sx={{
          border: (theme) => `1px solid ${theme.palette.primary.contrastText}`,
          mr: 0.5,
          ...(warnBadge && {
            borderColor: (theme) => theme.palette.warning.dark,
            backgroundColor: (theme) => theme.palette.primary.contrastText,
            color: (theme) => theme.palette.warning.dark,
          }),
        }}
        color={warnBadge ? "warning" : "primary"}
        size="small"
        label={timeToNextEvent?.format("HH:mm") || ""}
      ></Chip>{" "}
      <span style={{ filter: blurText ? "blur(7px)" : "none" }}>
        {nextEvent?.summary}
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
          {blurText ? (
            <Visibility
              color="action"
              fontSize="small"
              onClick={() => updateUserState({ blurText: false })}
            />
          ) : (
            <VisibilityOff
              color="action"
              fontSize="small"
              onClick={() => updateUserState({ blurText: true })}
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

  const { data: calendarEvents } = useCachedCalendarEvents();

  useEffect(() => {
    if (!calendarEvents?.length) return;

    // sort event by date
    const filteredEvents = filterFutureEvents(getTodaysEvents(calendarEvents));

    const nextEvent = filteredEvents[0];
    setNextEvent(nextEvent);

    function getTimeToNextEvent() {
      if (!nextEvent) return;

      const nextEventStartDatetime = dayjs(getEventStartTime(nextEvent));
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
