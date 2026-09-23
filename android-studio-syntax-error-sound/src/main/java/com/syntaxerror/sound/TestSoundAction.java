package com.syntaxerror.sound;

import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.ui.Messages;
import org.jetbrains.annotations.NotNull;

public class TestSoundAction extends AnAction {

    @Override
    public void actionPerformed(@NotNull AnActionEvent e) {
        SyntaxErrorSoundService service = SyntaxErrorSoundService.getInstance();
        if (service != null) {
            service.playSound(true);
        }
        Messages.showInfoMessage(
            e.getProject(),
            "Playing syntax error sound!",
            "Syntax Error Sound"
        );
    }
}
