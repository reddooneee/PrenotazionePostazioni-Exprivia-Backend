package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;

import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PrenotazioniService {

    @Autowired
    private PrenotazioniRepository prenotazioniRepository;
    
    @Autowired
    private PostazioniRepository postazioniRepository;

    @Autowired
    private StanzeRepository stanzeRepository;

    @Autowired
    private UserRepository userRepository;

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

        if (prenotazioni.getStanze() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (prenotazioni.getUsers() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (prenotazioni.getStato_prenotazione() == null) {
            throw new IllegalArgumentException("Lo stato della Prenotazioni non può essere nullo!");
        }

        /*if (prenotazioni.getId_prenotazioni() != null && prenotazioniRepository.existsById(prenotazioni.getId_prenotazioni())) {
            throw new IllegalArgumentException("La Prenotazioni con ID " + prenotazioni.getId_prenotazioni() + " esiste già.");
        }*/

        return prenotazioniRepository.save(prenotazioni);
    }

    //Metodo Per Aggiornare Le Prenotazioni
    /*public Prenotazioni aggiornaPrenotazioni(Integer id, Prenotazioni prenotazioni) {
        if (prenotazioniRepository.existsById(id)) {
            prenotazioni.setId_prenotazioni(id);
            return prenotazioniRepository.save(prenotazioni);
        } else {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        }
    }*/

    public Prenotazioni updatePrenotazioni(Integer id, Map<String, Object> updates) {
        Prenotazioni existingPrenotazioni = prenotazioniRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Prenotazione con ID " + id + " non trovata"));
    
        updates.forEach((key, value) -> {
            switch (key) {
                case "stato_prenotazione":
                    existingPrenotazioni.setStato_prenotazione(stato_prenotazione.valueOf(value.toString()));
                    break;
                case "dataInizio":
                    existingPrenotazioni.setDataInizio(LocalDateTime.parse(value.toString()));
                    break;
                case "dataFine":
                    existingPrenotazioni.setDataFine(LocalDateTime.parse(value.toString()));
                    break;
                case "postazione":
                    Integer idPostazione = (Integer) value;
                    Postazioni postazione = postazioniRepository.findById(idPostazione)
                        .orElseThrow(() -> new EntityNotFoundException("Postazione con ID " + idPostazione + " non trovata"));
                    existingPrenotazioni.setPostazione(postazione);
                    break;
                case "user":
                    Integer idUser = (Integer) value;
                    Users user = userRepository.findById(idUser)
                        .orElseThrow(() -> new EntityNotFoundException("User con ID " + idUser + " non trovato"));
                    existingPrenotazioni.setUsers(user);
                    break;
                case "stanza":
                    Integer idStanza = (Integer) value;
                    Stanze stanza = stanzeRepository.findById(idStanza)
                        .orElseThrow(() -> new EntityNotFoundException("Stanza con ID " + idStanza + " non trovata"));
                    existingPrenotazioni.setStanze(stanza);
                    break;
            }
        });
    
        return prenotazioniRepository.save(existingPrenotazioni);
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
