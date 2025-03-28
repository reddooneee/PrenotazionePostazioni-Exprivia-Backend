package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;

import jakarta.persistence.EntityNotFoundException;



@Service
public class PostazioniService {

    @Autowired
    private PostazioniRepository postazioniRepository;

    public PostazioniService(){}

    public PostazioniService(PostazioniRepository postazioniRepository/*, AuthController authController*/) {
        this.postazioniRepository = postazioniRepository;
    }

//Findall Tutte le Postazioni
    public List<Postazioni> cercaTuttePostazioni() {
        return postazioniRepository.findAll();
    }

//Ricerca Singola tramite id
    public Postazioni cercaSingolo(Integer id) {
        return postazioniRepository.findById(id).orElseThrow(() -> new RuntimeException("Postazione cone id" + id + "Non Trovata"));
    }

//Creazione Nuova Postazioni
    public Postazioni creaPostazione(Postazioni postazioni) {
        /*if (postazioni.getId_postazione() == null) {
            throw new IllegalArgumentException("L'id della postazione non puo essere nullo!");
        }*/

        if (postazioni.getStato_postazione() == null) {
            throw new IllegalArgumentException("Lo stato della postazione non puo essere nullo!");
        }

        /*Stanze = id_Stanze */
        if (postazioni.getStanze() == null) {
            throw new IllegalArgumentException("L'id della stanza non puo essere nullo!");
        }

        return postazioniRepository.save(postazioni);
    }

    //Metodo per aggiornare le postazioni
    public Postazioni aggiornaPostazioni(Integer id, Postazioni postazioni) {
        if (postazioniRepository.existsById(id)) {
            postazioni.setId_postazione(id);
            return postazioniRepository.save(postazioni);
        } else {
            throw new EntityNotFoundException("Postazione con id" + id + " non Trovata");
        }
    }
               
    /*public Postazioni aggiornaPostazioni(Integer id, Map<String, Object> updates){
        Postazioni existingPostazioni = postazioniRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Utente con ID " + id + " non trovato"));
    
        updates.forEach((key, value) -> {
                switch (key) {
                case "Stanza": existingPostazioni.setstanze((Stanze) value); break;
                case "Stato Postazione": existingPostazioni.setStato_postazione(stato_postazione.valueOf((String) value)); break;
            }
        });

        return postazioniRepository.save(existingPostazioni);
    }*/

    //Metodo Per Eliminare la Posstazione
    public void eliminaPostazioni(Integer id) {
        if (postazioniRepository.existsById(id)) {
            postazioniRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Postazione con id" + id + "Non Trovata");
        }
    }

}
