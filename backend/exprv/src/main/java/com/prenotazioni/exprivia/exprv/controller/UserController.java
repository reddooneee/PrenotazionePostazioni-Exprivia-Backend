package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.service.UserService;

import jakarta.persistence.EntityNotFoundException;

@RestController // Indica che questa classe è un controller REST
@RequestMapping("/Utenti") // Mappa le richieste HTTP che iniziano con "/Users" a questo controller
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(){}
    
    // Costruttore per iniettare il servizio UserService
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Gestisce le richieste GET per ottenere tutti gli utenti
    @GetMapping
    public List<UserDTO> getUtentiTotali() {
        return userService.cercaTutti(); // Chiama il servizio per ottenere tutti gli utenti
    }

    // Gestisce le richieste GET per ottenere un singolo utente tramite ID
    @GetMapping("/utente/{id}")
    public UserDTO getUtente(@PathVariable Integer id) {
        return userService.cercaSingolo(id); // Chiama il servizio per ottenere un utente specifico
    }

    // Gestisce le richieste POST per aggiungere un nuovo utente
    @PostMapping("/creaUtente")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO newUser = userService.creaUtente(userDTO);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Gestisce le richieste PUT per aggiornare un utente esistente tramite ID
    @PutMapping("/aggiornaUtente/{id}")
    public UserDTO aggiornaUser(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        return userService.aggiornaUser(id, updates);
    }

    // Gestisce le richieste DELETE per eliminare un utente tramite ID
    @DeleteMapping("/eliminaUtente/{id}")
    public ResponseEntity<String> eliminaUser(@PathVariable Integer id) {
        try {
            userService.eliminaUser(id);// Chiama il servizio per eliminare l'utente
            return ResponseEntity.noContent().build(); // Restituisce una risposta con stato 204 (NO CONTENT)
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());//Lancia un messaggio se non è stato eliminato l'utente
        }
    }
}
