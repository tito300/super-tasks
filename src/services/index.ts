import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { TaskServices } from "./Task/Task.service";
import { proxyService } from "./proxyService";
import { userService } from "./User/User.service";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { TaskType } from "@src/components/Task/Task";
import { calendarServices } from "./Calendar/Calendar.service";
import { chatGptService } from "./ChatGpt/ChatGpt.service";
import { assertApps } from "@src/config/appsConfig";

let initiated: boolean = false;
const services = {
  task: TaskServices,
  user: userService,
  calendar: calendarServices,
  chatGpt: chatGptService,
};

let messageEngine: ReturnType<typeof getMessageEngine>;

export type ServiceName = keyof typeof services;
export type ServiceObject = Record<string, (...arg: any[]) => Promise<any>>;

export const getService = (serviceName: ServiceName) => {
  if (!initiated) {
    throw new Error("Services not initiated");
  } else {
    return services[serviceName];
  }
};

export const initializeServices = (scriptType: ScriptType) => {
  messageEngine = getMessageEngine(scriptType);

  if (!initiated) {
    if (scriptType === "Background") {
      messageEngine.onMessage("ServiceCall", async (message) => {
        console.log("service call");
        const service = services[message.payload.serviceName];
        try {
          const response = await service[message.payload.method](
            ...message.payload.args
          );

          return response;
        } catch (error: any) {
          if (error.status === 401) {
            messageEngine.broadcastMessage(
              "ReAuthenticate",
              null,
              "Background",
              {
                activeTabOnly: true,
              }
            );
          }

          throw error;
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
