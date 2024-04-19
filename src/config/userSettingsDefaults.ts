export const userSettingsDefaults = {
  darkMode: false,
  tasksOpenOnNewTab: true,
  taskButtonExpanded: true,
  tasksExpanded: false,
  blurText: false,
  persistPosition: false,
  tasksFilters: {
    today: true,
    pastDue: true,
    upcoming: false,
  },
};

export type UserSettings = typeof userSettingsDefaults;
