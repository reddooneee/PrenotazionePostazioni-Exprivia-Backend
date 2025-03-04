package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import com.prenotazioni.exprivia.exprv.entity.Prenotazione;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioneRepository;

import jakarta.persistence.EntityNotFoundException;

public class PrenotazioneService {

    private PrenotazioneRepository prenotazioneRepository;

    public PrenotazioneService(PrenotazioneRepository prenotazioneRepository) {
        this.prenotazioneRepository = prenotazioneRepository;
    }

    //findall Tutte le prenotazioni
    public List<Prenotazione> cercaTutti() {
        return prenotazioneRepository.findAll();
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Prenotazione cercaSingolo(Integer id) {
        return prenotazioneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione con id " + id + " non trovata."));
    }

    //Creazione nuova prenotazione con enum -> stringa -> enum 
    public Prenotazione creaPrenotazione(Prenotazione prenotazione) {
        //Condizioni per i NOT NULL 

        if (prenotazione.getId_prenotazioni() == null) {
            throw new IllegalArgumentException("L'ID non può essere nullo!");
        }

        if (prenotazione.getStanza() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (prenotazione.getUser() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (prenotazione.getStato_prenotazione() == null) {
            throw new IllegalArgumentException("Lo stato della prenotazione non può essere nullo!");
        }

        if (prenotazione.getId_prenotazioni() != null && prenotazioneRepository.existsById(prenotazione.getId_prenotazioni())) {
            throw new IllegalArgumentException("La prenotazione con ID " + prenotazione.getId_prenotazioni() + " esiste già.");
        }

        return prenotazioneRepository.save(prenotazione);
    }

    public Prenotazione aggiornaPrenotazione(Integer id, Prenotazione prenotazione) {
        if (prenotazioneRepository.existsById(id)) {
            prenotazione.setId_prenotazioni(id);
            return prenotazioneRepository.save(prenotazione);
        } else {
            throw new EntityNotFoundException("Prenotazione con ID " + id + " non trovata.");
        }
    }

    public void eliminaPrenotazione(Integer id) {
        if (prenotazioneRepository.existsById(id)) {
            prenotazioneRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Prenotazione con ID " + id + " non trovata.");
        }
    }
}
