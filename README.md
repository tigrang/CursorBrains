# CursorBrains

## Install

```sh
npm install
npm run build
npm run package-extension
npm run install-extension
```

## Extensions

```
cursor --install-extension compassak.intellij-idea-new-ui
cursor --install-extension chadalen.vscode-jetbrains-icon-theme
cursor --install-extension k--kato.intellij-idea-keybindings
cursor --install-extension garroter.spyglass
cursor --install-extension bwya77.islands-dark
cursor --install-extension bmewburn.vscode-intelephense-client
cursor --install-extension buenon.scratchpads
cursor --install-extension usernamehw.errorlens
cursor --install-extension JamiTech.simply-blame
cursor --install-extension bradlc.vscode-tailwindcss
cursor --install-extension git-brain.git-brain
brew install --cask font-inter
```

## Setup
Use [settings.json](settings.json) for **Preferences: Open User Settings (JSON)** and [keybindings.json](keybindings.json) for **Preferences: Open Keyboard Shortcuts (JSON)**.

Open **Developer: Toggle Developer Tools**, select **Console**, paste `dist/cursorbrains.js`, and run it.


Open scripts/cursor_run_last_command.applescript, File > Export > Application (Run-only + Sign to Run Locally).
Save to $HOME/Applications/CursorRunLastCommand.app

```
{
    "version": 1,
    "hooks": {
      "workspaceOpen": [
        {
          "command": "open \"$HOME/Applications/CursorRunLastCommand.app\""
        }
      ]
    }
  }
```