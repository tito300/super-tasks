import { assertApps } from "./appsConfig";

export type TabName = "tasks" | "calendar" | "chatGpt" | "add";

// values in here should only be treated as defaults
export const userSettingsDefaults = {
  currentTab: "tasks" as TabName,
  syncCurrentTab: true,
  darkMode: false,
  syncDarkMode: true,
  buttonExpanded: false,
  syncButtonExpanded: true,
  accordionExpanded: false,
  syncAccordionExpanded: false,
  blurText: false,
  syncBlurText: true,
  syncWindowNotifications: true,
  windowNotifications: true,
  syncSelectedTaskListId: true,
  syncPosition: true,
  syncSelectedApps: true,
  selectedApps: {
    gTasks: false,
    gCalendar: false,
    chatGpt: false,
  },
  syncTokens: true,
  tokens: {
    google: "",
  },
};

assertApps(userSettingsDefaults.selectedApps);

insureSyncIsDefined(userSettingsDefaults, "userSettingsDefaults");

export const tasksSettingsDefaults = {
  selectedTaskListId: "",
  syncSelectedTaskListId: true,
  defaultTaskListId: "",
  syncDefaultTaskListId: true,
  filters: {
    today: true,
    pastDue: true,
    upcoming: false,
    search: "",
    sort: "",
  },
  syncFilters: true,
};
insureSyncIsDefined(tasksSettingsDefaults, "tasksSettingsDefaults");

export const chatGptSettingsDefaults = {
  syncMessages: true,
  syncComposerDraft: true,
  syncPending: true,
  syncModel: true,
};

insureSyncIsDefined(chatGptSettingsDefaults, "chatGptSettingsDefaults");

export const calendarSettingsDefaults = {
  // used to determine when to start showing the count down badge
  badgeCountDownMinutes: 30,
};

export type UserSettings = typeof userSettingsDefaults;
export type TasksSettings = typeof tasksSettingsDefaults;
export type CalendarSettings = typeof calendarSettingsDefaults;

function insureSyncIsDefined(obj: any, name: string) {
  for (const key in obj) {
    if (!key.startsWith("sync")) {
      if (
        obj[`sync${key.charAt(0).toUpperCase()}${key.slice(1)}`] === undefined
      ) {
        throw new Error(
          `sync${key.charAt(0).toUpperCase()}${key.slice(
            1
          )} is not defined on ${name}`
        );
      }
    }
  }
}
