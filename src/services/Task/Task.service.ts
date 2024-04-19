import { SavedTask, TaskEnhanced } from "@src/components/Task/Task";
import { fetcher } from "../fetcher";
import { urls } from "@src/config/urls";
import { TasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { TaskList } from "@src/api/task.api";
import { deepmerge } from "@mui/utils";

export type ServiceMethodName = keyof typeof TaskServices;
export const TaskServices = {
  updateTasksState: async (newState: Partial<TasksGlobalState>) => {
    chrome.storage.local.get("tasksState").then((data) => {
      chrome.storage.local.set({
        tasksState: { ...data?.tasksState, ...newState },
      });
    });
  },
  getTasksState: async () => {
    return chrome.storage.local.get("tasksState").then((data) => {
      return (data.tasksState || {}) as TasksGlobalState;
    });
  },
  getTasks: async (listId: string) => {
    const tasks = await fetcher
      .get(`${urls.BASE_URL}/tasks/${listId}/tasks`)
      .then((res) => res.json())
      .then((res) => {
        return (res?.items || []) as SavedTask[];
      });
    tasks.forEach((task) => {
      task.listId = listId;
    });
    return TaskServices.mergeWithLocalState(listId, tasks);
  },
  getTaskLists: async () => {
    return fetcher
      .get(`${urls.BASE_URL}/tasks`)
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
  setReminder: async (taskId: string, taskListId: string, timeInMinutes: number) => {
    chrome.alarms.create(`TaskReminder-${taskListId}-${taskId}`, {
      delayInMinutes: timeInMinutes,
    });
  },
  updateTaskReminder: async (taskId: string, taskListId: string, timeInMinutes?: number) => {
    chrome.storage.local.get("tasksState", (inData) => {
      const data = inData as { tasksState: TasksGlobalState };
      const tasksState = data.tasksState || {};

      const updatedTasksState = deepmerge(tasksState, {
        tasks: {
          [taskId]: { alertOn: true, alert: timeInMinutes },
        },
      });
      chrome.storage.local.set({ tasksState: updatedTasksState });
    });
  },
  mergeWithLocalState: async (listId: string, tasks: SavedTask[]) => {
    const localTasksState = await TaskServices.getTasksState();
    const localTasks = localTasksState.tasks || {};

    const mergedTasks = tasks.map((task) => {
      const enhancedProperties: TaskEnhanced = {
        alertOn: localTasks[task.id]?.alertOn,
        alert: localTasks[task.id]?.alert,
      }
      return deepmerge(task, enhancedProperties);
    });

    return mergedTasks;
  },
};
