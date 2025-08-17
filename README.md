# Inten.to Translator

A simple and fast VS Code extension to translate selected text using the [Inten.to](https://github.com/intento/intento-api) API.

## Features

- Translate highlighted text via the right-click context menu.
- Translate highlighted text with a keyboard shortcut: `Alt+Shift+T`.
- Automatically detects the source language. 
- Copies the translation to your clipboard. 
- Shows the translation in a notification popup.

## Setup

1. **Install the extension.**
2. **Configure the API Key:** 
    - Open VS Code Settings ( `Ctrl/Cmd + ,` ).
    - Search for "Intento".
    - In the `Intento: Api Key` field, enter your API key from your Inten.to account.
3. **Configure Target Language (Optional):** 
    - In the same settings section, change the `Intento: Target Language` to your desired language code (e.g., `ru`, `de`, `fr`). The default is `en`.  

## Usage

1. Highlight any piece of text in the editor.
2. Press `Alt+Shift+T` or right-click and select `Inten.to: Translate`. 
3. The translated text will be copied to your clipboard and displayed in a notification.

**Enjoy!**
