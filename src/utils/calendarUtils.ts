// take recurring and single events and converts them to single events removing

import { CalendarEvent, SavedCalendarEvent } from "@src/calendar.types";
import dayjs from "dayjs";
import { rrulestr } from "rrule";

// cancelled events.
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
      acc[event.recurringEventId] = event.start.dateTime;
    }
    return acc;
  }, {} as Record<string, string>);

  calendarEvents.forEach((event) => {
    if (event.eventType !== "default") return;
    if (event.status === "cancelled") return;
    if (event.recurrence?.length) {
      if (
        cancelledEvents[event.id] &&
        dayjs(cancelledEvents[event.id]).isToday()
      )
        return;
      if (modifiedEvents[event.id] && dayjs(modifiedEvents[event.id]).isToday())
        return;

      const todaysOccurrence = getTodaysOccurrences(event);
      todaysOccurrence.forEach((occurrence) => {
        flatEvents.push({
          ...event,
          start: { ...event.start, dateTime: occurrence.toISOString() },
        });
      });
    } else if (dayjs(event.start.dateTime || event.start.date).isToday()) {
      flatEvents.push(event);
    }
  });

  return flatEvents;
}

export function sortCalendarEvents(calendarEvents: SavedCalendarEvent[]) {
  const sortedEvents = flattenTodaysEvents(calendarEvents).sort((a, b) => {
    const aStart = a.start.dateTime || a.start.date;
    const bStart = b.start.dateTime || b.start.date;

    return dayjs(aStart).diff(dayjs(bStart));
  });

  return sortedEvents;
}

export function filterFutureEvents(calendarEvents: SavedCalendarEvent[]) {
  return calendarEvents.filter((event) => {
    const start = event.start.dateTime || event.start.date;
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

  const startDate = dayjs(event.start.dateTime || event.start.date);

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
