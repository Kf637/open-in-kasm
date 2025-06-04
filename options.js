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
  chrome.storage.sync.set({ domain }, () => {
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
  chrome.storage.sync.get('domain', (items) => {
    const input = document.getElementById('domain');
    if (items.domain) {
      input.value = items.domain;
    } else {
      input.value = ''; // leave placeholder visible
    }
  });
}

function localize() {
  document.querySelector('h1').textContent = chrome.i18n.getMessage('extensionName');
  document.querySelector('label[for="domain"]').textContent = chrome.i18n.getMessage('kasmDomain');
  document.getElementById('save').textContent = chrome.i18n.getMessage('save');
  document.getElementById('info').textContent = chrome.i18n.getMessage('info');
  document.querySelector('.footer').textContent = chrome.i18n.getMessage('disclaimer');
}

