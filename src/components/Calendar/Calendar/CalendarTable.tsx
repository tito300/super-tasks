import { duration, styled } from "@mui/material";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Meeting } from "./Meeting";
import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";

export function CalendarTable({
  calendarEvents,
}: {
  calendarEvents: SavedCalendarEvent[];
}) {
  const [tableEl, setTableEl] = useState<HTMLDivElement | null>(null);

  return (
    <Table ref={(el) => setTableEl(el)} id="calendar">
      <DayColumn sx={{ width: 52 }}></DayColumn>
      <DayColumn className="column">
        {calendarEvents.map((event) => (
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
  background-color: white;
  width: 280px;
  height: 1440px;
  border-right: 1px solid rgb(218, 220, 224);
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
