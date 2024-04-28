import { deepmerge } from "@mui/utils";
import { TasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import {
  TasksSettings,
  CalendarSettings,
  UserSettings,
} from "@src/config/userSettingsDefaults";
import { DeepPartial } from "react-hook-form";

export const storageService = {
  get: async <K extends keyof StorageData>(
    key?: K
  ): Promise<K extends keyof StorageData ? StorageData[K] : StorageData> => {
    if (isStorageKey(key)) {
      const storage = (await chrome.storage.local.get(key)) as StorageData;
      return storage[key] as any;
    } else {
      const storage = (await chrome.storage.local.get()) as StorageData;
      return storage as any;
    }
  },
  set: async (items: DeepPartial<StorageData>) => {
    // 1. merge with existing data
    const changeObject: Partial<StorageData> = {};

    const existingStorage = await storageService.get();

    Object.keys(items).forEach((k) => {
      const key = k as keyof StorageData;
      // @ts-ignore
      changeObject[key] = deepmerge(existingStorage[key], items[key]);
    });

    return chrome.storage.local.set(changeObject);
  },
  onChange: (callback: onChangeCallback) => {
    // @ts-ignore
    chrome.storage.local.onChanged.addListener(callback);
  },
} as const;

function isStorageKey(key: any): key is keyof StorageData {
  return (
    key &&
    [
      "cache",
      "tasksSettings",
      "tasksState",
      "calendarSettings",
      "calendarState",
      "userSettings",
      "userState",
      "globalState",
    ].includes(key)
  );
}

type onChangeCallback = (changes: {
  [key in keyof StorageData]: {
    oldValue?: StorageData[key];
    newValue?: StorageData[key];
  };
}) => void;

type StorageData = {
  cache: Record<string, CacheData>;
  tasksSettings: TasksSettings;
  tasksState: TasksGlobalState;
  calendarSettings: CalendarSettings;
  calendarState: CalendarGlobalState;
  userSettings: UserSettings;
  userState: {};
  globalState: {
    open: boolean;
  };
};

type CacheData = {
  updatedAt: number;
  data: any;
};

type CalendarGlobalState = {
  selectedCalendarId?: string | null;
  defaultCalendarId?: string | null;
  calendars?: {
    [calendarId: string]: any;
  };
};
