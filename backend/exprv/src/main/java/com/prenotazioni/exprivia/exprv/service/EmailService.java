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

    @Async("emailTaskExecutor")
    public void sendBookingCancellationEmail(String toEmail, String userName, String roomName, 
                                           String positionName, String startDateTime, String endDateTime) {
        try {
            System.out.println("DEBUG - Inizio invio email annullamento asincrono a: " + toEmail + " (Thread: " + Thread.currentThread().getName() + ")");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Prenotazione Annullata");
            
            String emailBody = String.format(
                "Ciao %s,\n\n" +
                "Ti informiamo che hai annullato la tua prenotazione.\n\n" +
                "Dettagli della prenotazione annullata:\n" +
                "• Stanza: %s\n" +
                "• Postazione: %s\n" +
                "• Data e ora inizio: %s\n" +
                "• Data e ora fine: %s\n\n" +
                "La postazione è ora nuovamente disponibile per altri utenti.\n\n" +
                "Grazie per aver utilizzato il sistema di prenotazioni Exprivia.\n\n" +
                "Cordiali saluti,\n" +
                "Il team Exprivia",
                userName, roomName, positionName, startDateTime, endDateTime
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("DEBUG - Email di annullamento inviata con successo a: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERRORE - Impossibile inviare email di annullamento asincrona a " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async("emailTaskExecutor")
    public void sendBookingCancelledByAdminEmail(String toEmail, String userName, String roomName, 
                                               String positionName, String startDateTime, String endDateTime) {
        try {
            System.out.println("DEBUG - Inizio invio email annullamento admin asincrono a: " + toEmail + " (Thread: " + Thread.currentThread().getName() + ")");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Prenotazione Annullata dall'Amministratore");
            
            String emailBody = String.format(
                "Ciao %s,\n\n" +
                "Ti informiamo che la tua prenotazione è stata annullata dall'amministratore del sistema.\n\n" +
                "Dettagli della prenotazione annullata:\n" +
                "• Stanza: %s\n" +
                "• Postazione: %s\n" +
                "• Data e ora inizio: %s\n" +
                "• Data e ora fine: %s\n\n" +
                "Per maggiori informazioni riguardo questa decisione, ti invitiamo a contattare l'amministratore.\n\n" +
                "La postazione è ora nuovamente disponibile per altri utenti.\n\n" +
                "Cordiali saluti,\n" +
                "Il team Exprivia",
                userName, roomName, positionName, startDateTime, endDateTime
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("DEBUG - Email di annullamento admin inviata con successo a: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERRORE - Impossibile inviare email di annullamento admin asincrona a " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async("emailTaskExecutor")
    public void sendBookingDeletedByAdminEmail(String toEmail, String userName, String roomName, 
                                             String positionName, String startDateTime, String endDateTime) {
        try {
            System.out.println("DEBUG - Inizio invio email eliminazione admin asincrono a: " + toEmail + " (Thread: " + Thread.currentThread().getName() + ")");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Prenotazione Eliminata dall'Amministratore");
            
            String emailBody = String.format(
                "Ciao %s,\n\n" +
                "Ti informiamo che la tua prenotazione è stata eliminata dall'amministratore del sistema.\n\n" +
                "Dettagli della prenotazione eliminata:\n" +
                "• Stanza: %s\n" +
                "• Postazione: %s\n" +
                "• Data e ora inizio: %s\n" +
                "• Data e ora fine: %s\n\n" +
                "Per maggiori informazioni riguardo questa decisione, ti invitiamo a contattare l'amministratore.\n\n" +
                "La postazione è ora nuovamente disponibile per altri utenti.\n\n" +
                "Cordiali saluti,\n" +
                "Il team Exprivia",
                userName, roomName, positionName, startDateTime, endDateTime
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("DEBUG - Email di eliminazione admin inviata con successo a: " + toEmail);
        } catch (Exception e) {
            System.err.println("ERRORE - Impossibile inviare email di eliminazione admin asincrona a " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

}
