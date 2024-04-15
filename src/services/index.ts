import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { TaskServices } from "./Task/Task.service";
import { proxyService } from "./proxyService";

let initiated: boolean = false;
const services = {
  task: TaskServices,
};

export type ServiceName = keyof typeof services;

export const getService = (serviceName: ServiceName) => {
  if (!initiated) {
    throw new Error("Services not initiated");
  } else {
    return services[serviceName];
  }
};

export const setupServices = (scriptType: ScriptType) => {
  if (!initiated) {
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
