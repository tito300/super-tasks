import { BadgeProps, Badge, styled } from "@mui/material";
import { useNextEventTimer } from "./CalendarAccordionSummary";
import { useCalendarSettings } from "@src/api/calendar.api";

export function CalendarIconBadge(props: BadgeProps) {
  const { nextEvent, timeToNextEvent } = useNextEventTimer();
  const { calendarSettings } = useCalendarSettings();

  const minutesToNextEvent = timeToNextEvent?.asMinutes();

  const showBadge =
    !!nextEvent &&
    !!minutesToNextEvent &&
    minutesToNextEvent > 0 &&
    minutesToNextEvent <= calendarSettings.badgeCountDownMinutes;

  return (
    <StyledBadge
      badgeContent={showBadge ? timeToNextEvent?.format("mm") : null}
      color="primary"
      {...props}
    />
  );
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 32,
    top: -12,
    padding: "0 4px",
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));
