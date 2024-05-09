// take recurring and single events and converts them to single events removing

import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";
import { rrulestr } from "rrule";

// [
//   null,
//   [[null, null, []]],
//   [[null, null, [null, null, []]]],
//   null,
//   null
// ];

// [
//   {},
//   {},
//   {},
//   {},
//   {}
// ];

// cancelled events.
export function flattenTodaysEvents(calendarEvents: SavedCalendarEvent[]) {
  const flatEvents: SavedCalendarEvent[] = [];
  // const reservedSpots: Record<`${string}-${string}`, number> = {}

  const reservedMinutes: Array<Array<SavedCalendarEvent> | null> = Array.from({
    length: 1440,
  }).fill(null) as Array<null>;

  function reserveSpot(event: SavedCalendarEvent) {
    const startHour = dayjs(getEventStartTime(event)).hour();
    const startMinute = dayjs(getEventStartTime(event)).minute();
    const endHour = dayjs(getEventEndTime(event)).hour();
    const endMinute = dayjs(getEventEndTime(event)).minute();

    const startMinuteIndex = startHour * 60 + startMinute;
    const endMinuteIndex = endHour * 60 + endMinute;

    for (let i = startMinuteIndex; i < endMinuteIndex; i++) {
      if (!reservedMinutes[i]) {
        reservedMinutes[i] = [];
      }
      if (i === startMinuteIndex) {
        event.reservationCount = reservedMinutes[i]!.length;
        reservedMinutes[i]!.push(event);
      } else {
        // reservedMinutes[i][i];
      }
    }
  }

  const cancelledEvents = calendarEvents.reduce((acc, event) => {
    if (event.status === "cancelled") {
      acc[event.recurringEventId] =
        event.start?.dateTime ||
        event.start?.date ||
        event.originalStartTime?.dateTime ||
        event.originalStartTime?.date;
    }
    return acc;
  }, {} as Record<string, string>);

  const modifiedEvents = calendarEvents.reduce((acc, event) => {
    if (event.status === "confirmed" && event.recurringEventId) {
      acc[event.recurringEventId] = event;
    }
    return acc;
  }, {} as Record<string, SavedCalendarEvent>);

  calendarEvents.forEach((event) => {
    if (event.eventType !== "default") return;
    if (event.status === "cancelled") return;
    if (event.recurrence?.length) {
      if (
        cancelledEvents[event.id] &&
        dayjs(cancelledEvents[event.id]).isToday()
      )
        return;
      if (
        modifiedEvents[event.id] &&
        modifiedEvents[event.id].start?.dateTime &&
        dayjs(modifiedEvents[event.id].originalStartTime.dateTime).isToday()
      )
        return;

      const todaysOccurrence = getTodaysOccurrences(event);
      todaysOccurrence.forEach((occurrence) => {
        event = {
          ...event,
          start: { ...event.start, dateTime: occurrence.toISOString() },
        };

        reserveSpot(event);
        flatEvents.push({
          ...event,
          start: { ...event.start, dateTime: occurrence.toISOString() },
        });
      });
    } else if (dayjs(getEventStartTime(event)).isToday()) {
      reserveSpot(event);
      flatEvents.push(event);
    }
  });

  return flatEvents;
}

export function sortCalendarEvents(calendarEvents: SavedCalendarEvent[]) {
  const sortedEvents = flattenTodaysEvents(calendarEvents).sort((a, b) => {
    const aStart = getEventStartTime(a);
    const bStart = getEventStartTime(b);

    return dayjs(aStart).diff(dayjs(bStart));
  });

  return sortedEvents;
}

export function filterFutureEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter((event) => {
    const start = getEventStartTime(event);
    return dayjs(start).isAfter(dayjs());
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

  const startDate = dayjs(getEventStartTime(event));

  // Set up the rule
  return rrulestr(event.recurrence[0], {
    dtstart: startDate.toDate(),
    tzid: event.start.timeZone,
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
  return (
    event.start?.dateTime ||
    event.start?.date ||
    event.originalStartTime?.dateTime ||
    event.originalStartTime?.date
  );
}

export function getEventEndTime(event: CalendarEvent) {
  return event.end?.dateTime || event.end?.date;
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
