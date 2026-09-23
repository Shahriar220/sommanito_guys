# 🚨 Syntax Error Sound Extensions

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visualstudiocode)](vscode-syntax-error-sound/)
[![Android Studio](https://img.shields.io/badge/Android%20Studio-Plugin-3DDC84?logo=androidstudio&logoColor=white)](android-studio-syntax-error-sound/)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)](#compatibility)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Never miss a syntax error again! Plays your favorite dramatic audio cue whenever you introduce a syntax or compilation error while writing code.

---

## 📦 What's Included

This repository contains two production-ready extensions powered by the same audio file:

| Project | IDE | Language / Tech | Status |
| :--- | :--- | :--- | :--- |
| [**`vscode-syntax-error-sound/`**](./vscode-syntax-error-sound/) | **Visual Studio Code** | JavaScript / Node.js (`afplay`, PowerShell, aplay) | ✅ Packaged (`.vsix`) & Installed |
| [**`android-studio-syntax-error-sound/`**](./android-studio-syntax-error-sound/) | **Android Studio / IntelliJ** | Java (`javax.sound.sampled` + `ProblemListener`) | ✅ Packaged (`.zip`) & Installed |

---

## 🌟 Key Features

- 🔊 **Instant Audio Feedback**: Plays audio the moment syntax errors are detected.
- ⚡ **Typing Debounce**: Intelligent delay (800ms) waits until you pause typing so audio never interrupts your active keystrokes.
- 🛡️ **Spam Prevention & Cooldown**: Includes a 2000ms cooldown and error delta tracking—only plays when **new** errors are introduced.
- 🎯 **Language Agnostic**:
  - In **VS Code**: Works with JavaScript, TypeScript, Python, C++, Go, Rust, Java, and all installed language servers.
  - In **Android Studio**: Works with Kotlin, Java, XML, Gradle, C++, and all IntelliJ-supported languages.
- 🎛️ **Quick Toggle & Status**: Status bar controls in VS Code and dedicated test actions in Android Studio's Tools menu.
- 💻 **Zero Heavy Dependencies**: Uses native OS audio engines (`afplay` on macOS, `PowerShell` on Windows, and `aplay` on Linux).

---

## 🚀 Quick Start & Installation

### 1. Visual Studio Code
Run this command in your terminal:
```bash
code --install-extension vscode-syntax-error-sound/syntax-error-sound-1.0.0.vsix
```
*Or in VS Code:* Press `Cmd + Shift + P` -> **Extensions: Install from VSIX...** -> Select `vscode-syntax-error-sound/syntax-error-sound-1.0.0.vsix`.

👉 See full instructions in [VS Code Extension README](./vscode-syntax-error-sound/README.md).

---

### 2. Android Studio
1. In Android Studio, open **Settings** (or **Preferences** on macOS) -> **Plugins**.
2. Click the gear icon (⚙️) at the top and select **Install Plugin from Disk...**.
3. Choose `android-studio-syntax-error-sound/build/distributions/syntax-error-sound-plugin.zip`.
4. Click **OK** and restart Android Studio.

👉 See full instructions in [Android Studio Plugin README](./android-studio-syntax-error-sound/README.md).

---

## 🎵 Customizing the Audio

Want to use a different meme or error sound? You can easily replace the audio file:

1. Place your new sound file as `error.mp3` or `error.wav` in:
   - `vscode-syntax-error-sound/sounds/`
   - `android-studio-syntax-error-sound/src/main/resources/sounds/`
2. **For VS Code**: Repackage using:
   ```bash
   node package-vsix.js
   code --install-extension vscode-syntax-error-sound/syntax-error-sound-1.0.0.vsix
   ```
3. **For Android Studio**: Rebuild and deploy using:
   ```bash
   ./android-studio-syntax-error-sound/build.sh
   ```

---

## 📂 Repository Structure

```
├── README.md                              # Main repository overview (this file)
├── LICENSE                                # MIT License
├── package-vsix.js                        # Standalone VSIX packager script
├── error.mp3                              # Master MP3 audio asset
├── error.wav                              # Master WAV audio asset
│
├── vscode-syntax-error-sound/             # VS Code extension project
│   ├── README.md                          # Extension documentation
│   ├── package.json                       # Extension manifest & settings
│   ├── extension.js                       # Diagnostics listener & audio player
│   ├── syntax-error-sound-1.0.0.vsix      # Prebuilt installable package
│   └── sounds/                            # Bundled audio files
│
└── android-studio-syntax-error-sound/     # Android Studio plugin project
    ├── README.md                          # Plugin documentation
    ├── build.sh                           # One-click build & deploy script
    ├── src/main/java/com/syntaxerror/sound/
    │   ├── SyntaxErrorSoundService.java   # Audio player & cooldown service
    │   ├── SyntaxErrorProblemListener.java# WolfTheProblemSolver event listener
    │   └── TestSoundAction.java           # Tools menu test action
    ├── src/main/resources/
    │   ├── META-INF/plugin.xml            # IntelliJ descriptor
    │   └── sounds/                        # Bundled audio files
    └── build/distributions/
        └── syntax-error-sound-plugin.zip  # Prebuilt installable plugin
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
