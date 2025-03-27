package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PrenotazioniService {

    @Autowired
    private PrenotazioniRepository prenotazioniRepository;
    
    public PrenotazioniService(){};

    public PrenotazioniService(PrenotazioniRepository prenotazioniRepository) {
            this.prenotazioniRepository = prenotazioniRepository;
    }

    //findall Tutte le prenotazioni
    public List<Prenotazioni> cercaTutti() {
        return prenotazioniRepository.findAll();
    }

    //Ricerca singola tramite id ma con messaggino personalizzato invece che null
    public Prenotazioni cercaSingolo(Integer id) {
        return prenotazioniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazioni con id " + id + " non trovata."));
    }

    //Creazione nuova Prenotazioni con enum -> stringa -> enum 
    public Prenotazioni creaPrenotazioni(Prenotazioni prenotazioni) {
        //Condizioni per i NOT NULL 

        /*if (prenotazioni.getId_prenotazioni() == null) {
            throw new IllegalArgumentException("L'ID prenotazione non può essere nullo!");
        }*/

        if (prenotazioni.getStanza() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (prenotazioni.getUser() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (prenotazioni.getStato_prenotazioni() == null) {
            throw new IllegalArgumentException("Lo stato della Prenotazioni non può essere nullo!");
        }

        /*if (prenotazioni.getId_prenotazioni() != null && prenotazioniRepository.existsById(prenotazioni.getId_prenotazioni())) {
            throw new IllegalArgumentException("La Prenotazioni con ID " + prenotazioni.getId_prenotazioni() + " esiste già.");
        }*/

        return prenotazioniRepository.save(prenotazioni);
    }

    //Metodo Per Aggiornare Le Prenotazioni
    public Prenotazioni aggiornaPrenotazioni(Integer id, Prenotazioni prenotazioni) {
        if (prenotazioniRepository.existsById(id)) {
            prenotazioni.setId_prenotazioni(id);
            return prenotazioniRepository.save(prenotazioni);
        } else {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        }
    }

    //Metodo Per Eliminare le prenotazioni
    public void eliminaPrenotazioni(Integer id) {
        if (prenotazioniRepository.existsById(id)) {
            prenotazioniRepository.deleteById(id);
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
