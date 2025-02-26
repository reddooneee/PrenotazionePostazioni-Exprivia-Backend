package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.service.UserService;

@RestController // Indica che questa classe è un controller REST
@RequestMapping("/Users") // Mappa le richieste HTTP che iniziano con "/Users" a questo controller
public class UserController {

    private final UserService userService;

    // Costruttore per iniettare il servizio UserService
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Gestisce le richieste GET per ottenere tutti gli utenti
    @GetMapping
    public List<Users> getUtentiTotali() {
        return userService.cercaTutti(); // Chiama il servizio per ottenere tutti gli utenti
    }

    // Gestisce le richieste GET per ottenere un singolo utente tramite ID
    @GetMapping("/utente")
    public Users getUtente(@RequestParam Long id) {
        return userService.cercaSingolo(id); // Chiama il servizio per ottenere un utente specifico
    }

    // Gestisce le richieste POST per aggiungere un nuovo utente
    @PostMapping
    public ResponseEntity<Users> aggiungiUtente(@RequestBody Users user) {
        Users nuovoUser = userService.aggiungiUser(user); // Chiama il servizio per aggiungere un nuovo utente
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovoUser); // Restituisce una risposta con stato 201 (CREATED) e il nuovo utente
    }

    // Gestisce le richieste PUT per aggiornare un utente esistente tramite ID
    @PutMapping("/{id}")
    public ResponseEntity<Users> aggiornaUser(@PathVariable Long id, @RequestBody Users user) {
        Users userAggiornato = userService.aggiornaUser(id, user); // Chiama il servizio per aggiornare l'utente
        return ResponseEntity.ok(userAggiornato); // Restituisce una risposta con stato 200 (OK) e l'utente aggiornato
    }

    // Gestisce le richieste DELETE per eliminare un utente tramite ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaUser(@PathVariable Long id) {
        userService.eliminaUser(id); // Chiama il servizio per eliminare l'utente
        return ResponseEntity.noContent().build(); // Restituisce una risposta con stato 204 (NO CONTENT)
    }
}
