import { fetcher } from "../fetcher";
import { urls } from "@src/config/urls";
// import { CalendarEventsGlobalState } from "@src/components/Providers/CalendarEventsGlobalStateProvider";
import { deepmerge } from "@mui/utils";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import {
  CalendarSettings,
  calendarSettingsDefaults,
} from "@src/config/settingsDefaults";
import {
  CalendarEvent,
  ListCalendar,
  NewCalendarEvent,
  SavedCalendarEvent,
} from "@src/calendar.types";
import { DeepPartial } from "react-hook-form";
import { createMockCalendarEvent } from "./calendar.mock";
import { storageService } from "@src/storage/storage.service";

export type ServiceMethodName = keyof typeof calendarServices;

/**
 * only use services from within api hooks
 */
export const calendarServices = {
  // updateCalendarEventsState: async (newState: Partial<CalendarEventsGlobalState>) => {
  //   chrome.storage.local.get("calendarState").then((data) => {
  //     chrome.storage.local.set({
  //       calendarState: { ...data?.calendarState, ...newState },
  //     });
  //   });
  // },
  // getCalendarEventsState: async () => {
  //   return chrome.storage.local.get("calendarState").then((data) => {
  //     return (data.calendarState || {}) as CalendarEventsGlobalState;
  //   });
  // },
  getCalendarEvents: async (listId: string) => {
    const calendarEvents = await fetcher
      .get(`${urls.BASE_URL}/calendars/${listId}/events`)
      .then((res) => res.json())
      .then((res) => {
        return (res?.data?.items || []) as SavedCalendarEvent[];
      });
    // calendarEvents.forEach((calendarEvent) => {
    //   calendarEvent.listId = listId;
    // });
    // return CalendarEventServices.mergeWithLocalState(calendarEvents);
    // const calendarEvents = [
    //   createMockCalendarEvent({
    //     summary: "1:1 John Doe",
    //     id: "13",
    //     start: { dateTime: "2022-01-01T 14:00:00" },
    //     end: { dateTime: "2022-01-01T15:00:00" },
    //   }),
    //   createMockCalendarEvent({
    //     summary: "All Hands meeting",
    //     id: "14",
    //     start: { dateTime: "2022-01-01T11:00:00" },
    //     end: { dateTime: "2022-01-01T11:30:00" },
    //   }),
    // ] as SavedCalendarEvent[];

    return calendarEvents;
  },
  getCalendars: async () => {
    return fetcher
      .get(`${urls.BASE_URL}/calendars`)
      .then((res) => res.json())
      .then((res) => {
        return (res || []) as ListCalendar[];
      });
  },
  addCalendarEvent: async (
    listId: string,
    calendarEvent: SavedCalendarEvent,
    previousCalendarEventId?: string | null
  ) => {
    return fetcher
      .post(
        `${urls.BASE_URL}/calendar/${listId}/events?previous=${
          previousCalendarEventId ?? ""
        }`,
        calendarEvent
      )
      .then((res) => res.json())
      .then((res) => {
        return res as SavedCalendarEvent;
      });
  },
  updateCalendarEvent: async (
    listId: string,
    calendarEvent: SavedCalendarEvent
  ) => {
    // CalendarEventServices.updateLocalCalendarEventState(calendarEvent);
    return fetcher
      .post(
        `${urls.BASE_URL}/calendar/${listId}/events/${calendarEvent.id}`,
        calendarEvent
      )
      .then((res) => res.json())
      .then((res) => {
        return res as SavedCalendarEvent;
      });
  },
  moveCalendarEvent: async (
    listId: string,
    calendarEventId: string,
    previousCalendarEventId?: string | null
  ) => {
    return fetcher
      .post(
        `${urls.BASE_URL}/calendar/${listId}/events/${calendarEventId}/move`,
        {
          previousCalendarEventId,
        }
      )
      .then((res) => res.json())
      .then((res) => {
        return res as SavedCalendarEvent;
      });
  },
  deleteCalendarEvent: async (listId: string, calendarEventId: string) => {
    return fetcher.delete(
      `${urls.BASE_URL}/calendar/${listId}/events/${calendarEventId}`
    );
  },
  // mergeWithLocalState: async (calendarEvents: SavedCalendarEvent[]) => {
  //   const localCalendarEventsState = await CalendarEventServices.getCalendarEventsState();
  //   const localCalendarEvents = localCalendarEventsState.calendarEvents || {};

  //   const mergedCalendarEvents = calendarEvents.map((calendarEvent) => {
  //     const enhancedProperties: CalendarEventEnhanced = filterEnhancedProperties(
  //       (localCalendarEvents[calendarEvent.id] || {}) as CalendarEventEnhanced
  //     );
  //     return deepmerge(calendarEvent, enhancedProperties);
  //   });

  //   return mergedCalendarEvents;
  // },
  // updateLocalCalendarEventState: async (calendarEvent: Partial<CalendarEventType> & { id: string }) => {
  //   chrome.storage.local.get("calendarState", (inData) => {
  //     const data = inData as { calendarState: any }; // todo: fix this
  //     const calendarState = data.calendarState || {};

  //     const updatedCalendarEventsState = deepmerge(calendarState, {
  //       calendarEvents: {
  //         [calendarEvent.id!]: filterEnhancedProperties(calendarEvent),
  //       },
  //     });
  //     chrome.storage.local.set({ calendarState: updatedCalendarEventsState });
  //   });
  // },
  async getCalendarSettings() {
    const settings = await storageService.get("calendarSettings");
    if (!settings)
      calendarServices.updateCalendarSettings(calendarSettingsDefaults);
    return { ...calendarSettingsDefaults, ...settings };
  },
  async updateCalendarSettings(settings: CalendarSettings) {
    // for now, just store settings in local storage until we have user endpoints
    return storageService.set({
      calendarSettings: { ...calendarSettingsDefaults, ...settings },
    });
  },
};

// function filterEnhancedProperties(
//   calendarEvent: SavedCalendarEvent | CalendarEventEnhanced | CalendarEventType
// ): Record<Exclude<keyof CalendarEventEnhanced, "id">, any> {
//   const { alert, alertOn, alertSeen, listId, id } = calendarEvent;
//   return { alert, alertOn, alertSeen, listId };
// }
