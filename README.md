# Open in Kasm Chrome Extension

This extension adds context menu items under **Open In** when you right-click on any page, link or selected text. You can choose to open the URL in Kasm in a new tab or a new window.

The extension is localized and will automatically use your browser's language when available. It now includes translations for English, Spanish, Norwegian, Swedish, French and German. You can also choose a preferred language in the extension options.

## Installation

1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select this directory.

## Configuration

1. Open `chrome://extensions` and locate **Open in Kasm**.
2. Click **Details** and then **Extension options** to open the options page.
3. Enter the URL of your Kasm instance (e.g. `https://kasm.example.com`).
4. Choose your preferred language or leave **System Default** to follow your browser settings and click **Save**.

## Usage

Right-click on a page, link, or selected text and choose **Open In**. Then pick **New Tab** or **New Window** to launch the page through your configured Kasm instance.

## Development

The repository includes a CodeQL workflow for static analysis. If this repository already has CodeQL configured using GitHub's default setup, you need to disable the default setup in the repository's security settings. Otherwise, GitHub will reject the uploaded SARIF file with an error similar to:

```
CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled
```

After disabling the default setup, the workflow defined in `.github/workflows/codeql.yml` will install dependencies, run tests, and upload the CodeQL results.
