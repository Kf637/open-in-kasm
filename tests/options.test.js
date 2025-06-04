const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

describe('restoreOptions', () => {
  test('populates domain input when value is stored', () => {
    const html = `\n      <input id="domain">\n      <div id="status"></div>\n      <button id="save"></button>\n      <button id="info"></button>\n    `;
    const dom = new JSDOM(html);

    const chrome = {
      storage: {
        sync: {
          get: jest.fn((key, cb) => cb({ domain: 'example.com' }))
        }
      }
    };

    const context = {
      window: dom.window,
      document: dom.window.document,
      chrome,
      setTimeout
    };
    vm.createContext(context);
    const code = fs.readFileSync(path.join(__dirname, '../options.js'), 'utf8');
    vm.runInContext(code, context);

    // Call the function manually
    context.restoreOptions();

    const input = dom.window.document.getElementById('domain');
    expect(input.value).toBe('example.com');
  });
});
