// take recurring and single events and converts them to single events removing

import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";
import { rrulestr } from "rrule";
import utc from "dayjs/plugin/utc";
import timeZone from "dayjs/plugin/timezone";
import {
  calendarEventsMock,
  flattenTodaysEventsResult,
} from "./calendarUtils.mock";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(timeZone);
dayjs.extend(isToday);

function isSingleEvent(event: SavedCalendarEvent) {
  return !event.recurringEventId && !event.recurrence;
}

function findSingleEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter(isSingleEvent);
}

function isRecurringEvent(event: SavedCalendarEvent) {
  return !!event.recurrence;
}
function findRecurringEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter(isRecurringEvent);
}

function isRecurringEventException(event: SavedCalendarEvent) {
  return !event.recurrence && event.recurringEventId;
}

function findMatchingEventException(
  recurringEvent: SavedCalendarEvent,
  calendarEvents: SavedCalendarEvent[]
) {
  return calendarEvents.find((currentEvent) => {
    if (currentEvent.recurringEventId !== recurringEvent.id) return false;

    return isRecurringEventException(currentEvent);
  });
}

function validDisplayEvent(event: SavedCalendarEvent) {
  return event.eventType === "default";
}

/** Any exceptions to the recurring events are provided as separate events
 * There are two types of changes:
 *   1- recurring event change: change that affects all future occurrences
 *   2- single event change: change that affects only one occurrence
 *
 * Recurring level changes are identified by the presence of "recurrence" rule and absence of recurringEventId
 * while the single event changes are identified by the absence of "recurrence" rule and presence of recurringEventId
 *
 * In either cases the modified events are distinguished from original event
 * by appending "<id>_<timeofmodification>" to id. example: "123456_20220301T000000Z"
 *
 * The timezone property on the event start and end fields represents the timezone of the time the event
 * was created.
 */
export function flattenTodaysEvents(calendarEvents: SavedCalendarEvent[]) {
  const flatEvents: SavedCalendarEvent[] = [];
  const cancelledEvents = calendarEvents.filter(
    (event) => event.status === "cancelled"
  );

  const validCalendarEvents = calendarEvents.filter(validDisplayEvent);
  const singleEvents = findSingleEvents(validCalendarEvents);
  const recurringEvents = findRecurringEvents(validCalendarEvents);
  const recurringExceptions = validCalendarEvents.filter(
    isRecurringEventException
  );

  singleEvents.forEach((event) => {
    if (getEventStartTime(event)?.isToday()) flatEvents.push(event);
  });

  recurringExceptions.forEach((event) => {
    if (getEventStartTime(event)?.isToday()) flatEvents.push(event);
  });

  recurringEvents.forEach((event) => {
    if (isRecurringEventCancelled(event, cancelledEvents, dayjs())) return;
    const todaysException = findMatchingEventException(
      event,
      recurringExceptions
    );

    if (todaysException) {
      return;
    } else {
      const todaysOccurrence = getTodaysOccurrences(event);
      todaysOccurrence.forEach((_occurrence) => {
        const occurrence = {
          ...event,
          start: {
            ...event.start,
            dateTime: _occurrence.start.toISOString(),
          },
          end: {
            ...event.end,
            dateTime: _occurrence.end.toISOString(),
          },
        };
        flatEvents.push(occurrence);
      });
    }
  });

  return flatEvents;
}
// todo: update mocks to always have today's date
// testFlattenTodaysEvents();

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

  return rule.between(startOfDay, endOfDay).map((date) => ({
    start: dayjs(event.start.dateTime)
      .set("date", dayjs().date())
      .set("month", dayjs().month()),
    end: dayjs(event.end.dateTime)
      .set("date", dayjs().date())
      .set("month", dayjs().month()),
  }));
}

export function getEventStartTime(
  event: CalendarEvent,
  { originalTime = false } = {}
) {
  if (originalTime) {
    const original = event.originalStartTime?.dateTime;

    if (!original) return;

    return dayjs(original);
  }

  const start = event.start?.dateTime;

  if (!start) return;

  return dayjs(start);
}

export function getEventEndTime(event: CalendarEvent) {
  const end = event.end?.dateTime || event.end?.date;

  if (end) {
    return dayjs(end);
  }
}

function isRecurringEventCancelled(
  event: SavedCalendarEvent,
  cancelledEvents: SavedCalendarEvent[],
  day: dayjs.Dayjs
) {
  const cancelledEvent = cancelledEvents.find((cancelledEvent) => {
    return cancelledEvent.recurringEventId === event.id;
  });

  if (!cancelledEvent) return false;

  const cancelledEventStartTime = getEventStartTime(cancelledEvent, {
    originalTime: true,
  });

  // compare two dayjs objects and if they are the same day return true
  return (
    cancelledEventStartTime?.isSame(day, "day") &&
    cancelledEventStartTime?.isSame(day, "week") &&
    cancelledEventStartTime?.isSame(day, "month")
  );
}

export function testFlattenTodaysEvents() {
  // @ts-ignore
  const result = flattenTodaysEvents(calendarEventsMock);

  deepCompareObj(result, flattenTodaysEventsResult);
}

function deepCompareObj(obj1: any, obj2: any) {
  for (const key in obj1) {
    if (typeof obj1[key] === "object") {
      deepCompareObj(obj1[key], obj2[key]);
    } else {
      if (obj1[key] !== obj2[key]) {
        throw new Error("Objects are not equal");
      }
    }
  }
}
