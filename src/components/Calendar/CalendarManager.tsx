import { useCalendarEvents } from "@src/api/calendar.api";
import { CalendarTable } from "./Calendar/CalendarTable";
import {
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  CalendarMonth,
  Refresh,
} from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { useScriptType } from "../Providers/ScriptTypeProvider";

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
    <CalendarTable
      isLoading={isCalendarsLoading || isLoading}
      calendarEvents={calendarEvents!}
    />
  );
}
