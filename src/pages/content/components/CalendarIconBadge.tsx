import { BadgeProps, Badge, styled } from "@mui/material";
import { useCalendarEvents } from "@src/api/calendar.api";
import { useEnhancedTasks } from "@src/api/task.api";
import { TaskEnhanced } from "@src/components/Task/Task";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNextEventTimer } from "./CalendarAccordionSummary";

export function CalendarIconBadge(props: BadgeProps) {
  const { nextEvent, timeToNextEvent } = useNextEventTimer();

  const minutesToNextEvent = timeToNextEvent?.asMinutes();

  const showBadge =
    !!nextEvent && !!minutesToNextEvent && minutesToNextEvent <= 30;

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
