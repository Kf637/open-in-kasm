document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  document.getElementById('language').addEventListener('change', localize);
  localize();
});
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('info').addEventListener('click', () => {
  window.open('https://kasmweb.com/docs/latest/guide/browser_isolation.html#go-url');
});

function saveOptions() {
  const domain = document.getElementById('domain').value;
  const language = document.getElementById('language').value;
  chrome.storage.sync.set({ domain, language }, () => {
    const status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('settingsSaved');
    status.classList.add('show');
    setTimeout(() => {
      status.textContent = '';
      status.classList.remove('show');
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get(['domain', 'language'], (items) => {
    const input = document.getElementById('domain');
    if (items.domain) {
      input.value = items.domain;
    } else {
      input.value = ''; // leave placeholder visible
    }
    if (items.language) {
      document.getElementById('language').value = items.language;
    }
    });
}

async function localize() {
  const defaultLang = (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage)
    ? chrome.i18n.getUILanguage().split('-')[0]
    : 'en';
  const lang = document.getElementById('language').value || defaultLang;
  try {
    const res = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
    const msgs = await res.json();
    applyMessages(msgs);
  } catch (e) {
    if (lang !== 'en') {
      const res = await fetch(chrome.runtime.getURL('_locales/en/messages.json'));
      const msgs = await res.json();
      applyMessages(msgs);
    }
  }
}

function applyMessages(msgs) {
  document.querySelector('h1').textContent = msgs.extensionName.message;
  document.querySelector('label[for="domain"]').textContent = msgs.kasmDomain.message;
  document.querySelector('label[for="language"]').textContent = msgs.language.message;
  document.getElementById('save').textContent = msgs.save.message;
  document.getElementById('info').textContent = msgs.info.message;
  document.querySelector('.footer').textContent = msgs.disclaimer.message;
}

