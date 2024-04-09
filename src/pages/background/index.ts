const htmlFile = "oauth.html";

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
