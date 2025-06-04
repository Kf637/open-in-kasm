chrome.runtime.onInstalled.addListener(() => {
  const contexts = ["link", "page", "selection"];
  chrome.contextMenus.create({
    id: "open_in_kasm",
    title: chrome.i18n.getMessage("openIn"),
    contexts
  });
  chrome.contextMenus.create({
    id: "open_in_kasm_tab",
    parentId: "open_in_kasm",
    title: chrome.i18n.getMessage("openInNewTab"),
    contexts
  });
  chrome.contextMenus.create({
    id: "open_in_kasm_window",
    parentId: "open_in_kasm",
    title: chrome.i18n.getMessage("openInNewWindow"),
    contexts
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (!info.menuItemId.startsWith('open_in_kasm_')) return;
  let url = info.linkUrl || info.pageUrl || info.selectionText;
  if (info.selectionText) {
    url = info.selectionText.startsWith('http') ? info.selectionText : '';
  }
  if (!url) return;
  chrome.storage.sync.get({ domain: 'https://kasm.example.com' }, (items) => {
    const kasmUrl = `${items.domain}/#/go?kasm_url=${encodeURIComponent(url)}`;
    if (info.menuItemId === 'open_in_kasm_window') {
      chrome.windows.create({ url: kasmUrl });
    } else {
      chrome.tabs.create({ url: kasmUrl });
    }
  });
});
