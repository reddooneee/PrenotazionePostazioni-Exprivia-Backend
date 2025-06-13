package com.prenotazioni.exprivia.exprv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = "http://localhost:4200/reset-password?token=" + token; // ← URL frontend

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset della password");
        message.setText("Clicca sul seguente link per reimpostare la tua password:\n\n" + resetUrl);

        mailSender.send(message);
    }

    @Async("emailTaskExecutor")
    public void sendBookingConfirmationEmail(String toEmail, String userName, String roomName, 
                                           String positionName, String startDateTime, String endDateTime) {
        try {
            System.out.println("DEBUG - Inizio invio email asincrono a: " + toEmail + " (Thread: " + Thread.currentThread().getName() + ")");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Conferma Prenotazione Postazione");
            
            String emailBody = String.format(
                "Ciao %s,\n\n" +
                "La tua prenotazione è stata confermata con successo!\n\n" +
                "Dettagli della prenotazione:\n" +
                "• Stanza: %s\n" +
                "• Postazione: %s\n" +
                "• Data e ora inizio: %s\n" +
                "• Data e ora fine: %s\n\n" +
                "Ti ricordiamo di presentarti in orario.\n\n" +
                "Grazie per aver utilizzato il sistema di prenotazioni Exprivia.\n\n" +
                "Cordiali saluti,\n" +
                "Il team Exprivia",
                userName, roomName, positionName, startDateTime, endDateTime
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("DEBUG - Email di conferma inviata con successo a: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERRORE - Impossibile inviare email di conferma asincrona a " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

}
