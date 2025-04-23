package com.prenotazioni.exprivia.exprv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:8080/auth/reset-password?token=" + token; // ← URL frontend

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset della password");
        message.setText("Clicca sul seguente link per reimpostare la tua password:\n\n" + resetUrl);

        mailSender.send(message);
    }
}
