# GPT Chrome Extension

This extension allows you to highlight text on any web page and obtain an explanation from OpenAI's GPT-4o model.

## Setup

1. Clone this repository.
2. In Chrome, open **chrome://extensions**, enable developer mode and load the extension's directory.
3. When you first use the extension it will prompt for your OpenAI API key.
   The key is stored with Chrome's local storage and never leaves your machine.
4. Select any text on a page and click **Analyze with OpenAI**.

The selected text will be sent to the GPT-4o API and the response will be displayed in an alert.
