package com.prenotazioni.exprivia.exprv.controller;

import com.prenotazioni.exprivia.exprv.entity.Prenotazione;
import com.prenotazioni.exprivia.exprv.service.PrenotazioneService;

import java.util.List;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/Prenotazioni")
public class PrenotazioniController {
    
    private PrenotazioneService prenotazioneService;

    public PrenotazioniController(PrenotazioneService prenotazioneService){
        this.prenotazioneService = prenotazioneService;
    }

    @GetMapping()
    public List<Prenotazione> getPrenotazioni() {
        return prenotazioneService.cercaTutti();
    }

    @GetMapping("/prenotazione/{id_prenotazioni}")
    public ResponseEntity<Prenotazione> getPrenotazioneByID(@PathVariable Integer id_prenotazioni) {
        try {
            Prenotazione prenotazione = prenotazioneService.cercaSingolo(id_prenotazioni);
            return ResponseEntity.ok(prenotazione);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

        @PostMapping("/crea_prenotazione")
    public ResponseEntity<?> creaPrenotazione(@RequestBody Prenotazione prenotazione) {        
        try {
            Prenotazione newPrenotazione = prenotazioneService.creaPrenotazione(prenotazione);
            return ResponseEntity.ok(newPrenotazione);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> aggiornaPrenotazione(@PathVariable Integer id, @RequestBody Prenotazione prenotazione) {
        try{
            Prenotazione prenotazioneAggiornata = prenotazioneService.aggiornaPrenotazione(id, prenotazione);
            return ResponseEntity.ok(prenotazioneAggiornata);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminaPrenotazione(@PathVariable Integer id){
        try{
            prenotazioneService.eliminaPrenotazione(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
