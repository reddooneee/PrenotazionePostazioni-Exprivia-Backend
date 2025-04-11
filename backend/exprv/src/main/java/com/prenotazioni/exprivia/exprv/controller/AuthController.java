package com.prenotazioni.exprivia.exprv.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.CredentialsDto;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.service.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CredentialsDto credentialsDto) {

        UserDTO userDTO = userService.login(credentialsDto);
        UserDetails userDetails = userService.loadUserByUsername(credentialsDto.email());

    }
}
