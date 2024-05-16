export type TabName = "tasks" | "calendar";

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
  windowNotifications: true,
  syncSelectedTaskListId: true,
  position: {
    x: 0,
    y: 0,
  },
  syncPosition: false,
};

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

export const calendarSettingsDefaults = {
  // used to determine when to start showing the count down badge
  badgeCountDownMinutes: 30,
};

export type UserSettings = typeof userSettingsDefaults;
export type TasksSettings = typeof tasksSettingsDefaults;
export type CalendarSettings = typeof calendarSettingsDefaults;
