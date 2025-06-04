chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open_in_kasm",
    title: "Open in Kasm",
    contexts: ["link", "page", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url = info.linkUrl || info.pageUrl || info.selectionText;
  if (info.selectionText) {
    url = info.selectionText.startsWith('http') ? info.selectionText : '';
  }
  if (!url) return;
  chrome.storage.sync.get({ domain: 'https://kasm.example.com' }, (items) => {
    const kasmUrl = `${items.domain}/#/go?kasm_url=${encodeURIComponent(url)}`;
    chrome.tabs.create({ url: kasmUrl });
  });
});
