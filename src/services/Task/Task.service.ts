import { Task } from "@src/components/Task/Task";
import { fetcher } from "../fetcher";
import { urls } from "@src/config/urls";
import { TasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";

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
    return fetcher
      .get(`${urls.BASE_URL}/tasks/${listId}/tasks`)
      .then((res) => res.json())
      .then((res) => {
        return (res?.items || []) as Task[];
      });
  },
  getTaskLists: async () => {
    return fetcher
      .get(`${urls.BASE_URL}/tasks`)
      .then((res) => res.json())
      .then((res) => {
        return (res?.items || []) as Task[];
      });
  },
  addTask: async (
    listId: string,
    task: Task,
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
        return res as Task;
      });
  },
  updateTask: async (listId: string, task: Task) => {
    return fetcher
      .post(`${urls.BASE_URL}/tasks/${listId}/tasks/${task.id}`, task)
      .then((res) => res.json())
      .then((res) => {
        return res as Task;
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
        return res as Task;
      });
  },
  deleteTask: async (listId: string, taskId: string) => {
    return fetcher.delete(`${urls.BASE_URL}/tasks/${listId}/tasks/${taskId}`);
  },
};
