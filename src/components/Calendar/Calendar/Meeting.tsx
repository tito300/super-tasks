import {
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { CalendarEvent } from "@src/calendar.types";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { getEventEndTime, getEventStartTime } from "@src/utils/calendarUtils";
import dayjs from "dayjs";
import { useMemo } from "react";

const MeetingStyled = styled(Stack)<{
  reservedCount?: number;
  totalStackedEvents?: number;
}>(({ theme, reservedCount, totalStackedEvents }) => {
  reservedCount = reservedCount || 1;
  totalStackedEvents = totalStackedEvents || 1;
  const left = (reservedCount - 1) * 60;
  const width = `calc(100% - ${
    (totalStackedEvents - 1) * 10
  }px - ${left}px - 20px)`;

  // 100 - 2 * 10 =

  return {
    position: "absolute",
    left: left,
    width: width,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    cursor: "pointer",
    overflow: "hidden",
    boxSizing: "border-box",
    zIndex: (reservedCount || 1) * 2,
  };
});

// 3 - 1 =
// 1 -> 30
// 3 -> 10

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 100,
  },
});

export function Meeting({ event }: { event: CalendarEvent }) {
  const startHour = dayjs(getEventStartTime(event)).hour();
  const startMinute = dayjs(getEventStartTime(event)).minute();
  const {
    data: { blurText },
  } = useUserState();
  //   const { tasksSettings } = useTasksSettings();

  const { top, height } = useMemo(() => {
    const top = startHour * 60 + startMinute;

    const endHour = dayjs(event.end.dateTime).hour();
    const endMinute = dayjs(event.end.dateTime).minute();

    const height = (endHour - startHour) * 60 + endMinute - startMinute;

    return { top, height };
  }, [event.end.dateTime, startHour, startMinute]);

  return (
    <CustomWidthTooltip title={event.summary} placement="top">
      <MeetingStyled
        reservedCount={event.reservationCount}
        totalStackedEvents={event.totalStackedEvents}
        sx={{ top: top, height: height, maxHeight: height }}
      >
        <Typography
          variant="body2"
          sx={{ filter: blurText ? "blur(5px)" : "none" }}
          whiteSpace="nowrap"
        >
          {event.summary}
        </Typography>
        {height >= 40 && (
          <Typography
            fontSize={14}
            sx={{ filter: blurText ? "blur(5px)" : "none" }}
          >
            {dayjs(getEventStartTime(event)).format("H:mm")} -{" "}
            {dayjs(getEventEndTime(event)).format("H:mma")}
          </Typography>
        )}
      </MeetingStyled>
    </CustomWidthTooltip>
  );
}
