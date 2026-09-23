# 🔊 Syntax Error Sound for Visual Studio Code

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-v1.60%2B-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)](#cross-platform-support)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

A lightweight Visual Studio Code extension that plays your custom audio cue whenever you make a syntax or compilation error while writing code.

---

## ✨ Features

- ⚡ **Instant Error Detection**: Hooks into VS Code's `languages.onDidChangeDiagnostics` API to react immediately to language server error reports.
- 🧘 **Smart Debouncing (800ms)**: Waits until you stop typing so sound never plays in the middle of active editing.
- 🛑 **No Audio Spam**: Only triggers when **new** errors are introduced (i.e. error count increases), and enforces a cooldown between sounds.
- 📢 **Status Bar Toggle**: Displays a status bar item (`📢 Error Sound: ON`) in the bottom-right corner. Click it anytime to toggle mute.
- 🎯 **Multi-Language Support**: Works seamlessly across TypeScript, JavaScript, Python, C++, Go, Rust, Java, HTML/CSS, JSON, and all languages supported by VS Code.
- 🚀 **Zero Heavy Dependencies**: Uses native system audio utilities (`afplay`, `powershell`, `aplay`) without bulky native binaries.

---

## 📥 Installation

### Option 1: Quick Install via Terminal
Run the following command:
```bash
code --install-extension syntax-error-sound-1.0.0.vsix
```

### Option 2: Install from VS Code UI
1. Open VS Code.
2. Press `Cmd + Shift + P` (macOS) or `Ctrl + Shift + P` (Windows/Linux) to open the Command Palette.
3. Type and select **Extensions: Install from VSIX...**.
4. Browse and select `syntax-error-sound-1.0.0.vsix`.
5. Reload VS Code when prompted.

---

## 🛠️ Usage & Commands

All commands can be accessed via the Command Palette (`Cmd + Shift + P` / `Ctrl + Shift + P`):

| Command | Title | Description |
| :--- | :--- | :--- |
| `syntaxErrorSound.testSound` | **Syntax Error Sound: Play Test Sound** | Plays the audio immediately to test your speaker output. |
| `syntaxErrorSound.toggle` | **Syntax Error Sound: Toggle On/Off** | Mutes or unmutes the audio notifications. |

---

## ⚙️ Extension Settings

Customize extension behavior in **Settings** (`Cmd + ,` or `Ctrl + ,`):

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `syntaxErrorSound.enabled` | `boolean` | `true` | Enable or disable audio playback on syntax errors. |
| `syntaxErrorSound.debounceDelay` | `number` | `800` | Milliseconds to wait after typing stops before evaluating diagnostics. |
| `syntaxErrorSound.cooldownDelay` | `number` | `2000` | Minimum milliseconds between audio triggers to prevent overlap. |
| `syntaxErrorSound.onlyActiveDocument` | `boolean` | `true` | Only play audio when errors occur in the currently focused editor. |

---

## 🎵 Changing the Audio File

To change the sound to your own MP3 or WAV file:
1. Replace `sounds/error.mp3` or `sounds/error.wav` with your audio file.
2. Repackage the extension:
   ```bash
   node ../package-vsix.js
   code --install-extension syntax-error-sound-1.0.0.vsix
   ```
3. Reload VS Code.

---

## 🖥️ Cross-Platform Support

| OS | Player Used | Notes |
| :--- | :--- | :--- |
| **macOS** | `afplay` | Built into macOS, zero setup required. |
| **Windows** | `PowerShell` (`System.Media.SoundPlayer`) | Built into Windows, zero setup required. |
| **Linux** | `paplay` / `aplay` | Standard ALSA / PulseAudio sound utilities. |

---

## 📄 License

This extension is licensed under the [MIT License](../LICENSE).
