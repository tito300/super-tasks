const htmlFile = 'oauth.html';

chrome.action.onClicked.addListener(() => {
    console.log('#####')
    chrome.tabs.create({ url: htmlFile });
    chrome.action.setPopup({popup: 'src/pages/popup/index.html'})
});
