import {
  ScriptType,
  ServiceCallMessage,
} from "@src/messageEngine/types/taskMessages";
import { TaskServices } from "./Task/Task.service";
import { proxyService } from "./proxyService";
import { userService } from "./User/User.service";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { setupToken } from "@src/oauth/setupToken";
import { requiredScopes } from "@src/config/googleScopes";
import { TasksGlobalState } from "@src/components/Providers/TasksGlobalStateProvider";
import { TaskType } from "@src/components/Task/Task";

let initiated: boolean = false;
const services = {
  task: TaskServices,
  user: userService,
};

const messageEngine = getMessageEngine("Background");

export type ServiceName = keyof typeof services;

export const getService = (serviceName: ServiceName) => {
  if (!initiated) {
    throw new Error("Services not initiated");
  } else {
    return services[serviceName];
  }
};

export const initializeServices = (scriptType: ScriptType) => {
  if (!initiated) {
    if (scriptType === "Background") {
      messageEngine.onMessage("ServiceCall", async (message) => {
        const service = services[message.payload.serviceName];
        try {
          // @ts-expect-error
          const response = await service[message.payload.method](
            ...message.payload.args
          );

          return response;
        } catch (error) {
          const response = await handle401Errors(error, () =>
            // @ts-expect-error
            service[message.payload.method](...message.payload.args)
          );
          if (response) return response;

          throw error;
        }
      });

      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name.startsWith("TaskReminder-")) {
          const taskListId = alarm.name.split("-")[1];
          const taskId = alarm.name.split("-")[2];
          const alert = parseInt(alarm.name.split("-")[3]);

          messageEngine.broadcastMessage(
            "TaskReminder",
            { taskId, taskListId, alert },
            "Background"
          );
          // services.task.updateTaskReminder(taskId, null);
        }
      });
    }

    initiated = true;
    Object.keys(services).forEach((serviceName) => {
      services[serviceName as ServiceName] = proxyService(
        serviceName as ServiceName,
        services[serviceName as ServiceName],
        scriptType
      );
    });
  }
  return services;
};

async function handle401Errors(error: unknown, retry: () => Promise<any>) {
  if (error && typeof error === "object" && "status" in error) {
    if (error.status !== 401) return;

    const res = await services.user.getAuthToken();

    if (res.token) {
      return retry();
    }

    messageEngine.broadcastMessage("ReAuthenticate", null, "Background", {
      activeTabOnly: true,
    });
  }
}
