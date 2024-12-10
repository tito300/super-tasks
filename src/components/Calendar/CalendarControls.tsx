import {
  Refresh,
  CalendarMonth,
  ChevronRight,
  ChevronLeft,
  UnfoldMore,
} from "@mui/icons-material";
import {
  StackProps,
  Stack,
  LinearProgress,
  IconButton,
  Skeleton,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useScriptType } from "../Providers/ScriptTypeProvider";
import { useCalendarState } from "../Providers/CalendarStateProvider";
import { startTransition, useState } from "react";
import { useCalendarEvents, useCalendarLists } from "@src/api/calendar.api";
import { AppControls } from "../shared/AppControls";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";

export function CalendarControls(
  props: StackProps & {
    settingsOpen: boolean;
    isLoading?: boolean;
    onSettingsClick: () => void;
  }
) {
  // using local state to only show loading bar when user explicitly clicks reload
  const [refetching, setRefetching] = useState(false);
  const { refetch: refetchList } = useCalendarLists({ enabled: false });
  const { refetch, isLoading } = useCalendarEvents({ enabled: false });

  const {
    data: { selectedCalendarId },
  } = useCalendarState();

  return (
    <AppControls
      reloading={refetching || isLoading}
      settingsOpen={props.settingsOpen}
      onSettingsClick={() => props.onSettingsClick()}
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
  const [calendarListOpen, setCalendarListOpen] = useState(false);
  const {
    data: { selectedCalendarId },
    updateData,
  } = useCalendarState();
  const { data } = useCalendarLists();

  const handleCalendarChange = (event: any) => {
    updateData({
      selectedCalendarId: event.target.value,
    });
    setCalendarListOpen(false);
  };

  return (
    <Stack direction="row" alignItems={"center"} {...props}>
      <IconButton
        size="small"
        sx={{ mr: 0.25 }}
        onClick={() => setCalendarListOpen(!calendarListOpen)}
      >
        <UnfoldMore fontSize="small" color="action" />
        <CalendarMonth fontSize="small" color="action" />
      </IconButton>
      {calendarListOpen && (
        <FormControl variant="standard" sx={{ pl: 1, minWidth: 120 }}>
          <Select
            id="demo-simple-select-standard"
            disableUnderline
            defaultOpen={true}
            value={selectedCalendarId ?? ""}
            onChange={handleCalendarChange}
            onBlur={() => setCalendarListOpen(false)}
          >
            {data?.map((list, i) => {
              if (list.kind)
                return (
                  <MenuItem selected={i === 0} key={list.id} value={list.id}>
                    {list.summary}
                  </MenuItem>
                );
            })}
          </Select>
        </FormControl>
      )}
      {/* <IconButton size="small">
          <ArrowBackIosNewIcon />
        </IconButton> */}
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
