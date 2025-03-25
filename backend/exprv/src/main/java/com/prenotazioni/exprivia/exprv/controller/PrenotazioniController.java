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
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.service.PrenotazioniService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/Prenotazioni")
public class PrenotazioniController {

    private final PrenotazioniService PrenotazioniService;

    public PrenotazioniController(PrenotazioniService PrenotazioniService) {
        this.PrenotazioniService = PrenotazioniService;
    }

    @GetMapping()
    public List<Prenotazioni> getPrenotazioni() {
        return PrenotazioniService.cercaTutti();
    }

    @GetMapping("/Prenotazioni/{id_prenotazioni}")
    public ResponseEntity<Prenotazioni> getPrenotazioniByID(@PathVariable Integer id_prenotazioni) {
        try {
            Prenotazioni Prenotazioni = PrenotazioniService.cercaSingolo(id_prenotazioni);
            return ResponseEntity.ok(Prenotazioni);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/crea_Prenotazioni")
    public ResponseEntity<?> creaPrenotazioni(@RequestBody Prenotazioni Prenotazioni) {
        try {
            Prenotazioni newPrenotazioni = PrenotazioniService.creaPrenotazioni(Prenotazioni);
            return ResponseEntity.ok(newPrenotazioni);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> aggiornaPrenotazioni(@PathVariable Integer id, @RequestBody Prenotazioni Prenotazioni) {
        try {
            Prenotazioni PrenotazioniAggiornata = PrenotazioniService.aggiornaPrenotazioni(id, Prenotazioni);
            return ResponseEntity.ok(PrenotazioniAggiornata);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/elimina/{id}")
    public ResponseEntity<String> eliminaPrenotazioni(@PathVariable Integer id) {
        try {
            PrenotazioniService.eliminaPrenotazioni(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
