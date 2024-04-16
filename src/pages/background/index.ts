import { getMessageEngine } from "@src/messageEngine/MessageEngine";
import { setupToken } from "@src/oauth/setupToken";
import { setupServices } from "@src/services";

const htmlFile = "oauth.html";

setupToken();
const messageEngine = getMessageEngine('Background');
const services = setupServices('Background');

messageEngine.onMessage('ServiceCall', async (message) => {
  const service = services[message.payload.serviceName];
  console.log('service', service);
  // @ts-ignore
  const response = await service[message.payload.method](
    // @ts-ignore
    ...message.payload.args);
  return response;
})

chrome.action.onClicked.addListener(async () => {
  let token;
  try {
    const tokenRes = await chrome.identity.getAuthToken({ interactive: false });
    token = tokenRes.token;
  } catch (err) {
    // ignore
  }

  if (!token) {
    await chrome.tabs.create({ url: htmlFile });
  }

  await chrome.action.setPopup({ popup: "src/pages/popup/index.html" });
});
