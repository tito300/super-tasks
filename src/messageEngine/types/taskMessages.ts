import { Task } from "@src/components/Task/Task";
import { ServiceName } from "@src/services";
import { ServiceMethodName } from "@src/services/Task/Task.service";

export type TaskMessage<T = TaskAction> = T extends "DockTask"
  ? DockTaskMessage
  : T extends "UnDockTask"
  ? UnDockTaskMessage
  : T extends "BroadcastMessage"
  ? BroadcastMessage
  : T extends "ServiceCall"
  ? ServiceCallMessage
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

export type BroadcastMessage = {
  action: "BroadcastMessage";
  sourceScript: ScriptType;
  payload: any;
};

// used when services are called from outside background script
export type ServiceCallMessage = {
  action: "ServiceCall";
  sourceScript: ScriptType;
  payload: { method: ServiceMethodName; args: any[]; serviceName: ServiceName };
};

export const taskActions = [
  "DockTask",
  "UnDockTask",
  "BroadcastMessage",
  "ServiceCall",
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
}