package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import com.prenotazioni.exprivia.exprv.service.AdminService;
import com.prenotazioni.exprivia.exprv.service.AuthService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @Autowired
    private AdminDTO adminDTO;

    @Autowired
    private AdminService adminService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/utenti")
    public ResponseEntity<List<AdminDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.cercaTutti());
    }

    @GetMapping("/utente/{id}")
    public ResponseEntity<AdminDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.cercaSingolo(id));
    }

    @GetMapping("/utente/email/{email}")
    public ResponseEntity<AdminDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.cercaPerEmail(email));
    }

    @PostMapping("/utente")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO newUser = userService.creaUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/utente/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            UserDTO updatedUser = userService.aggiornaUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utente non trovato");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/utente/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.eliminaUser(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utente non trovato");
        }
    }

    @PostMapping("/crea_utente")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            AdminDTO newUser = adminService.creaUtenteAdmin(adminDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
