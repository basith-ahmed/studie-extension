document.addEventListener("DOMContentLoaded", () => {
  loadUrls();
  document.getElementById("addBtn").addEventListener("click", addUrl);
});

function loadUrls() {
  chrome.storage.local.get(["blockedUrls"], (data) => {
    renderUrls(data.blockedUrls || []);
  });
}

function addUrl() {
  const urlInput = document.getElementById("urlInput").value.trim();
  if (!urlInput) return;

  try {
    const validUrl = new URL(urlInput).href;
    chrome.storage.local.get(["blockedUrls"], (data) => {
      const blockedUrls = data.blockedUrls || [];
      if (!blockedUrls.includes(validUrl)) {
        blockedUrls.push(validUrl);
        chrome.storage.local.set({ blockedUrls }, () => {
          document.getElementById("urlInput").value = "";
          renderUrls(blockedUrls);
        });
      }
    });
  } catch (e) {
    alert("Please enter a valid URL with protocol (e.g., https://example.com)");
  }
}

function renderUrls(urls) {
  const urlList = document.getElementById("urlList");
  urlList.innerHTML = "";
  urls.forEach((url) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${url}</span>
      <button class="remove-btn">Remove</button>
    `;
    li.querySelector(".remove-btn").addEventListener("click", () => {
      removeUrl(url);
    });
    urlList.appendChild(li);
  });
}

function removeUrl(urlToRemove) {
  chrome.storage.local.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    blockedUrls = blockedUrls.filter((url) => url !== urlToRemove);
    chrome.storage.local.set({ blockedUrls }, () => {
      renderUrls(blockedUrls);
    });
  });
}
