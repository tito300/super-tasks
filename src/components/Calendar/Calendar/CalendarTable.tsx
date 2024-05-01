import { styled } from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import { Meeting } from "./Meeting";
import { SavedCalendarEvent } from "@src/calendar.types";
import { RRule, rrulestr } from "rrule";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function CalendarTable({
  calendarEvents,
}: {
  calendarEvents: SavedCalendarEvent[];
}) {
  const [tableEl, setTableEl] = useState<HTMLDivElement | null>(null);

  const filteredEvents = useMemo(
    () =>
      calendarEvents.filter((event) => {
        if (event.eventType !== "default") return false;
        if (event.recurrence?.length) {
          const response = isRecurringToday(
            event.start.dateTime || event.start.date,
            event.start.timeZone,
            event.recurrence[0]
          );
          console.log("isRecurringToday ", response);
          return response;
        }
        return true;
      }),
    [calendarEvents]
  );

  return (
    <Table ref={(el) => setTableEl(el)} id="calendar">
      <DayColumn sx={{ width: 52 }}></DayColumn>
      <DayColumn className="column">
        {filteredEvents.map((event) => (
          <Meeting event={event}></Meeting>
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

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }, 1000);
  }, []);

  const top = hours * 60 + minutes;

  useEffect(() => {
    if (!currentTimeRef.current) return;

    currentTimeRef.current.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  }, [hours]);

  return (
    <CurrentTimeStyled
      ref={currentTimeRef}
      id="current-time-indicator"
      style={{ top: `${top}px` }}
    ></CurrentTimeStyled>
  );
}

/**
 * Checks if a recurring event with a given start dateTime and RFC 5545 recurrence rule
 * occurs on the current date.
 */
function isRecurringToday(
  startDateTime: string,
  timeZone: string | null,
  inRule?: string
) {
  if (!inRule) return false;
  // Parse the start date time
  const startDate = timeZone
    ? dayjs(startDateTime).tz(timeZone).local()
    : dayjs(startDateTime).local();
  // Set up the rule
  // const rule = rrulestr(
  //   `DTSTART:${startDate.format("YYYYMMDDTHHmmss")}Z\n${inRule}`,
  //   {
  //     dtstart: startDate.toDate(),
  //   }
  // );
  const rule = new RRule({
    ...RRule.fromString(inRule.replace("EXDATE;", "")),
    dtstart: startDate.toDate(),
    freq: RRule.DAILY,
  });

  // Get today's date range
  const now = dayjs();
  const startOfDay = now.startOf("day").toDate();
  const endOfDay = now.endOf("day").toDate();

  // Get occurrences within today's date range
  const occurrences = rule.between(startOfDay, endOfDay);

  // Return true if there is at least one occurrence today
  return occurrences.length > 0;
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
