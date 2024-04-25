export type Tab = "tasks" | "calendar";

export const userSettingsDefaults = {
  currentTab: "tasks" as Tab,
  darkMode: false,
  buttonExpanded: false,
  accordionExpanded: false,
  syncExpanded: false,
  calendar: {
    blurText: false,
    persistPosition: false,
    calendarFilters: {
      today: true,
      pastDue: true,
      upcoming: false,
    },
  },
  tasks: {
    blurText: false,
    persistPosition: false,
    tasksFilters: {
      today: true,
      pastDue: true,
      upcoming: false,
    },
  },
};

export type UserSettings = typeof userSettingsDefaults;
export type TasksSettings = UserSettings["tasks"];
export type CalendarSettings = UserSettings["calendar"];
