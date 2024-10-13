import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { TaskServices } from "./Task/Task.service";
import { proxyService } from "./proxyService";
import { userService } from "./User/User.service";
import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { TaskType } from "@src/components/Task/Task";
import { calendarServices } from "./Calendar/Calendar.service";

let initiated: boolean = false;
const services = {
  task: TaskServices,
  user: userService,
  calendar: calendarServices,
};

let messageEngine: ReturnType<typeof getMessageEngine>;

export type ServiceName = keyof typeof services;

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

    console.log("Handling 401 error");
    const res = await services.user.getGoogleAuthToken();

    if (res.token) {
      return retry();
    }

    messageEngine.broadcastMessage("ReAuthenticate", null, "Background", {
      activeTabOnly: true,
    });
  }
}
