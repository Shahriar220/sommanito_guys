const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let lastPlayedTime = 0;
let debounceTimer = null;
const errorCountPerFile = new Map();
let statusBarItem = null;

function getSoundFilePath(context) {
    const mp3Path = path.join(context.extensionPath, 'sounds', 'error.mp3');
    if (fs.existsSync(mp3Path)) {
        return mp3Path;
    }
    const wavPath = path.join(context.extensionPath, 'sounds', 'error.wav');
    if (fs.existsSync(wavPath)) {
        return wavPath;
    }
    return null;
}

function playSound(context, force = false) {
    const config = vscode.workspace.getConfiguration('syntaxErrorSound');
    const enabled = config.get('enabled', true);
    if (!enabled && !force) {
        return;
    }

    const cooldownDelay = config.get('cooldownDelay', 2000);
    const now = Date.now();
    if (!force && (now - lastPlayedTime < cooldownDelay)) {
        return;
    }

    const soundFile = getSoundFilePath(context);
    if (!soundFile) {
        vscode.window.showWarningMessage('Syntax Error Sound: Audio file not found.');
        return;
    }

    lastPlayedTime = now;

    const platform = process.platform;
    try {
        if (platform === 'darwin') {
            spawn('afplay', [soundFile], { stdio: 'ignore', detached: true }).unref();
        } else if (platform === 'win32') {
            const psCommand = `(New-Object Media.SoundPlayer '${soundFile}').PlaySync();`;
            spawn('powershell', ['-c', psCommand], { stdio: 'ignore', detached: true }).unref();
        } else {
            // Linux fallback
            const player = fs.existsSync('/usr/bin/paplay') ? 'paplay' : 'aplay';
            spawn(player, [soundFile], { stdio: 'ignore', detached: true }).unref();
        }
    } catch (err) {
        console.error('Syntax Error Sound failed to play:', err);
    }
}

function updateStatusBar(enabled) {
    if (!statusBarItem) return;
    if (enabled) {
        statusBarItem.text = '$(megaphone) Error Sound: ON';
        statusBarItem.tooltip = 'Syntax Error Sound is Active. Click to turn OFF.';
    } else {
        statusBarItem.text = '$(mute) Error Sound: OFF';
        statusBarItem.tooltip = 'Syntax Error Sound is Muted. Click to turn ON.';
    }
    statusBarItem.show();
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Syntax Error Sound extension activated.');

    // Status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'syntaxErrorSound.toggle';
    const config = vscode.workspace.getConfiguration('syntaxErrorSound');
    updateStatusBar(config.get('enabled', true));
    context.subscriptions.push(statusBarItem);

    // Command: Test sound
    const testCmd = vscode.commands.registerCommand('syntaxErrorSound.testSound', () => {
        playSound(context, true);
        vscode.window.showInformationMessage('🔊 Testing syntax error sound!');
    });
    context.subscriptions.push(testCmd);

    // Command: Toggle sound
    const toggleCmd = vscode.commands.registerCommand('syntaxErrorSound.toggle', async () => {
        const currentConfig = vscode.workspace.getConfiguration('syntaxErrorSound');
        const currentState = currentConfig.get('enabled', true);
        await currentConfig.update('enabled', !currentState, vscode.ConfigurationTarget.Global);
        updateStatusBar(!currentState);
        vscode.window.showInformationMessage(`Syntax Error Sound is now ${!currentState ? 'ON' : 'OFF'}.`);
    });
    context.subscriptions.push(toggleCmd);

    // Watch configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('syntaxErrorSound.enabled')) {
                const isEnabled = vscode.workspace.getConfiguration('syntaxErrorSound').get('enabled', true);
                updateStatusBar(isEnabled);
            }
        })
    );

    // Initialize initial error counts for open documents
    vscode.workspace.textDocuments.forEach(doc => {
        const diags = vscode.languages.getDiagnostics(doc.uri);
        const errorCount = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
        errorCountPerFile.set(doc.uri.toString(), errorCount);
    });

    // Clean up when documents close
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => {
            errorCountPerFile.delete(doc.uri.toString());
        })
    );

    // Listen to diagnostics changes (where compiler/syntax errors appear)
    const diagListener = vscode.languages.onDidChangeDiagnostics(event => {
        const currentConfig = vscode.workspace.getConfiguration('syntaxErrorSound');
        if (!currentConfig.get('enabled', true)) {
            return;
        }

        const debounceDelay = currentConfig.get('debounceDelay', 800);
        const onlyActive = currentConfig.get('onlyActiveDocument', true);
        const activeUri = vscode.window.activeTextEditor?.document.uri.toString();

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            let newlyIntroducedError = false;

            for (const uri of event.uris) {
                const uriKey = uri.toString();
                // Filter only active document if configured
                if (onlyActive && activeUri && uriKey !== activeUri) {
                    continue;
                }

                const allDiags = vscode.languages.getDiagnostics(uri);
                const currentErrorCount = allDiags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
                const prevErrorCount = errorCountPerFile.get(uriKey) || 0;

                if (currentErrorCount > prevErrorCount) {
                    newlyIntroducedError = true;
                }

                errorCountPerFile.set(uriKey, currentErrorCount);
            }

            if (newlyIntroducedError) {
                playSound(context, false);
            }
        }, debounceDelay);
    });

    context.subscriptions.push(diagListener);
}

function deactivate() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
}

module.exports = {
    activate,
    deactivate
};
