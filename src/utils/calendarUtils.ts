// take recurring and single events and converts them to single events removing

import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";
import { rrulestr } from "rrule";
import utc from "dayjs/plugin/utc";
import timeZone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timeZone);

// [main recurring events]
// [modified recurring events]
// [modified recurring exceptions]
// [single events]

function isSingleEvent(event: SavedCalendarEvent) {
  return (
    !event.recurringEventId && !event.originalStartTime && !event.recurrence
  );
}

function findSingleEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter(isSingleEvent);
}

function isRecurringEvent(event: SavedCalendarEvent) {
  return (
    !!event.recurrence && !event.recurringEventId && !event.id.includes("_")
  );
}
function findRecurringEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter(isRecurringEvent);
}
function isModifiedRecurringEvent(event: SavedCalendarEvent) {
  return (
    event.id.includes("_") && !event.recurringEventId && !!event.recurrence
  );
}
function isRecurringEventException(event: SavedCalendarEvent) {
  return !!event.recurringEventId;
}

function getLastModifiedRecurringEvent(
  event: SavedCalendarEvent,
  calendarEvents: SavedCalendarEvent[]
) {
  const modifiedEvents = calendarEvents.filter((e) => {
    return isModifiedRecurringEvent(e) && e.id.split("_")[0] === event.id;
  });

  if (!modifiedEvents.length) return event;

  // sort by modification date and return the last one
  const lastModified = modifiedEvents.sort((a, b) => {
    // date string example: 20220301T000000Z
    return dayjs(b.id.split("_")[1], "YYYYMMDDThhmmss").diff(
      dayjs(a.id.split("_")[1], "YYYYMMDDThhmmss")
    );
  })[0];

  return lastModified;
}

function findEventTodaysException(
  event: SavedCalendarEvent,
  calendarEvents: SavedCalendarEvent[]
) {
  return calendarEvents.find((e) => {
    return (
      isRecurringEventException(e) &&
      e.recurringEventId === event.id &&
      getEventStartTime(e)?.isToday()
    );
  });
}

function validDisplayEvent(event: SavedCalendarEvent) {
  return event.status !== "cancelled" && event.eventType === "default";
}

// Any exceptions to the recurring events are provided as separate events
// There are two types of changes:
//   1- recurring event change: change that affects all future occurrences
//   2- single event change: change that affects only one occurrence
// event level changes are identified by the presence of recurringEventId
// while the single event changes are identified by by it's absence
// in either cases the modified events are distinguished from  main event
// by appending "<id>_<timeofmodification>" to id. example: "123456_20220301T000000Z"
export function flattenTodaysEvents(calendarEvents: SavedCalendarEvent[]) {
  const flatEvents: SavedCalendarEvent[] = [];
  const singleEvents = findSingleEvents(calendarEvents);
  const recurringModifiedEvents = findRecurringEvents(calendarEvents).map(
    (event) => {
      return getLastModifiedRecurringEvent(event, calendarEvents);
    }
  );
  const recurringExceptions = calendarEvents.filter(isRecurringEventException);

  singleEvents.forEach((event) => {
    if (!validDisplayEvent(event)) return;
    if (getEventStartTime(event)?.isToday()) flatEvents.push(event);
  });

  recurringModifiedEvents.forEach((event) => {
    if (!validDisplayEvent(event)) return;
    const todaysException = findEventTodaysException(
      event,
      recurringExceptions
    );

    if (todaysException && validDisplayEvent(todaysException)) {
      flatEvents.push(todaysException);
    } else {
      const todaysOccurrence = getTodaysOccurrences(event);
      todaysOccurrence.forEach((occurrence) => {
        // event = {
        //   ...event,
        //   start: { ...event.start, dateTime: occurrence.toISOString() },
        // };

        flatEvents.push(event);
      });
    }
  });

  return flatEvents;
}

function getTodaysCancelledEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.reduce((acc, event) => {
    if (event.status === "cancelled") {
      acc[event.recurringEventId] =
        event.start?.dateTime ||
        event.start?.date ||
        event.originalStartTime?.dateTime ||
        event.originalStartTime?.date;
    }
    return acc;
  }, {} as Record<string, string>);
}

export function getTodaysEvents(calendarEvents: SavedCalendarEvent[]) {
  const sortedEvents = flattenTodaysEvents(calendarEvents).sort((a, b) => {
    const aStart = getEventStartTime(a);
    const bStart = getEventStartTime(b);

    return aStart ? aStart.diff(bStart) : 0;
  });

  return sortedEvents;
}

export function stackEvents(calendarEvents: SavedCalendarEvent[]) {
  const reservedMinutes: Array<Array<SavedCalendarEvent | null>> = Array.from({
    length: 1440,
  })
    .fill(null)
    .map(() => [...Array.from({ length: 5 }).fill(null)]) as Array<[]>;

  calendarEvents.forEach(stackEvent);

  function stackEvent(event: SavedCalendarEvent) {
    const startHour = getEventStartTime(event)?.hour();
    const startMinute = getEventStartTime(event)?.minute();
    const endHour = getEventEndTime(event)?.hour();
    const endMinute = getEventEndTime(event)?.minute();

    if (!startHour) return;

    const startMinuteIndex = startHour * 60 + startMinute!;
    const endMinuteIndex = endHour ? endHour * 60 + (endMinute || 0) : 0;

    let order = 1;

    for (let i = startMinuteIndex; i < endMinuteIndex; i++) {
      for (let j = 0; j < reservedMinutes[i].length; j++) {
        if (reservedMinutes[i][j] === null) {
          if (i === startMinuteIndex) {
            order = j + 1;
            reservedMinutes[i][j] = event;
            for (let k = 0; k < reservedMinutes[i].length; k++) {
              if (!reservedMinutes[i][k]) break;
              reservedMinutes[i][k]!.totalStackedEvents = reservedMinutes[
                i
              ].filter((e) => e).length;
            }
          } else {
            reservedMinutes[i][order - 1] = event;
          }
          break;
        }
      }
    }

    event.reservationCount = order;
  }
}

export function filterFutureEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter((event) => {
    const start = getEventStartTime(event);
    return start?.isAfter(dayjs());
  });
}

/**
 * Checks if a recurring event with a given start dateTime and RFC 5545 recurrence rule
 * occurs on the current date.
 */
export function isRecurringToday(event: CalendarEvent) {
  if (!event) return false;
  if (!event.recurrence?.length) return false;

  const occurrences = getTodaysOccurrences(event);

  return occurrences.length > 0;
}

export function getRRule(event: CalendarEvent) {
  if (!event.recurrence?.length) return null;

  const startDate = getEventStartTime(event);

  // Set up the rule
  return rrulestr(event.recurrence[0], {
    dtstart: startDate?.toDate(),
    tzid: event.start.dateTime?.includes("Z")
      ? event.start.timeZone
      : undefined,
  });
}

export function getTodaysOccurrences(event: CalendarEvent) {
  const rule = getRRule(event);

  if (!rule) return [];

  const now = dayjs();
  const startOfDay = now.startOf("day").toDate();
  const endOfDay = now.endOf("day").toDate();

  return rule.between(startOfDay, endOfDay);
}

export function getEventStartTime(event: CalendarEvent) {
  const start = event.start?.dateTime;

  // google calendar times are weird. Sometimes they are in utc
  // and sometimes they are in the event's timezone
  if (start?.includes("Z") && event.start.timeZone !== "UTC") {
    return dayjs(start).tz(event.start.timeZone);
  } else if (start) {
    // const startTime = dayjs.tz(start, event.start.timeZone);
    return dayjs(start);
  }

  const original = event.originalStartTime?.dateTime;

  if (original?.includes("Z")) {
    return dayjs(original).tz(event.originalStartTime?.timeZone);
  } else if (original) {
    return dayjs(original);
  }
}

export function getEventEndTime(event: CalendarEvent) {
  const end = event.end?.dateTime || event.end?.date;

  if (end) {
    if (end.includes("Z")) {
      return dayjs(end).tz(event.end.timeZone);
    } else {
      return dayjs(end);
    }
  }
}

// takes a modified event with sequence number and checks if the original event today's recurrence
// matches the modified event's recurrence number
function isMatchingTodaysOccurrence(
  event: SavedCalendarEvent,
  modifiedEvent: SavedCalendarEvent
) {
  const rule = getRRule(event);

  if (!rule) return false;

  const occurrences = rule.between(
    dayjs().subtract(5, "years").toDate(),
    dayjs().endOf("day").toDate()
  );
  const todaysRecurrenceCount = occurrences.length;

  return todaysRecurrenceCount === modifiedEvent.sequence;
}
