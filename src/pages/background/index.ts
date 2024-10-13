import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { initializeServices } from "@src/services";
import { Alarms } from "webextension-polyfill";

const htmlFile = "oauth.html";

const messageEngine = getMessageEngine("Background");
const services = initializeServices("Background");

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    // todo
  }
});

// chrome.notifications.create("notificationId", {
//   type: "basic",
//   iconUrl: "icon.png",
//   title: "Task Timer",
//   eventTime: Date.now() + 1000 * 20,
//   message: "Task Timer is running",
// });

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
