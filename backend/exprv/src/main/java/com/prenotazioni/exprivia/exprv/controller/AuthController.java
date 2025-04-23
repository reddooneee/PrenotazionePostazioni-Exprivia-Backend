package com.prenotazioni.exprivia.exprv.controller;

import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.EmailDTO;
import com.prenotazioni.exprivia.exprv.dto.ResetPasswordRequest;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.service.UserService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.service.PasswordResetService;
import com.prenotazioni.exprivia.exprv.service.EmailService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody CredentialsDto credentialsDto) {
        // Utilizziamo il metodo login del service che ora gestisce sia UserDTO che AdminDTO
        AuthResponseDTO authResponse = userService.login(credentialsDto);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO newUser = userService.creaUtente(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailDTO emailDTO) {
        String email = emailDTO.getEmail().trim();
        Optional<Users> userOpt = userRepository.findByEmailIgnoreCase(email); // Verifica prima se l'utente esiste
        //System Out Di Debug per verificare l'email ricevuta
        System.out.println("Email ricevuta: " + email);
        System.out.println("Utente trovato: " + userOpt.isPresent());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email non trovata nel sistema");
        }

        // Ora puoi generare il token di reset
        String token = passwordResetService.createResetToken(emailDTO.getEmail());

        // Invia l'email
        emailService.sendPasswordResetEmail(email, token);

        return ResponseEntity.ok("Email inviata se l'indirizzo esiste nel sistema.");
    }

    // Endpoint per il reset password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        // Verifica il token e ottieni l'utente
        Optional<Users> userOpt = passwordResetService.validateToken(resetPasswordRequest.getToken());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token non valido o scaduto");
        }

        Users user = userOpt.get();

        // Verifica che la nuova password non sia null o vuota
        if (resetPasswordRequest.getNewPassword() == null || resetPasswordRequest.getNewPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La password non può essere vuota");
        }

        // Usa BCrypt per fare l'hash della password
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(resetPasswordRequest.getNewPassword());

        // Imposta la password hashata sull'utente
        user.setPassword(hashedPassword);

        // Log per il debug: visualizza la password che viene ricevuta
        System.out.println("Nuova password ricevuta: " + resetPasswordRequest.getNewPassword());

        // Log per il debug: visualizza la password dopo che è stata hashata
        System.out.println("Password dopo hashing: " + hashedPassword);

        //Salva l'utente con la nuova password
        userRepository.save(user);

        // Invalida il token dopo averlo usato
        passwordResetService.invalidateToken(resetPasswordRequest.getToken());

        return ResponseEntity.ok("Password aggiornata con successo");
    }
}
