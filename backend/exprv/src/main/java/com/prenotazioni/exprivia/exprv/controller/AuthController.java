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

    @PostMapping("/login")  // Aggiunto "/" per maggiore chiarezza
    public ResponseEntity<UserDTO> login(@RequestBody CredentialsDto credentialsDto) {
        UserDTO user = userService.login(credentialsDto); // Chiamata corretta sull'istanza
        return ResponseEntity.ok(user);
    }
}