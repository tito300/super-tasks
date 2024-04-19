import { Task } from "@src/components/Task/Task";
import { UserSettings } from "@src/config/userSettingsDefaults";
import { ServiceName } from "@src/services";
import { ServiceMethodName } from "@src/services/Task/Task.service";
import { UserServiceMethodName } from "@src/services/User/User.service";

export type TaskMessage<T extends TaskAction = TaskAction> =
  T extends "DockTask"
    ? DockTaskMessage
    : T extends "UnDockTask"
    ? UnDockTaskMessage
    : T extends "BroadcastMessage"
    ? BroadcastMessage
    : T extends "ServiceCall"
    ? ServiceCallMessage
    : T extends "UpdateTasks"
    ? UpdateTasksMessage
    : T extends "StartFetchTasksTimer" | "StopFetchTasksTimer"
    ? FetchTasksTimerMessage
    : T extends "ReAuthenticate"
    ? ReAuthenticateMessage
    : T extends "UserSettingsUpdated"
    ? UserSettingsUpdatedMessage
    : never;

export type ScriptType = "Popup" | "Content" | "Background";

export type DockTaskMessage = {
  action: "DockTask";
  sourceScript: ScriptType;
  payload: Task;
};

export type UnDockTaskMessage = {
  action: "UnDockTask";
  sourceScript: ScriptType;
  payload: Task;
};

export type UpdateTasksMessage = {
  action: "UpdateTasks";
  sourceScript: ScriptType;
  payload?: null;
};

export type BroadcastMessage = {
  action: "BroadcastMessage";
  sourceScript: ScriptType;
  payload: any;
};

// used when services are called from outside background script
export type ServiceCallMessage = {
  action: "ServiceCall";
  sourceScript: ScriptType;
  payload: {
    method: ServiceMethodName | UserServiceMethodName;
    args: any[];
    serviceName: ServiceName;
  };
};

export type ReAuthenticateMessage = {
  action: "ReAuthenticate";
  sourceScript: ScriptType;
  payload?: null;
};

export type FetchTasksTimerMessage = {
  action: "StartFetchTasksTimer" | "StopFetchTasksTimer";
  sourceScript: ScriptType;
  payload?: null;
};

export type UserSettingsUpdatedMessage = {
  action: "UserSettingsUpdated";
  sourceScript: ScriptType;
  payload?: null;
};

export const taskActions = [
  "DockTask",
  "UnDockTask",
  "BroadcastMessage",
  "ServiceCall",
  "UpdateTasks",
  "StartFetchTasksTimer",
  "StopFetchTasksTimer",
  "ReAuthenticate",
  "UserSettingsUpdated",
] as const;
export type TaskAction = (typeof taskActions)[number];

export const isValidTaskMessage = (
  message: unknown
): message is TaskMessage => {
  if (typeof message !== "object" || !message || !("action" in message))
    return false;

  return ["scheduleTask"].includes((message as any).action);
};

export type MessageResponse = {
  payload: any;
  error?: string;
};
