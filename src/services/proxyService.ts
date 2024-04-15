import { MessageEngine } from "@src/messageEngine/MessageEngine";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { ServiceMethodName } from "./Task/Task.service";
import { ServiceName } from ".";

const config: {
  scriptType: ScriptType | null;
  messageEngine: MessageEngine | null;
  serviceName: ServiceName | null;
} = {
  scriptType: null,
  messageEngine: null,
  serviceName: null,
};

/**
 * This proxyService takes a service object and proxies all its methods
 * to detect if the the user of the service is not the background script then
 * it sends a message to the background script to perform the action using the messageEngine
 */
const proxy = {
  get(target: any, prop: ServiceMethodName, receiver: any) {
    const targetMethod = target[prop];
    if (typeof targetMethod === "function") {
      return function (...args: any[]) {
        if (config.scriptType === "Background") {
          return targetMethod(...args);
        } else {
          return config.messageEngine?.sendMessage("ServiceCall", {
              method: prop,
              args,
              serviceName: config.serviceName!,
            })
            .then((res) => {
              if (res.error) throw new Error(res.error, { cause: res.payload });
              return res.payload;
            })
        }
      };
    } else {
      return target[prop];
    }
  },
};

export function proxyService(
  name: ServiceName,
  service: any,
  scriptType: ScriptType
) {
  config.scriptType = scriptType;
  config.serviceName = name;
  config.messageEngine = new MessageEngine(scriptType);
  return new Proxy(service, proxy);
}
