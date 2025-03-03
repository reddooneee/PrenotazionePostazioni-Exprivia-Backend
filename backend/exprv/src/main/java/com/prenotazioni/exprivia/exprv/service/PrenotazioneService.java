package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import com.prenotazioni.exprivia.exprv.entity.Prenotazione;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioneRepository;

import jakarta.persistence.EntityNotFoundException;

public class PrenotazioneService {
    
    private PrenotazioneRepository prenotazioneRepository;

    public PrenotazioneService(PrenotazioneRepository prenotazioneRepository){
        this.prenotazioneRepository = prenotazioneRepository;
    }

    //findall Tutte le prenotazioni
    public List<Prenotazione> cercaTutti() {
        return prenotazioneRepository.findAll();
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Prenotazione cercaSingolo(Long id) {
        return prenotazioneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione con id " + id + " non trovata."));
    }

    //Creazione nuova prenotazione con enum -> stringa -> enum 
    public Prenotazione creaUtente(Prenotazione prenotazione) {
        //Condizioni per i NOT NULL 
        if (prenotazione.getId_prenotazioni() == null) {
            throw new IllegalArgumentException("L'ID non può essere nullo!");
        }

        if(prenotazione.getUser() == null){
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if(prenotazione.getPostazione() == null){
            throw new IllegalArgumentException("La postazione non può essere nullo!");
        }

        if(prenotazione.getStanza() == null){
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if(prenotazione.getStato_prenotazioni() == null) {
            throw new IllegalArgumentException("Lo stato della stanza non può essere nullo!");
        }

        return prenotazioneRepository.save(prenotazione);
    }
    
    public Prenotazione aggiornaUser(Long id, Prenotazione prenotazione) {
        if (prenotazioneRepository.existsById(id)) {
            prenotazione.setId_prenotazioni(id);
            return prenotazioneRepository.save(prenotazione);
        } else {
            throw new EntityNotFoundException("Prenotazione con ID " + id + " non trovata.");
        }
    }

    public void eliminaUser(Long id) {
        if (prenotazioneRepository.existsById(id)) {
            prenotazioneRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Prenotazione con ID " + id + " non trovata.");
        }
    }
}