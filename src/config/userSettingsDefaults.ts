export const userSettingsDefaults = {
  currentTab: "tasks",
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
  }
};

export type UserSettings = typeof userSettingsDefaults;
