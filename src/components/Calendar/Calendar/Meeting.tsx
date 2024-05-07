import { Stack, Typography, styled } from "@mui/material";
import { CalendarEvent } from "@src/calendar.types";
import { useUserSettings } from "@src/components/Providers/UserSettingsProvider";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { getEventEndTime, getEventStartTime } from "@src/utils/calendarUtils";
import dayjs from "dayjs";
import { useMemo } from "react";

const MeetingStyled = styled(Stack)(({ theme }) => ({
  position: "absolute",
  width: "95%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: 4,
  cursor: "pointer",
  overflow: "hidden",
  boxSizing: "border-box",
}));

export function Meeting({ event }: { event: CalendarEvent }) {
  const startHour = dayjs(getEventStartTime(event)).hour();
  const startMinute = dayjs(getEventStartTime(event)).minute();
  const { blurText } = useUserState();
  //   const { tasksSettings } = useTasksSettings();

  const { top, height } = useMemo(() => {
    const top = startHour * 60 + startMinute;

    const endHour = dayjs(event.end.dateTime).hour();
    const endMinute = dayjs(event.end.dateTime).minute();

    const height = (endHour - startHour) * 60 + endMinute - startMinute;

    return { top, height };
  }, [event.end.dateTime, startHour, startMinute]);

  return (
    <MeetingStyled sx={{ top: top, height: height - 2, maxHeight: height - 2 }}>
      <Typography
        variant="body2"
        sx={{ filter: blurText ? "blur(5px)" : "none" }}
      >
        {event.summary}
      </Typography>
      {height >= 40 && (
        <Typography
          fontSize={14}
          sx={{ filter: blurText ? "blur(5px)" : "none" }}
        >
          {dayjs(getEventStartTime(event)).format("HH:mma")} -{" "}
          {dayjs(getEventEndTime(event)).format("HH:mma")}
        </Typography>
      )}
    </MeetingStyled>
  );
}
