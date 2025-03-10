chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.local.get(["blockedUrls"], (data) => {
    const blockedUrls = data.blockedUrls || [];
    if (blockedUrls.includes(details.url)) {
      chrome.tabs.update(details.tabId, { url: "chrome://newtab/" });
    }
  });
});
