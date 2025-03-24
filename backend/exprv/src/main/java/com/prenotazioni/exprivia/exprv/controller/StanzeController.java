//STANZE CONTROLLER
package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.service.PrenotazioniService;
//import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;
import com.prenotazioni.exprivia.exprv.service.StanzeService;

import jakarta.persistence.EntityNotFoundException;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/Stanze")
public class StanzeController {

    // private StanzeRepository stanzeRepository;
    private final StanzeService StanzeService;

    //Costruttore Per Iniettare Il Servizio
    public StanzeController(StanzeService StanzeService) {
        this.StanzeService = StanzeService;
    }

    //Gestione Richieste Get Per Ottenere Tutte Le Stanze
    @GetMapping()
    public List<Stanze> getStanzeTotali() {
        return StanzeService.cercaStanze();
        // Chiama Il Servizio Scritto in precedenza per ottenere tutte le stanze   
    }

    //Richiesta GET per ricevere una stanza in abse all'ID
    @GetMapping("/stanze/{id_stanza}")
    public ResponseEntity<Stanze> getStanzeByID(@PathVariable("id_stanza") Integer id_stanza) {
        try {
            Stanze Stanze = StanzeService.cercaStanzaSingola(id_stanza);
            return ResponseEntity.ok(Stanze);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /* // Richiesta GET per ricevere stanze filtrate per classe
    @GetMapping("/stanze/classe/{classe}")
    public ResponseEntity<List<Stanze>> getStanzeByClasse(@PathVariable("classe") String classe) {
        try {
            List<Stanze> stanze = StanzeService.cercaStanzePerClasse(classe);
            return ResponseEntity.ok(stanze);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
     */
    //Richiesta POST per creare una stanza
    @PostMapping("/creaStanza")
    public ResponseEntity<?> creaStanza(@RequestBody Stanze stanze) {
        try {
            Stanze newStanza = StanzeService.creaStanze(stanze);
            return ResponseEntity.ok(newStanza);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Gestisce Le Richieste PUT per aggiornare una Stanza tramite ID
    @PutMapping("/aggiornastanza/{id}")
    public ResponseEntity<?> aggiornaStanza(@PathVariable("id") Integer id_stanza, @RequestBody Stanze updates) {
        try {
            Stanze updatedStanza = StanzeService.aggiornaStanze(id_stanza, updates);
            return ResponseEntity.ok(updatedStanza);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminastanza/{id}")
    public ResponseEntity<String> eliminaStanza(@PathVariable Integer id
    ) {
        try {
            StanzeService.eliminaStanze(id); //Chiama Il Servizio Per eliminare l'utente
            return ResponseEntity.noContent().build(); // Restituisce una risposta con stato 204 (NO CONTENT)
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            //Manda Un Messaggio se non é stato eliminato l'utente
        }
    }
}
