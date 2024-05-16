import { LinearProgress, styled } from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import { Meeting } from "./Meeting";
import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import { RRule, rrulestr, datetime } from "rrule";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isToday from "dayjs/plugin/isToday";
import { truncate } from "fs/promises";
import {
  flattenTodaysEvents,
  getTodaysOccurrences,
  isRecurringToday,
  sortCalendarEvents,
} from "@src/utils/calendarUtils";
import { useUserState } from "@src/components/Providers/UserStateProvider";
import { useRootElement } from "@src/hooks/useRootElement";
import { constants } from "@src/config/constants";

dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(timezone);

export function CalendarTable({
  calendarEvents,
  isLoading,
}: {
  calendarEvents: SavedCalendarEvent[];
  isLoading?: boolean;
}) {
  const [tableEl, setTableEl] = useState<HTMLDivElement | null>(null);

  const filteredEvents = useMemo(
    () => sortCalendarEvents(calendarEvents),
    [calendarEvents]
  );

  return (
    <Table ref={(el) => setTableEl(el)} id="calendar">
      <DayColumn sx={{ width: 52 }}></DayColumn>
      <DayColumn className="column">
        {filteredEvents.map((event) => (
          <Meeting key={event.id} event={event}></Meeting>
        ))}
        <CurrentTime tableEl={tableEl} />
      </DayColumn>
      {Array.from(Array(24)).map((line, index) => {
        const top = (index + 1) * 60;
        return (
          <HorizontalLine style={{ top: `${top}px` }} data-hour={index + 1}>
            <CellHour className="cell-time">{convertHours(index + 1)}</CellHour>
          </HorizontalLine>
        );
      })}
    </Table>
  );
}

function CurrentTime({ tableEl }: { tableEl: HTMLDivElement | null }) {
  const [hours, setHours] = useState(() => new Date().getHours());
  const [minutes, setMinutes] = useState(() => new Date().getMinutes());
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const {
    data: { accordionExpanded, buttonExpanded, currentTab },
  } = useUserState();
  const rootEl = useRootElement();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }, 1000);
  }, []);

  const top = hours * 60 + minutes;

  useEffect(() => {
    if (!accordionExpanded || !buttonExpanded || currentTab !== "calendar")
      return;

    const scrollableEl = rootEl.querySelector<HTMLDivElement>(
      `#${constants.EXTENSION_NAME}-scrollable-container`
    );
    const currentTimeEl = currentTimeRef.current;

    if (!scrollableEl || !currentTimeEl) return;

    // Calculate the offset of the target element relative to the scrollable div
    const offsetTop = currentTimeEl!.offsetTop - scrollableEl.offsetTop;
    scrollableEl.scrollTop = offsetTop - 100;
  }, [hours, accordionExpanded, buttonExpanded, currentTab]);

  return (
    <CurrentTimeStyled
      ref={currentTimeRef}
      id="current-time-indicator"
      style={{ top: `${top}px` }}
    ></CurrentTimeStyled>
  );
}

const Table = styled("div")`
  position: relative;
  width: fit-content;
  background-color: white;
  display: flex;
  margin: 0 auto;
`;

const DayColumn = styled("div")`
  position: relative;
  width: 280px;
  height: 1440px;
  border-right: 1px solid rgb(218, 220, 224);
  z-index: 10;
`;

const HorizontalLine = styled("div")`
  position: absolute;
  border-bottom: 1px solid rgb(218, 220, 224);
  width: 100%;
`;

const CellHour = styled("div")`
  position: absolute;
  display: block;
  top: -6px;
  background-color: white;
  width: fit-content;
  padding: 0 6px;
  font-size: 12px;
  color: rgb(163, 163, 163);
`;

const CurrentTimeStyled = styled("div")`
  border-bottom: 2px solid red;
  position: absolute;
  z-index: 10000;
  width: 100%;
  ::before {
    content: "";
    position: absolute;
    left: -6px;
    top: -5px;
    width: 12px;
    height: 12px;
    background-color: red;
    border-radius: 50%;
  }
`;

function convertHours(hours: number) {
  return hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
}
