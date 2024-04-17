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

// chrome.action.onClicked.addListener(async () => {
//   let token;
//   try {
//     const tokenRes = await chrome.identity.getAuthToken({ interactive: false });
//     token = tokenRes.token;
//   } catch (err) {
//     // ignore
//   }

//   if (!token) {
//     await chrome.tabs.create({ url: htmlFile });
//   }

//   await chrome.action.setPopup({ popup: "src/pages/popup/index.html" });
//   // await chrome.action.openPopup();
// });

const handleFetchTasks = async (alarm: Alarms.Alarm) => {
  if (alarm.name === "fetchTasks") {
    const { selectedTaskListId } = await services.task.getTasksState();
    console.log("selectedTaskListId: ", selectedTaskListId);
    if (selectedTaskListId) {
      await services.task.getTasks(selectedTaskListId);
      messageEngine.broadcastMessage("TasksUpdated", null, "Background", {
        activeTabOnly: true,
      });
    }
  }
};

chrome.alarms.clear("fetchTasks").then(() => {
  // data will be fetched on demand when the user opens the docking station
  // todo: should we store alarm if user does not have the tasks open? probably not
  chrome.alarms.create("fetchTasks", { periodInMinutes: 1 });
});
chrome.alarms.onAlarm.addListener(handleFetchTasks);

// chrome.runtime.onSuspend.addListener(() => {
//   chrome.alarms.clearAll();
//   console.log('Suspended');
// })

// chrome.runtime.onStartup.addListener(() => {
//   fetchInterval();
// });
