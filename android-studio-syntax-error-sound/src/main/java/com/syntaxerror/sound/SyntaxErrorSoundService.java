package com.syntaxerror.sound;

import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.components.Service;
import com.intellij.openapi.diagnostic.Logger;

import javax.sound.sampled.*;
import java.io.BufferedInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

@Service(Service.Level.APP)
public final class SyntaxErrorSoundService {
    private static final Logger LOG = Logger.getInstance(SyntaxErrorSoundService.class);
    private final AtomicBoolean isPlaying = new AtomicBoolean(false);
    private final AtomicLong lastPlayedTime = new AtomicLong(0);
    private static final long COOLDOWN_MS = 2000;

    public static SyntaxErrorSoundService getInstance() {
        return ApplicationManager.getApplication().getService(SyntaxErrorSoundService.class);
    }

    public void playSound(boolean force) {
        long now = System.currentTimeMillis();
        if (!force && (now - lastPlayedTime.get() < COOLDOWN_MS)) {
            return;
        }

        if (!isPlaying.compareAndSet(false, true)) {
            return;
        }

        lastPlayedTime.set(now);

        new Thread(() -> {
            try {
                boolean played = playUsingAudioSystem();
                if (!played) {
                    playUsingSystemPlayer();
                }
            } catch (Throwable t) {
                LOG.warn("Failed to play syntax error sound via AudioSystem, falling back to system player", t);
                try {
                    playUsingSystemPlayer();
                } catch (Throwable t2) {
                    LOG.error("Failed to play syntax error sound", t2);
                }
            } finally {
                isPlaying.set(false);
            }
        }, "SyntaxErrorSoundThread").start();
    }

    private boolean playUsingAudioSystem() {
        try (InputStream raw = getClass().getResourceAsStream("/sounds/error.wav")) {
            if (raw == null) {
                LOG.warn("Audio file /sounds/error.wav not found in plugin resources");
                return false;
            }
            try (InputStream bis = new BufferedInputStream(raw);
                 AudioInputStream ais = AudioSystem.getAudioInputStream(bis)) {
                AudioFormat format = ais.getFormat();
                DataLine.Info info = new DataLine.Info(Clip.class, format);
                if (!AudioSystem.isLineSupported(info)) {
                    return false;
                }
                try (Clip clip = (Clip) AudioSystem.getLine(info)) {
                    clip.open(ais);
                    clip.start();
                    long durationMs = clip.getMicrosecondLength() / 1000;
                    Thread.sleep(Math.min(durationMs + 100, 4000));
                    return true;
                }
            }
        } catch (Throwable e) {
            LOG.warn("AudioSystem error: " + e.getMessage());
            return false;
        }
    }

    private void playUsingSystemPlayer() {
        try {
            String os = System.getProperty("os.name", "").toLowerCase();
            Path tempSound = Files.createTempFile("syntax_error_sound_", ".wav");
            tempSound.toFile().deleteOnExit();
            try (InputStream in = getClass().getResourceAsStream("/sounds/error.wav")) {
                if (in != null) {
                    Files.copy(in, tempSound, StandardCopyOption.REPLACE_EXISTING);
                } else {
                    return;
                }
            }
            if (os.contains("mac")) {
                new ProcessBuilder("afplay", tempSound.toString()).start().waitFor();
            } else if (os.contains("win")) {
                new ProcessBuilder("powershell", "-c", "(New-Object Media.SoundPlayer '" + tempSound + "').PlaySync();").start().waitFor();
            } else {
                new ProcessBuilder("aplay", tempSound.toString()).start().waitFor();
            }
        } catch (Throwable t) {
            LOG.error("System audio playback fallback error", t);
        }
    }
}
