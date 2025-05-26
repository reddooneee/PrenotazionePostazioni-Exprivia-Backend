package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.prenotazioni.exprivia.exprv.dto.UserRegistrationDTO;
import com.prenotazioni.exprivia.exprv.service.AdminService;
import com.prenotazioni.exprivia.exprv.service.UserService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    public AdminController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
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

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserDTO newUser = userService.creaUser(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/aggiorna_utente/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            AdminDTO updatedUser = adminService.aggiornaUserByAdmin(id, updates);
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
    public ResponseEntity<?> register(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        try {
            System.out.println("Dati ricevuti nel controller admin: " + userRegistrationDTO);
            System.out.println("Tipo authorities: " + (userRegistrationDTO.getAuthorities() != null
                    ? userRegistrationDTO.getAuthorities().getClass().getName()
                    : "null"));
            System.out.println("Authorities ricevute: " + userRegistrationDTO.getAuthorities());

            System.out.println("Authorities: " + userRegistrationDTO.getAuthorities());

            UserDTO newUser = adminService.creaUtenteAdmin(userRegistrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
