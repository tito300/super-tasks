/**
 * This MessageEngine class facilitates communication between the content script, the background script and the popup
 * It uses the chrome.runtime API to send messages between the different components
 */

import {
  BroadcastMessage,
  MessageResponse,
  ScriptType,
  TaskAction,
  TaskMessage,
  taskActions,
} from "./types/taskMessages";

export class MessageEngine {
  scriptType: ScriptType | undefined;
  constructor(scriptType: ScriptType) {
    this.scriptType = scriptType;
    this[`init${scriptType}`]();
  }

  initContent() {}
  initBackground() {
    this.onMessage("BroadcastMessage", async (message) => {
      this.broadcastMessage(
        message.payload.action,
        message.payload.payload,
        message.sourceScript
      );
    });
  }
  initPopup() {}
  initReminder() {}

  sendMessage<T extends TaskAction>(
    action: T,
    payload: TaskMessage<T>["payload"],
    sourceScript?: ScriptType
  ): Promise<MessageResponse> {
    return chrome.runtime.sendMessage({
      action,
      payload,
      sourceScript: sourceScript || this.scriptType,
    });
  }

  /**
   * Broadcasts message to all tabs
   */
  broadcastMessage<T extends TaskAction>(
    action: T,
    payload: TaskMessage<T>["payload"],
    sourceScript?: ScriptType,
    options?: { activeTabOnly?: boolean; highlightedOnly?: boolean }
  ) {
    if (this.scriptType !== "Background") {
      this.sendMessage("BroadcastMessage", { action, payload });
    } else {
      chrome.tabs.query({}, (tabs) => {
        tabs
          .sort((tab) => {
            if (tab.active) return -1;
            return 1;
          })
          .forEach((tab) => {
            if (options?.highlightedOnly && !tab.highlighted) return;
            if (options?.activeTabOnly && !tab.active) return;

            this.sendMessageToTab(tab.id!, action, payload, sourceScript);
          });
      });
      this.sendMessage(action, payload, sourceScript);
    }
  }

  sendMessageToTab<T extends TaskAction>(
    tabId: number,
    action: T,
    payload: TaskMessage<T>["payload"],
    sourceScript?: ScriptType
  ) {
    chrome.tabs.sendMessage(tabId, {
      action,
      payload,
      sourceScript: sourceScript || this.scriptType,
    });
  }

  onMessage<T extends TaskAction>(
    action: T | null,
    callback: (message: TaskMessage<T>) => Promise<any>
  ) {
    const handler = (
      message: unknown,
      sender: any,
      sendResponse: (response: MessageResponse) => void
    ) => {
      if (this.isValidMessage(message) && message.action === action) {
        callback(message as TaskMessage<T>)
          .then((response) => {
            sendResponse({
              payload: response,
            });
          })
          .catch((err) => {
            console.error(err);
            sendResponse({
              payload: {
                message: err.message || err.statusText || "An error occurred",
                status: err.status || 500,
              },
              error: true,
            });
          });
        return true;
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }

  isBroadcastMessage(message: unknown): message is BroadcastMessage {
    return (message as any).action === "BroadcastMessage";
  }
  isValidMessage<T extends TaskAction>(
    message: unknown
  ): message is TaskMessage<T> {
    if (typeof message !== "object" || !message || !("action" in message))
      return false;

    return taskActions.includes((message as any).action);
  }
}

export function getMessageEngine(scriptType: ScriptType) {
  return new MessageEngine(scriptType);
}
