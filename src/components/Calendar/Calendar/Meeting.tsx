import {
  CheckCircle,
  CheckCircleOutline,
  Close,
  CloseOutlined,
  Help,
  LocationCity,
  PeopleAltOutlined,
  Subject,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  dialogClasses,
  styled,
  tooltipClasses,
} from "@mui/material";
import { CalendarEvent } from "@src/calendar.types";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { getEventEndTime, getEventStartTime } from "@src/utils/calendarUtils";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";

export const MeetingStyled = styled(Stack, {
  shouldForwardProp: (prop) =>
    ![
      "allDay",
      "reservedCount",
      "responseStatus",
      "totalStackedEvents",
    ].includes(prop.toString()),
})<{
  reservedCount?: number;
  totalStackedEvents?: number;
  allDay?: boolean;
  responseStatus?: CalendarEvent["attendees"][number]["responseStatus"];
}>(({ theme, reservedCount, totalStackedEvents, responseStatus, allDay }) => {
  const stackOrder = reservedCount || 1;
  const totalStacked = totalStackedEvents || 1;

  const positions = getMeetingPositions(stackOrder, totalStacked);
  const accepted = responseStatus === "accepted";
  const maybe = responseStatus === "tentative";
  const declined = responseStatus === "declined";
  const needsAction = responseStatus === "needsAction";

  return {
    position: allDay ? "relative" : "absolute",
    left: positions.left,
    right: positions.right,
    textDecoration: declined ? "line-through" : "none",
    border: `1px solid ${
      needsAction || declined || maybe
        ? theme.palette.primary.main
        : theme.palette.primary.contrastText
    }`,
    backgroundColor: needsAction
      ? theme.palette.background.paper
      : declined || maybe
      ? "transparent"
      : theme.palette.primary.main,
    color:
      needsAction || declined || maybe
        ? theme.palette.primary.main
        : theme.palette.primary.contrastText,
    padding: theme.spacing(0.5, 1),
    borderRadius: 4,
    overflow: "hidden",
    boxSizing: "border-box",
    cursor: "pointer",
    zIndex: (reservedCount || 1) * 2,
  };
});

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 100,
  },
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  [`& .${dialogClasses.paper}`]: {
    minWidth: 340,
    margin: theme.spacing(2),
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export function Meeting({ event }: { event: CalendarEvent }) {
  const startHour = getEventStartTime(event)?.hour();
  const startMinute = getEventStartTime(event)?.minute();

  const {
    data: { blurText },
  } = useUserState();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { top, height } = useMemo(() => {
    if (event.allDay) return { top: 0, height: 20 };
    if (!startHour) return { top: 0, height: 30 };

    const top = startHour * 60 + startMinute!;

    const endHour = dayjs(event.end.dateTime).hour() || 24;
    const endMinute = dayjs(event.end.dateTime).minute();

    const bottom = endHour * 60 + endMinute!;

    const height = bottom - top;

    return { top, height };
  }, [event.end.dateTime, startHour, startMinute]);

  const attendeesCounts = useMemo(
    () => ({
      acceptedAttendees:
        event.attendees?.filter((a) => a.responseStatus === "accepted")
          .length || 0,
      declinedAttendees:
        event.attendees?.filter((a) => a.responseStatus === "declined")
          .length || 0,
      maybeAttendees:
        event.attendees?.filter((a) => a.responseStatus === "tentative")
          .length || 0,
      awaitingAttendees:
        event.attendees?.filter((a) => a.responseStatus === "needsAction")
          .length || 0,
    }),
    [event.attendees]
  );

  const responseStatus = useMemo(
    () => event.attendees?.find((a) => a.self)?.responseStatus,
    [event]
  );

  return (
    <>
      <CustomWidthTooltip title={event.summary} placement="top">
        <MeetingStyled
          allDay={event.allDay}
          reservedCount={event.reservationCount}
          totalStackedEvents={event.totalStackedEvents}
          responseStatus={responseStatus}
          sx={{ top: top, height: height, maxHeight: height }}
          onClick={handleClick}
        >
          <Typography
            variant="body2"
            sx={{ filter: blurText ? "blur(5px)" : "none" }}
            whiteSpace="nowrap"
            lineHeight={event.allDay ? 0.8 : undefined}
            fontSize={event.allDay ? 12 : undefined}
          >
            {event.summary}
          </Typography>
          {height >= 40 && (
            <Typography
              fontSize={12}
              sx={{ filter: blurText ? "blur(5px)" : "none" }}
            >
              {event.allDay
                ? dayjs(event.start.date).format("ddd, MMM D")
                : getEventStartTime(event)!.format("H:mm")}{" "}
              - {getEventEndTime(event)?.format("H:mma")}
            </Typography>
          )}
        </MeetingStyled>
      </CustomWidthTooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack p={0.5} pb={2} width={345}>
          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={0.5}
          ></Stack> */}
          <Stack direction="row" alignItems="flex-start" p={0.5} pl={1.5}>
            <Box
              borderRadius={1}
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                width: 16,
                height: 14,
                mt: 1,
                mx: 0.5,
              }}
            ></Box>
            <Stack ml={1}>
              <Typography variant="h6" lineHeight={1.1}>
                {event.summary}
              </Typography>
              <Typography variant="body2">
                {" "}
                {dayjs(getEventStartTime(event)).format("dddd, MMM M")} -{" "}
                {dayjs(getEventStartTime(event)).format("H:mm")} -{" "}
                {dayjs(getEventEndTime(event)).format("H:mma")}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="flex-start" p={1} pl={1.5}>
            <PeopleAltOutlined color="action" fontSize="small" sx={{ mt: 1 }} />
            <Stack ml={1}>
              <Typography variant="body1">
                {event.attendees?.length || 0} guests
              </Typography>
              {event.attendees?.length && (
                <>
                  <Typography variant="body2" color="GrayText" mb={1}>
                    {attendeesCounts.acceptedAttendees
                      ? `${attendeesCounts.acceptedAttendees} yes,`
                      : ""}
                    {attendeesCounts.declinedAttendees
                      ? `${attendeesCounts.declinedAttendees} no,`
                      : ""}
                    {attendeesCounts.maybeAttendees
                      ? `${attendeesCounts.maybeAttendees} maybe,`
                      : ""}
                    {attendeesCounts.awaitingAttendees
                      ? `${attendeesCounts.awaitingAttendees} awaiting`
                      : ""}
                  </Typography>
                  <Stack gap={0.5}>
                    {event.attendees.map((attendee) => (
                      <Stack direction={"row"} alignItems={"center"} gap={0.5}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            attendee.responseStatus === "accepted" ? (
                              <CheckCircle
                                color="success"
                                sx={{ fontSize: 18 }}
                              />
                            ) : attendee.responseStatus === "tentative" ? (
                              <Help color="action" sx={{ fontSize: 18 }} />
                            ) : attendee.responseStatus === "declined" ? (
                              <CloseOutlined
                                color="error"
                                sx={{ fontSize: 18 }}
                              />
                            ) : undefined
                          }
                        >
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {attendee.email.charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                        <Stack ml={0.5}>
                          <Typography key={attendee.email} variant="body2">
                            {attendee.displayName || attendee.email}
                          </Typography>
                          {attendee.organizer && (
                            <Typography variant="caption" color="GrayText">
                              Organizer
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
          {event.location && (
            <Stack direction="row" alignItems="flex-start" p={0.5} pl={1.5}>
              <LocationCity fontSize="small" color="action" sx={{ mt: 1 }} />
              <Stack ml={1}>
                {event.location.includes("http") ? (
                  <Button
                    href={event.location}
                    size="small"
                    target="_blank"
                    variant="text"
                    LinkComponent={"a"}
                  >
                    {event.location}
                  </Button>
                ) : (
                  <Typography variant="body2">{event.location}</Typography>
                )}
              </Stack>
            </Stack>
          )}
          {event.description && (
            <Stack direction="row" alignItems="flex-start" p={0.5} pl={1.5}>
              <Subject fontSize="small" color="action" sx={{ mt: 1 }} />
              <Stack ml={1}>
                <Box
                  sx={{ color: (theme) => theme.palette.action.active }}
                  dangerouslySetInnerHTML={{ __html: event.description }}
                ></Box>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Popover>
    </>
  );
}

function getMeetingPositions(stackOrder: number, totalStacked: number) {
  const baseRight = 10;
  const increment = 100 / (totalStacked + 1);
  const left = `${(stackOrder - 1) * increment}%`;
  const right = `${baseRight + (totalStacked - stackOrder) * increment}%`;
  return { left, right };
}
