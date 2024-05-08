import { Refresh, CalendarMonth } from "@mui/icons-material";
import { StackProps, Stack, LinearProgress, IconButton, Skeleton, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useScriptType } from "../Providers/ScriptTypeProvider";
import { useCalendarState } from "../Providers/CalendarStateProvider";

export function CalendarControls(props: StackProps & { isLoading?: boolean }) {
    const queryClient = useQueryClient();
    const scriptType = useScriptType();
    const {
      data: { selectedCalendarId },
    } = useCalendarState();
  
    return (
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        {...props}
        sx={{
          position: "sticky",
          top: scriptType === "Popup" ? "30px" : 0,
          left: 0,
          right: 0,
          zIndex: 40,
          boxShadow: `0px 3px 5px -2px rgb(0 0 0 / 11%), 0px 3px 4px 0px rgb(0 0 0 / 0%), 0px 1px 8px 0px rgb(0 0 0 / 4%)`,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          ...(props.sx as {}),
        }}
      >
        <LinearProgress
          sx={{
            position: "absolute",
            bottom: -4,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            visibility: props.isLoading ? "visible" : "hidden",
          }}
        />
        <DateControl isLoading={props.isLoading && !selectedCalendarId} pl={1} />
        <IconButton
          size="small"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["calendar", selectedCalendarId],
            });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          }}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>
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