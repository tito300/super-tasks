export type Tab = "tasks" | "calendar";

export const userSettingsDefaults = {
  currentTab: "tasks" as Tab,
  darkMode: false,
  buttonExpanded: false,
  syncButtonExpanded: false,
  accordionExpanded: true,
  syncAccordionExpanded: false,
  blurText: false,
  syncBlurText: true,
  windowNotifications: true,
};

export const tasksSettingsDefaults = {
  blurText: false,
  persistPosition: false,
  tasksFilters: {
    today: true,
    pastDue: true,
    upcoming: false,
  },
};

export const calendarSettingsDefaults = {
  blurText: false,
  persistPosition: false,
  // used to determine when to start showing the count down badge
  badgeCountDownMinutes: 30,
  calendarFilters: {
    today: true,
    pastDue: true,
    upcoming: false,
  },
};

export type UserSettings = typeof userSettingsDefaults;
export type TasksSettings = typeof tasksSettingsDefaults;
export type CalendarSettings = typeof calendarSettingsDefaults;
