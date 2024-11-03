import { Refresh, CalendarMonth } from "@mui/icons-material";
import {
  StackProps,
  Stack,
  LinearProgress,
  IconButton,
  Skeleton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useScriptType } from "../Providers/ScriptTypeProvider";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { startTransition, useState } from "react";
import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { AppControls } from "../shared/AppControls";

export function CalendarControls(props: StackProps & { isLoading?: boolean }) {
  // using local state to only show loading bar when user explicitly clicks reload
  const [refetching, setRefetching] = useState(false);
  const { refetch: refetchList } = useCalendarLists();
  const { refetch } = useCalendarEvents();

  const {
    data: { selectedCalendarId },
  } = useCalendarState();

  return (
    <AppControls
      reloading={refetching}
      settingsOpen={false}
      onSettingsClick={() => {}}
      onReloadClick={() => {
        setRefetching(true);
        refetchList()
          .then(() => {
            refetch().finally(() => {
              setRefetching(false);
            });
          })
          .finally(() => {
            setRefetching(false);
          });
        // .then(() => {
        //   startTransition(() => {
        //     setRefetching(false);
        //   });
        // });
      }}
    >
      <DateControl isLoading={props.isLoading && !selectedCalendarId} pl={1} />
    </AppControls>
  );
}

export function DateControl(props: StackProps & { isLoading?: boolean }) {
  return (
    <Stack direction="row" alignItems={"center"} {...props}>
      {/* <IconButton size="small">
          <ArrowBackIosNewIcon />
        </IconButton> */}
      <CalendarMonth fontSize="small" color="action" sx={{ mr: 0.75 }} />
      {props.isLoading ? (
        <Skeleton width={100} variant="text" />
      ) : (
        <Typography>{dayjs().format("MMM D, YYYY")}</Typography>
      )}
      {/* <IconButton size="small">
          <ArrowForwardIos />
        </IconButton> */}
    </Stack>
  );
}
