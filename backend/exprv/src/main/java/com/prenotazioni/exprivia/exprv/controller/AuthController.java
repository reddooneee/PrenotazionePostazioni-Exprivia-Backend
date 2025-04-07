package com.prenotazioni.exprivia.exprv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.service.UserService;

@RestController
public class AuthController {

    private final UserService userService;

    // Costruttore per l'iniezione di dipendenza
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    //Aggiunta verifica errori sul AuthController
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CredentialsDto credentialsDto) {
        try {
            UserDTO user = userService.login(credentialsDto);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenziali non valide");
        }
    }

}
