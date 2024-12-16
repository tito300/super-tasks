import { Sync } from "@mui/icons-material";
import { assertApps } from "./appsConfig";

export type TabName = "tasks" | "calendar" | "chatGpt" | "add";

// values in here should only be treated as defaults
export const userSettingsDefaults = {
  currentTab: "chatGpt" as TabName,
  defaultTab: "chatGpt" as TabName,
  popupOnly: false, // if true, the extension will only run in the popup
  syncPopupOnly: true,
  syncCurrentTab: true,
  darkMode: false,
  syncDarkMode: true,
  buttonExpanded: false,
  syncButtonExpanded: false,
  accordionExpanded: false,
  syncAccordionExpanded: false,
  blurText: false,
  syncBlurText: true,
  syncChromeId: true,
  syncEmail: true,
  syncSubscriptionType: true,
  syncWindowNotifications: true,
  windowNotifications: true,
  syncSelectedTaskListId: true,
  syncPosition: true,
  syncSelectedApps: true,
  syncAuthWarningDismissed: true,
  syncAuthWarningDismissedAt: true,
  useSidePanel: false,
  syncUseSidePanel: true,
  selectedApps: {
    gTasks: false,
    gCalendar: false,
    chatGpt: false,
  },
  syncTokens: true,
  tokens: {
    google: "",
    jwt: "",
  },
};

assertApps(userSettingsDefaults.selectedApps);

// insureSyncIsDefined(userSettingsDefaults, "userSettingsDefaults");

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
  disableTextSelectionTooltip: false,
  syncDisableTextSelectionTooltip: true,
  syncMessages: true,
  syncComposerDraft: true,
  syncPending: true,
  syncModel: true,
  syncAiOptions: true,
};

insureSyncIsDefined(chatGptSettingsDefaults, "chatGptSettingsDefaults");

export const calendarSettingsDefaults = {
  // used to determine when to start showing the count down badge
  badgeCountDownMinutes: 30,
  syncSelectedCalendarId: true,
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
