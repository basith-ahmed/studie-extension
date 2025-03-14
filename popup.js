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
      if (!blockedUrls.some((item) => item.url === validUrl)) {
        blockedUrls.push({ url: validUrl, enabled: true });
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
  urls.forEach((site) => {
    const domain = new URL(site.url).hostname.replace(/^www\./, "");

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="site-control">
        <label class="toggle-switch">
          <input type="checkbox" ${site.enabled ? "checked" : ""}>
          <span class="toggle-slider"></span>
        </label>
        <span class="url">${domain}</span>
      </div>
      <button class="remove-btn">Delete</button>
    `;

    const toggle = li.querySelector('input[type="checkbox"]');
    toggle.addEventListener("change", () =>
      toggleUrl(site.url, toggle.checked)
    );

    li.querySelector(".remove-btn").addEventListener("click", () => {
      removeUrl(site.url);
    });

    urlList.appendChild(li);
  });
}

function toggleUrl(url, enabled) {
  chrome.storage.local.get(["blockedUrls"], (data) => {
    const blockedUrls = (data.blockedUrls || []).map((site) =>
      site.url === url ? { ...site, enabled } : site
    );
    chrome.storage.local.set({ blockedUrls });
  });
}

function removeUrl(urlToRemove) {
  chrome.storage.local.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    blockedUrls = blockedUrls.filter((site) => site.url !== urlToRemove);
    chrome.storage.local.set({ blockedUrls }, () => {
      renderUrls(blockedUrls);
    });
  });
}
