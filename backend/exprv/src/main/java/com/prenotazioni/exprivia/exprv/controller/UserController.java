package com.prenotazioni.exprivia.exprv.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.service.UserService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/utenti")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserDTO user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/aggiorna/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            UserDTO updatedUser = userService.aggiornaUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utente non trovato");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accesso negato");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
