package com.syntaxerror.sound;

import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.problems.ProblemListener;
import org.jetbrains.annotations.NotNull;

public class SyntaxErrorProblemListener implements ProblemListener {

    @Override
    public void problemsAppeared(@NotNull VirtualFile file) {
        SyntaxErrorSoundService service = SyntaxErrorSoundService.getInstance();
        if (service != null) {
            service.playSound(false);
        }
    }

    @Override
    public void problemsChanged(@NotNull VirtualFile file) {
        // Can optionally trigger on changed, but problemsAppeared handles the introduction of errors.
    }

    @Override
    public void problemsDisappeared(@NotNull VirtualFile file) {
        // Error resolved
    }
}
