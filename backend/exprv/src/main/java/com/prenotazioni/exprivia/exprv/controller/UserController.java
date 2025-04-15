package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
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

    // Ottiene tutti gli utenti (visibili come AdminDTO, cioè visione admin)
    @GetMapping
    public ResponseEntity<List<AdminDTO>> getUtentiTotali() {
        List<AdminDTO> utenti = userService.cercaTutti();
        return ResponseEntity.ok(utenti);
    }

    // Ottiene un utente singolo (sempre AdminDTO)
    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getUserById(@PathVariable("id") Integer id) {
        try {
            AdminDTO adminDTO = userService.cercaSingolo(id);
            return ResponseEntity.ok(adminDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Crea un nuovo utente (dati in input come UserDTO)
    @PostMapping("/creaUtente")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO newUser = userService.creaUtente(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Aggiorna un utente esistente (ritorna UserDTO aggiornato)
    @PutMapping("/aggiornaUtente/{id}")
    public ResponseEntity<UserDTO> aggiornaUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            UserDTO updatedUser = userService.aggiornaUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Elimina un utente
    @DeleteMapping("/eliminaUtente/{id}")
    public ResponseEntity<String> eliminaUser(@PathVariable Integer id) {
        try {
            userService.eliminaUser(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
