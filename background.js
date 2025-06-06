function loadMessages(cb) {
  chrome.storage.sync.get('language', (items) => {
    const chosen = items.language && items.language !== 'system' ? items.language : chrome.i18n.getUILanguage().split('-')[0];
    const url = chrome.runtime.getURL(`_locales/${chosen}/messages.json`);
    fetch(url)
      .then(r => r.json())
      .then(cb)
      .catch(() => fetch(chrome.runtime.getURL('_locales/en/messages.json')).then(r => r.json()).then(cb));
  });
}

function createMenus(msgs) {
  const contexts = ["link", "page", "selection"];
  chrome.contextMenus.create({ id: "open_in_kasm", title: msgs.openIn.message, contexts });
}

function setupMenus() {
  chrome.contextMenus.removeAll(() => loadMessages(createMenus));
}

chrome.runtime.onInstalled.addListener(setupMenus);
setupMenus();

chrome.storage.onChanged.addListener((changes) => {
  if (changes.language) {
    setupMenus();
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (!info.menuItemId.startsWith('open_in_kasm')) return;
  let url = info.linkUrl || info.pageUrl || info.selectionText;
  if (info.selectionText) {
    url = info.selectionText.startsWith('http') ? info.selectionText : '';
  }
  if (!url) return;
  chrome.storage.sync.get({ domain: 'https://kasm.example.com', openMethod: 'tab' }, (items) => {
    const kasmUrl = `${items.domain}/#/go?kasm_url=${encodeURIComponent(url)}`;
    const target = info.menuItemId === 'open_in_kasm_window' ? 'window'
      : info.menuItemId === 'open_in_kasm_tab' ? 'tab'
      : items.openMethod;
    if (target === 'window') {
      chrome.windows.create({ url: kasmUrl });
    } else {
      chrome.tabs.create({ url: kasmUrl });
    }
  });
});
