// take recurring and single events and converts them to single events removing

import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";
import { rrulestr } from "rrule";

export function flattenTodaysEvents(calendarEvents: SavedCalendarEvent[]) {
  const flatEvents: SavedCalendarEvent[] = [];

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

        flatEvents.push({
          ...event,
          start: { ...event.start, dateTime: occurrence.toISOString() },
        });
      });
    } else if (dayjs(getEventStartTime(event)).isToday()) {
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

  console.log("sortedEvents", sortedEvents);
  stackEvents(sortedEvents);
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
    const startHour = dayjs(getEventStartTime(event)).hour();
    const startMinute = dayjs(getEventStartTime(event)).minute();
    const endHour = dayjs(getEventEndTime(event)).hour();
    const endMinute = dayjs(getEventEndTime(event)).minute();

    const startMinuteIndex = startHour * 60 + startMinute;
    const endMinuteIndex = endHour * 60 + endMinute;

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
