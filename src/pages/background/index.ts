import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { initializeServices } from "@src/services";
import { Alarms } from "webextension-polyfill";

const messageEngine = getMessageEngine("Background");
const services = initializeServices("Background");

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    // todo
  }
});

chrome.tabs.onCreated.addListener(function (tab) {
  if (tab.pendingUrl === "chrome://newtab/" || tab.url === "chrome://newtab/") {
    chrome.tabs.update(tab.id as number, {
      url: "https://www.google.com?axs=t",
    });
  }
});

// #region Task Timer
const handleFetchTasksAlarm = async () => {
  const { selectedTaskListId } = await services.task.getTasksState();
  if (selectedTaskListId) {
    try {
      await services.task.getTasks(selectedTaskListId);
      messageEngine.broadcastMessage("UpdateTasks", null, "Background", {
        activeTabOnly: true,
      });
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }
};

const handleAlarms = async (alarm: Alarms.Alarm) => {
  if (alarm.name === "fetchTasksTimer") {
    handleFetchTasksAlarm();
  }
};

messageEngine.onMessage("StopFetchTasksTimer", async () => {
  chrome.alarms.clear("fetchTasksTimer");
});

chrome.alarms.onAlarm.addListener(handleAlarms);

// #endregion
