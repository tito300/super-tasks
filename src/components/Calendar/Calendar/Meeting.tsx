import { Stack, Typography, styled } from "@mui/material";
import { useTasksSettings } from "@src/api/task.api";
import { useUserSettings } from "@src/api/user.api";
import { CalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";

const MeetingStyled = styled(Stack)`
  position: absolute;
  width: 95%;
  background-color: rgb(3, 155, 229);
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
`;

export function Meeting({ event }: { event: CalendarEvent }) {
  const startHour = dayjs(event.start.dateTime).hour();
  const startMinute = dayjs(event.start.dateTime).minute();
//   const { userSettings } = useUserSettings();
const { tasksSettings } = useTasksSettings();

  const top = startHour * 60 + startMinute;

  const endHour = dayjs(event.end.dateTime).hour();
  const endMinute = dayjs(event.end.dateTime).minute();

  const height = (endHour - startHour) * 60 + endMinute - startMinute;

  return (
    <MeetingStyled sx={{ top: top, maxHeight: height }}>
      <Typography variant="body2" sx={{ filter: tasksSettings.blurText ? 'blur(5px)' : 'none' }}>{event.summary}</Typography>
      <Typography fontSize={14}  sx={{ filter: tasksSettings.blurText ? 'blur(5px)' : 'none' }}>
        {dayjs(event.start.dateTime).format("HH:mma")} -{" "}
        {dayjs(event.end.dateTime).format("HH:mma")}
      </Typography>
    </MeetingStyled>
  );
}
