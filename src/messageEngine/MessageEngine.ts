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
  scriptType: "Content" | "Background" | "Popup" | undefined;
  constructor(scriptType: "Content" | "Background" | "Popup") {
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
    sourceScript?: ScriptType
  ) {
    if (this.scriptType === "Popup" || this.scriptType === "Content") {
      this.sendMessage("BroadcastMessage", { action, payload });
    } else {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          this.sendMessageToTab(tab.id!, action, payload, sourceScript);
        });
      });
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
    callback: (
      message: TaskMessage<T>
    ) => Promise<any>
  ) {
    chrome.runtime.onMessage.addListener(
      (message: unknown, sender, sendResponse: (response: MessageResponse) => void) => {
        if (this.isValidMessage(message) && message.action === action) {
          callback(message as TaskMessage<T>)
            .then((response) => {
              sendResponse({
                payload: response,
              });
            })
            .catch(err => {
              sendResponse({
                payload: err,
                error: err.message
              });
            });
          return true;
        }
      }
    );
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
