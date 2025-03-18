package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PrenotazioniService {

    private final PrenotazioniRepository PrenotazioniRepository;

    public PrenotazioniService(PrenotazioniRepository PrenotazioniRepository) {
        this.PrenotazioniRepository = PrenotazioniRepository;
    }

    //findall Tutte le prenotazioni
    public List<Prenotazioni> cercaTutti() {
        return PrenotazioniRepository.findAll();
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Prenotazioni cercaSingolo(Integer id) {
        return PrenotazioniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazioni con id " + id + " non trovata."));
    }

    //Creazione nuova Prenotazioni con enum -> stringa -> enum 
    public Prenotazioni creaPrenotazioni(Prenotazioni Prenotazioni) {
        //Condizioni per i NOT NULL 

        if (Prenotazioni.getId_prenotazioni() == null) {
            throw new IllegalArgumentException("L'ID non può essere nullo!");
        }

        if (Prenotazioni.getStanza() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (Prenotazioni.getUser() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (Prenotazioni.getStato_prenotazioni() == null) {
            throw new IllegalArgumentException("Lo stato della Prenotazioni non può essere nullo!");
        }

        if (Prenotazioni.getId_prenotazioni() != null && PrenotazioniRepository.existsById(Prenotazioni.getId_prenotazioni())) {
            throw new IllegalArgumentException("La Prenotazioni con ID " + Prenotazioni.getId_prenotazioni() + " esiste già.");
        }

        return PrenotazioniRepository.save(Prenotazioni);
    }

    //Metodo Per Aggiornare Le Prenotazioni
    public Prenotazioni aggiornaPrenotazioni(Integer id, Prenotazioni Prenotazioni) {
        if (PrenotazioniRepository.existsById(id)) {
            Prenotazioni.setId_prenotazioni(id);
            return PrenotazioniRepository.save(Prenotazioni);
        } else {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        }
    }

    //Metodo Per Eliminare le prenotazioni
    public void eliminaPrenotazioni(Integer id) {
        if (PrenotazioniRepository.existsById(id)) {
            PrenotazioniRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        }
    }
}


/*
 * 
 * CODICE DA CONFERMARE: 
 * 
 * // filepath: /D:/ITS/Exprivia Prenotazioni/PrenotazionePostazioni-Exprivia-Backend/backend/exprv/src/main/java/com/prenotazioni/exprivia/exprv/service/PrenotazioniService.java
package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;

@Service
public class PrenotazioniService {

    private final PrenotazioniRepository prenotazioniRepository;

    @Autowired
    public PrenotazioniService(PrenotazioniRepository prenotazioniRepository) {
        this.prenotazioniRepository = prenotazioniRepository;
    }

    public List<Prenotazioni> cercaTutti() {
        return prenotazioniRepository.findAll();
    }

    public Prenotazioni cercaSingolo(Integer id) {
        return prenotazioniRepository.findById(id).orElseThrow(() -> new RuntimeException("Prenotazione non trovata"));
    }

    public Prenotazioni creaPrenotazioni(Prenotazioni prenotazioni) {
        return prenotazioniRepository.save(prenotazioni);
    }

    public Prenotazioni aggiornaPrenotazioni(Integer id, Prenotazioni prenotazioni) {
        Prenotazioni esistente = prenotazioniRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Prenotazione non trovata"));
        esistente.setUser(prenotazioni.getUser());
        esistente.setPostazione(prenotazioni.getPostazione());
        esistente.setStanza(prenotazioni.getStanza());
        esistente.setStato_prenotazione(prenotazioni.getStato_prenotazione());
        esistente.setDataInizio(prenotazioni.getDataInizio());
        esistente.setDataFine(prenotazioni.getDataFine());
        return prenotazioniRepository.save(esistente);
    }

    public void eliminaPrenotazioni(Integer id) {
        Prenotazioni esistente = prenotazioniRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Prenotazione non trovata"));
        prenotazioniRepository.delete(esistente);
    }
}
 * 
 * 
 */
