import { MessageEngine } from "@src/messageEngine/MessageEngine";
import { ScriptType } from "@src/messageEngine/types/taskMessages";
import { ServiceMethodName } from "./Task/Task.service";
import { ServiceName } from ".";
import { constants } from "@src/config/constants";

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
    const targetMethod = target[prop] as (...args: any[]) => Promise<any>;
    if (typeof targetMethod === "function") {
      return async function (...args: any[]) {
        if (config.scriptType === "Background") {
        // Cache is tricky because of optimistic update on consumers, leaving in case needed
        //   const cachedResponse = await chrome.storage.local.get("cache");
        //   if (isCachedResponseValid(cachedResponse, prop)) {
        //     return cachedResponse.cache[prop].response;
        //   }

          return targetMethod(...args).then((response) => {
            // cache response in chrome storage
            // chrome.storage.local.set({
            //   cache: { ...cachedResponse.cache, [prop]: { response, timestamp: Date.now() } },
            // });
            return response;
          });
        } else {
          return config.messageEngine
            ?.sendMessage("ServiceCall", {
              method: prop,
              args,
              serviceName: config.serviceName!,
            })
            .then((res) => {
              if (res.error) throw new Error(res.error, { cause: res.payload });
              const response = res.payload;

              return response;
            });
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

function isCachedResponseValid(cachedResponse: any, prop: string) {
  return (
    cachedResponse &&
    cachedResponse.cache &&
    cachedResponse.cache[prop] &&
    cachedResponse.cache[prop].timestamp >
      Date.now() - constants.CACHE_TIME_TO_LIVE
  );
}
