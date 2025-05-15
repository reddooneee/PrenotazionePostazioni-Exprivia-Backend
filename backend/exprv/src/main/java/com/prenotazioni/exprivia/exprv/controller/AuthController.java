package com.prenotazioni.exprivia.exprv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.EmailDTO;
import com.prenotazioni.exprivia.exprv.dto.ResetPasswordRequest;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.dto.UserRegistrationDTO;
import com.prenotazioni.exprivia.exprv.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody CredentialsDto credentialsDto) {
        // Utilizziamo il metodo login del service che ora gestisce sia UserDTO che AdminDTO
        AuthResponseDTO authResponse = authService.login(credentialsDto);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserDTO newUser = authService.creaUtente(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailDTO emailDTO) {
        try {
            authService.forgotPassword(emailDTO);
            return ResponseEntity.ok("Email inviata se l'indirizzo esiste nel sistema.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    // Endpoint per il reset password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            authService.resetPassword(resetPasswordRequest);
            return ResponseEntity.ok("Password Aggiornata Con Successo");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
