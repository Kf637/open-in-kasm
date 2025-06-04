document.addEventListener('DOMContentLoaded', () => {
  localize();
  restoreOptions();
});
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('info').addEventListener('click', () => {
  window.open('https://kasmweb.com/docs/latest/guide/browser_isolation.html#go-url');
});

function saveOptions() {
  const domain = document.getElementById('domain').value;
  const language = document.getElementById('language').value;
  chrome.storage.sync.set({ domain, language }, () => {
    loadMessages((msgs) => {
      const status = document.getElementById('status');
      status.textContent = msgs.settingsSaved.message;
      status.classList.add('show');
      setTimeout(() => {
        status.textContent = '';
        status.classList.remove('show');
      }, 2000);
    });
  });
}

function restoreOptions() {
  chrome.storage.sync.get(['domain', 'language'], (items) => {
    const input = document.getElementById('domain');
    input.value = items.domain || '';
    const langSelect = document.getElementById('language');
    if (langSelect) {
      langSelect.value = items.language || 'system';
    }
  });
}

function localize() {
  loadMessages((msgs) => {
    document.querySelector('h1').textContent = msgs.extensionName.message;
    document.querySelector('label[for="domain"]').textContent = msgs.kasmDomain.message;
    document.querySelector('label[for="language"]').textContent = msgs.language.message;
    document.querySelector('#language option[value="system"]').textContent = msgs.systemDefault.message;
    document.getElementById('save').textContent = msgs.save.message;
    document.getElementById('info').textContent = msgs.info.message;
    document.querySelector('.footer').textContent = msgs.disclaimer.message;
  });
}

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

