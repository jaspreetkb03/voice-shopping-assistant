# Voice Command Shopping Assistant

Simple single-page web app that accepts voice commands to manage a shopping list.

## How to run locally
1. Open a terminal in this folder.
2. Start a simple static server (any of these):
   - `python -m http.server 8000` (then open http://127.0.0.1:8000)
   - or `npx http-server -c-1` (if you have node)
3. Use Chrome/Edge for best speech support.

## Features
- Voice add/remove/search (Web Speech API)
- Quantity parsing and auto-categorization
- Suggestions from local history and seasonal list
- Persistent via localStorage
