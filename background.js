async function createMenus() {
  const { language } = await chrome.storage.sync.get('language');
  const lang = language || chrome.i18n.getUILanguage().split('-')[0];
  let msgs;
  try {
    const res = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
    msgs = await res.json();
  } catch (e) {
    const res = await fetch(chrome.runtime.getURL('_locales/en/messages.json'));
    msgs = await res.json();
  }
  const contexts = ["link", "page", "selection"];
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "open_in_kasm",
      title: msgs.openIn.message,
      contexts
    });
    chrome.contextMenus.create({
      id: "open_in_kasm_tab",
      parentId: "open_in_kasm",
      title: msgs.openInNewTab.message,
      contexts
    });
    chrome.contextMenus.create({
      id: "open_in_kasm_window",
      parentId: "open_in_kasm",
      title: msgs.openInNewWindow.message,
      contexts
    });
  });
}

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.language) {
    createMenus();
  }
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
