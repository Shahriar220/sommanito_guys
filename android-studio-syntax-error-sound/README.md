# 🤖 Syntax Error Sound for Android Studio & IntelliJ

[![IntelliJ Platform](https://img.shields.io/badge/Platform-IntelliJ%20%7C%20Android%20Studio-000000?logo=intellijidea&logoColor=white)](https://plugins.jetbrains.com/)
[![Android Studio](https://img.shields.io/badge/Android%20Studio-2024%20%7C%202025%20%7C%202026%2B-3DDC84?logo=androidstudio&logoColor=white)](https://developer.android.com/studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

An IntelliJ Platform and Android Studio plugin that plays your custom error audio cue whenever you make a syntax or compilation error while writing code.

---

## ✨ Features

- 🎯 **Native IDE Integration**: Hooks directly into IntelliJ Platform's `WolfTheProblemSolver.ProblemListener` topic, triggering instantly when Android Studio's code analyzer detects problem files.
- 🌐 **All Languages Supported**: Works across Kotlin, Java, XML, Gradle (KTS/Groovy), C/C++, JSON, and any language supported by Android Studio.
- 🛡️ **Thread-Safe & Non-Blocking**: Audio is decoded and played asynchronously on a background worker thread (`SyntaxErrorSoundThread`), ensuring the IDE UI remains buttery smooth.
- 🛑 **Anti-Spam Cooldown**: Built-in 2000ms atomic cooldown prevents audio overlap or stuttering.
- 🛠️ **Test Action in Menu**: Test the sound output anytime from **Tools** -> **Play Syntax Error Sound Test**.
- 🔄 **Multi-Engine Audio Playback**: Uses standard Java `javax.sound.sampled.AudioSystem` with an automatic fallback to macOS native `afplay` or system audio players.

---

## 📥 Installation

### Method 1: Install from Disk (Recommended)
1. In Android Studio, open **Settings** (or **Preferences** on macOS).
2. Navigate to **Plugins**.
3. Click the gear icon (⚙️) next to the "Installed" tab and select **Install Plugin from Disk...**.
4. Choose the prebuilt ZIP package:
   ```
   build/distributions/syntax-error-sound-plugin.zip
   ```
5. Click **OK** and restart Android Studio.

### Method 2: Direct Directory Copy
You can drop `syntax-error-sound.jar` into your Android Studio plugins folder:
```bash
# macOS
mkdir -p ~/Library/Application\ Support/Google/AndroidStudio2026.1/plugins/syntax-error-sound/lib
cp build/distributions/syntax-error-sound.jar ~/Library/Application\ Support/Google/AndroidStudio2026.1/plugins/syntax-error-sound/lib/

# Linux
mkdir -p ~/.local/share/Google/AndroidStudio2026.1/syntax-error-sound/lib
cp build/distributions/syntax-error-sound.jar ~/.local/share/Google/AndroidStudio2026.1/syntax-error-sound/lib/

# Windows
# %APPDATA%\Google\AndroidStudio2026.1\plugins\syntax-error-sound\lib\
```
Then restart Android Studio.

---

## 🧪 Testing the Plugin

1. Go to the top menu in Android Studio:
   - **Tools** -> **Play Syntax Error Sound Test**.
   - A dialog will confirm the audio is playing.
2. In any open Kotlin (`.kt`) or Java (`.java`) file:
   - Introduce an intentional syntax error (e.g. type `val x = ;` or remove a closing brace).
   - Once Android Studio marks the code with a red squiggly line, the sound will play!

---

## 🛠️ Building From Source

This project includes a one-click build script that compiles against Android Studio's bundled JetBrains Runtime (JBR) and libraries with zero external downloads:

```bash
./build.sh
```

The script automatically:
1. Compiles Java source files with `javac` against Android Studio's classpath.
2. Bundles the audio resources and `plugin.xml`.
3. Packages `syntax-error-sound.jar` and `syntax-error-sound-plugin.zip`.
4. Deploys the built JAR directly to your local Android Studio plugins directory.

---

## 🎵 Changing the Audio File

To change the sound:
1. Place your new sound file as `error.wav` in `src/main/resources/sounds/error.wav`.
2. Re-run:
   ```bash
   ./build.sh
   ```
3. Restart Android Studio.

---

## 📂 Project Structure

```
├── build.sh                               # One-click build and deploy script
├── README.md                              # This documentation
├── src/main/
│   ├── java/com/syntaxerror/sound/
│   │   ├── SyntaxErrorSoundService.java   # Audio player & cooldown management
│   │   ├── SyntaxErrorProblemListener.java# ProblemListener for syntax errors
│   │   └── TestSoundAction.java           # Tools menu test action
│   └── resources/
│       ├── META-INF/
│       │   └── plugin.xml                 # IntelliJ plugin descriptor
│       └── sounds/
│           ├── error.wav                  # Bundled PCM WAV audio
│           └── error.mp3                  # Bundled MP3 audio
└── build/distributions/
    ├── syntax-error-sound.jar             # Compiled plugin JAR
    └── syntax-error-sound-plugin.zip      # Installable plugin distribution
```

---

## 📄 License

This plugin is licensed under the [MIT License](../LICENSE).
