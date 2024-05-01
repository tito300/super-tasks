import { Stack, Typography, styled } from "@mui/material";
import { useTasksSettings } from "@src/api/task.api";
import { useUserSettings } from "@src/api/user.api";
import { CalendarEvent } from "@src/calendar.types";
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
  const startHour = dayjs(event.start.dateTime).hour();
  const startMinute = dayjs(event.start.dateTime).minute();
  const { userSettings } = useUserSettings();
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
        sx={{ filter: userSettings.blurText ? "blur(5px)" : "none" }}
      >
        {event.summary}
      </Typography>
      {height >= 40 && (
        <Typography
          fontSize={14}
          sx={{ filter: userSettings.blurText ? "blur(5px)" : "none" }}
        >
          {dayjs(event.start.dateTime).format("HH:mma")} -{" "}
          {dayjs(event.end.dateTime).format("HH:mma")}
        </Typography>
      )}
    </MeetingStyled>
  );
}
