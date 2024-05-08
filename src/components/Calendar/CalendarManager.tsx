import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";
import {
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  StackProps,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import dayjs from "dayjs";

export function CalendarManager({
  calendarId,
  isLoading: isCalendarsLoading,
}: {
  calendarId?: string | null;
  isLoading: boolean;
}) {
  const { data: calendarEvents, isLoading } = useCalendarEvents({
    calendarId,
  });

  return (
    <Stack>
      <LinearProgress
        sx={{
          visibility: !isLoading ? "hidden" : "visible",
        }}
      />
      <CalendarControls />
      <CalendarTable
        isLoading={isCalendarsLoading || isLoading}
        calendarEvents={calendarEvents!}
      />
    </Stack>
  );
}

export function CalendarControls() {
  return (
    <Stack
      direction="row"
      alignItems={"center"}
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <DateControl isLoading />
    </Stack>
  );
}

export function DateControl(props: StackProps & { isLoading?: boolean }) {
  return (
    <Stack direction="row" alignItems={"center"}>
      <IconButton size="small">
        <ArrowBackIosNewIcon />
      </IconButton>
      {props.isLoading ? (
        <Skeleton width={100} variant="text" />
      ) : (
        dayjs().format("MMM D, YYYY")
      )}
      <IconButton size="small">
        <ArrowForwardIos />
      </IconButton>
    </Stack>
  );
}
