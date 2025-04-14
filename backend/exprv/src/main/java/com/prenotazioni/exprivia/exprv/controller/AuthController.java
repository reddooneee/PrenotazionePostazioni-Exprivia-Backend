package com.prenotazioni.exprivia.exprv.controller;

import com.prenotazioni.exprivia.exprv.dto.AuthResponseDTO;
import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.security.JwtTokenProvider;
import com.prenotazioni.exprivia.exprv.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    //Aggiunta verifica errori sul AuthController
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody CredentialsDto credentialsDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credentialsDto.email(), credentialsDto.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Genera JWT token
        String token = tokenProvider.generateToken(authentication);

        // Ottieni dati utente
        UserDTO userDTO = userService.cercaPerEmail(credentialsDto.email());

        return ResponseEntity.ok(new AuthResponseDTO(token, userDTO));
    }
}