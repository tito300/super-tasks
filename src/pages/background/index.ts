import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { setupToken } from "@src/oauth/setupToken";
import { setupServices } from "@src/services";
import { Alarms } from "webextension-polyfill";

const htmlFile = "oauth.html";

// setupToken();
const messageEngine = getMessageEngine("Background");
const services = setupServices("Background");

messageEngine.onMessage("ServiceCall", async (message) => {
  const service = services[message.payload.serviceName];
  console.log("service", service);
  // @ts-ignore
  const response = await service[message.payload.method](
    // @ts-ignore
    ...message.payload.args
  );
  return response;
});

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    // todo
  }
});

const handleFetchTasksAlarm = async () => {
  const userSettings = await services.user.getUserSettings();

  if (userSettings?.taskButtonExpanded && userSettings?.tasksExpanded) {
    const { selectedTaskListId } = await services.task.getTasksState();
    console.log("selectedTaskListId: ", selectedTaskListId);
    if (selectedTaskListId) {
      await services.task.getTasks(selectedTaskListId);
      messageEngine.broadcastMessage("UpdateTasks", null, "Background", {
        activeTabOnly: true,
      });
    }
  }
};

const handleAlarms = async (alarm: Alarms.Alarm) => {
  if (alarm.name === "fetchTasks") {
    handleFetchTasksAlarm();
  }
};

chrome.alarms.clear("fetchTasks").then(() => {
  // data will be fetched on demand when the user opens the docking station
  // todo: should we store alarm if user does not have the tasks open? probably not
  chrome.alarms.create("fetchTasks", { periodInMinutes: 3 });
});
chrome.alarms.onAlarm.addListener(handleAlarms);

// chrome.runtime.onSuspend.addListener(() => {
//   chrome.alarms.clearAll();
//   console.log('Suspended');
// })

// chrome.runtime.onStartup.addListener(() => {
//   fetchInterval();
// });
