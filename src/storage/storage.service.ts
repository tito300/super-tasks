import { deepmerge } from "@mui/utils";
import { ChatMessage } from "@src/chatGpt.types";
import { ChatGptSettings } from "@src/components/Providers/ChatGptSettingsProvider";
import { ChatGptState } from "@src/components/Providers/ChatGptStateProvider";
import { TasksState } from "@src/components/Providers/TasksStateProvider";
import { UserState } from "@src/components/Providers/UserStateProvider";
import { TaskEnhanced } from "@src/components/Task/Task";
import {
  TasksSettings,
  CalendarSettings,
  UserSettings,
} from "@src/config/settingsDefaults";
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

    let existingStorage = await storageService.get();

    Object.keys(items).forEach((k) => {
      const key = k as keyof StorageData;
      // @ts-ignore
      changeObject[key] = deepmerge(existingStorage[key] || {}, items[key]);
    });

    return chrome.storage.local.set(changeObject);
  },
  /**
   * if key is provided, only listen to changes of that key, else listen to all changes
   * @param key
   * @param callback
   */
  onChange: (key: keyof StorageData | null, callback: onChangeCallback) => {
    if (key) {
      const listener = (changes: any) => {
        if (key in changes) {
          callback(changes as any);
        } else {
          return null;
        }
      };
      chrome.storage.local.onChanged.addListener(listener);
      return () => {
        chrome.storage.local.onChanged.removeListener(listener);
      };
    } else {
      // @ts-ignore
      chrome.storage.local.onChanged.addListener(callback);
      return () => {
        // @ts-ignore
        chrome.storage.local.onChanged.removeListener(callback);
      };
    }
  },
} as const;

const storageKeys = [
  "cache",
  "tasksSettings",
  "tasksState",
  "calendarSettings",
  "calendarState",
  "userSettings",
  "userState",
  "globalState",
  "tasksEnhanced",
  "chatGptSettings",
  "chatGptState",
] as const;

function isStorageKey(key: any): key is keyof StorageData {
  return key && storageKeys.includes(key);
}

type onChangeCallback = (
  changes:
    | {
        [key in keyof StorageData]: {
          oldValue?: StorageData[key];
          newValue?: StorageData[key];
        };
      }
    | null
) => void;

export type StorageData = {
  cache: Record<string, CacheData>;
  tasksSettings: TasksSettings;
  tasksState: TasksState;
  tasksEnhanced: { [taskId: string]: TaskEnhanced };
  calendarSettings: CalendarSettings;
  calendarState: CalendarGlobalState;
  userSettings: UserSettings;
  userState: UserState;
  chatGptSettings: ChatGptSettings;
  chatGptState: ChatGptState;
  globalState: {
    open: boolean;
  };
  fetcherCache: Record<string, any>;
};

type CacheData = {
  updatedAt: number;
  data: any;
};

type CalendarGlobalState = {
  selectedDate: Date | null;
};
