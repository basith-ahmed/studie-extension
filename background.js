chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.local.get(["blockedUrls"], (data) => {
    const blockedUrls = data.blockedUrls || [];
    const isBlocked = blockedUrls.some(
      (site) => details.url.includes(site.url) && site.enabled
    );

    if (isBlocked) {
      chrome.tabs.update(details.tabId, { url: "chrome://newtab/" });
    }
  });
});
