import { SavedTask, TaskEnhanced, TaskType } from "@src/components/Task/Task";
import { fetcher } from "../fetcher";
import { urls } from "@src/config/urls";
import { TasksState } from "@src/components/Providers/TasksStateProvider";
import { TaskList } from "@src/api/task.api";
import { deepmerge } from "@mui/utils";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import {
  TasksSettings,
  UserSettings,
  tasksSettingsDefaults,
} from "@src/config/settingsDefaults";
import { storageService } from "@src/storage/storage.service";

export type ServiceMethodName = keyof typeof TaskServices;
const messageEngine = getMessageEngine("Background");

/**
 * only use services from within api hooks
 */
export const TaskServices = {
  updateTasksState: async (newState: Partial<TasksState>) => {
    storageService.set({
      tasksState: newState,
    });
  },
  getTasksState: async () => {
    return storageService.get("tasksState").then((data) => {
      return (data || {}) as TasksState;
    });
  },
  getTasks: async (listId: string) => {
    const tasks = await fetcher
      .getWithCache(`${urls.BASE_URL}/tasks/${listId}/tasks`, {
        cacheKey: `tasks-${listId}`,
      })
      .then((res) => res.json())
      .then((res) => {
        return (res?.items || []) as SavedTask[];
      });
    tasks.forEach((task) => {
      task.listId = listId;
    });
    return TaskServices.mergeWithLocalState(tasks);
  },
  getTaskLists: async () => {
    return fetcher
      .getWithCache(`${urls.BASE_URL}/tasks`, { cacheKey: "taskLists" })
      .then((res) => res.json())
      .then((res) => {
        return (res?.items || []) as TaskList[];
      });
  },
  addTask: async (
    listId: string,
    task: SavedTask,
    previousTaskId?: string | null
  ) => {
    return fetcher
      .post(
        `${urls.BASE_URL}/tasks/${listId}/tasks?previous=${
          previousTaskId ?? ""
        }`,
        task
      )
      .then((res) => res.json())
      .then((res) => {
        return res as SavedTask;
      });
  },
  updateTask: async (listId: string, task: SavedTask) => {
    TaskServices.updateLocalTaskState(task);
    return fetcher
      .post(`${urls.BASE_URL}/tasks/${listId}/tasks/${task.id}`, task)
      .then((res) => res.json())
      .then((res) => {
        return res as SavedTask;
      });
  },
  moveTask: async (
    listId: string,
    taskId: string,
    previousTaskId?: string | null
  ) => {
    return fetcher
      .post(`${urls.BASE_URL}/tasks/${listId}/tasks/${taskId}/move`, {
        previousTaskId,
      })
      .then((res) => res.json())
      .then((res) => {
        return res as SavedTask;
      });
  },
  deleteTask: async (listId: string, taskId: string) => {
    return fetcher.delete(`${urls.BASE_URL}/tasks/${listId}/tasks/${taskId}`);
  },
  setReminder: async (
    taskId: string,
    taskListId: string,
    timeInMinutes: number
  ) => {
    const alarmName = `TaskReminder-${taskListId}-${taskId}`;
    const userSettings = await storageService.get("userSettings");

    chrome.alarms.create(alarmName, {
      delayInMinutes: timeInMinutes,
    });

    chrome.alarms.onAlarm.addListener(function listener(alarm) {
      if (alarm.name === alarmName) {
        const taskId = alarm.name.split("-")[2];

        TaskServices.updateLocalTaskState({
          id: taskId,
          alertOn: true,
          alert: 0,
          listId: taskListId,
        });

        if (userSettings.windowNotifications) {
          getReminderTopLeftPosition().then(({ top, left }) => {
            chrome.windows.create({
              url: "src/pages/reminder/index.html",
              type: "popup",
              width: 450,
              height: 124,
              focused: true,
              top: top || 100,
              left: left || 24,
            });
          });
        }
        messageEngine.broadcastMessage("UpdateTasks", null);
        chrome.alarms.onAlarm.removeListener(listener);
      }
    });
  },
  removeReminder: async (taskId: string, taskListId: string) => {
    chrome.alarms.clear(`TaskReminder-${taskListId}-${taskId}`);

    TaskServices.updateLocalTaskState({
      id: taskId,
      alertOn: false,
      alert: 0,
      listId: taskListId,
    });
    // storageService.set({
    //   tasksState: {
    //     tasks: {
    //       [taskId]: { alertOn: false, alert: 0 },
    //     },
    //   },
    // });
    // });
  },
  mergeWithLocalState: async (tasks: SavedTask[]) => {
    const storage = await storageService.get("tasksEnhanced");

    if (!storage) return tasks;

    const mergedTasks = tasks.map((task) => {
      const enhancedProperties = filterEnhancedProperties(
        (storage[task.id] || {}) as TaskEnhanced
      );
      return deepmerge(task, enhancedProperties);
    });

    return mergedTasks;
  },
  updateLocalTaskState: async (
    task: Partial<TaskType> & { id: string; listId: string }
  ) => {
    // const storage = await storageService.get("tasksEnhanced");
    storageService.set({
      tasksEnhanced: {
        [task.id!]: filterEnhancedProperties(task, { deleteUndefined: true }),
      },
    });
  },
  async getTasksSettings() {
    const settings = await storageService.get("tasksSettings");
    if (!settings) TaskServices.updateTasksSettings(tasksSettingsDefaults);
    return { ...tasksSettingsDefaults, ...settings };
  },
  async updateTasksSettings(settings: Partial<TasksSettings>) {
    // for now, just store settings in local storage until we have user endpoints
    return storageService.set({
      tasksSettings: { ...tasksSettingsDefaults, ...settings },
    });
  },
};

function filterEnhancedProperties(
  task: SavedTask | TaskEnhanced | TaskType, options: { deleteUndefined?: boolean} = {}
): Record<Exclude<keyof TaskEnhanced, "id">, any> {
  const { alert, alertOn, alertSeen, listId, pinned } = task;

  const properties = { alert, alertOn, alertSeen, listId, pinned };
  if (options.deleteUndefined) {
    Object.keys(properties).forEach((key) => {
      if (properties[key as keyof typeof properties] === undefined) {
        delete properties[key  as keyof typeof properties];
      }
    });
  }

  return properties;
    
}

async function getReminderTopLeftPosition() {
  const displays = await chrome.system.display.getInfo();
  const primaryDisplay =
    displays.find((display) => display.isPrimary) || displays[0];
  const screenWidth = primaryDisplay.workArea.width;
  const screenHeight = primaryDisplay.workArea.height;
  const width = 450;
  const height = 124;

  const left = screenWidth - width - 16 + primaryDisplay.workArea.left;
  const top = screenHeight - height - 16 + primaryDisplay.workArea.top;

  return { top, left };
}
