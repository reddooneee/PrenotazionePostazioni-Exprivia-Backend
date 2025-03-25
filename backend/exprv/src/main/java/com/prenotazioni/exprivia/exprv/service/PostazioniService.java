package com.prenotazioni.exprivia.exprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.controller.AuthController;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PostazioniService {

    private final PostazioniRepository PostazioniRepository;

    public PostazioniService(PostazioniRepository PostazioniRepository, AuthController authController) {
        this.PostazioniRepository = PostazioniRepository;
    }

//Findall Tutte le Postazioni
    public List<Postazioni> cercaTuttePostazioni() {
        return PostazioniRepository.findAll();
    }

//Ricerca Singola tramite id
    public Postazioni cercaSingolo(Integer id) {
        return PostazioniRepository.findById(id).orElseThrow(() -> new RuntimeException("Postazione cone id" + id + "Non Trovata"));
    }

//Creazione Nuova Postazioni
    public Postazioni creaPostazione(Postazioni Postazioni) {
        /*if (Postazioni.getId_postazione() == null) {
            throw new IllegalArgumentException("L'id della postazione non puo essere nullo!");
        }*/

        if (Postazioni.getStato_postazione() == null) {
            throw new IllegalArgumentException("Lo stato della postazione non puo essere nullo!");
        }

        if (Postazioni.getId_stanza() == null) {
            throw new IllegalArgumentException("L'id della stanza non puo essere nullo");
        }

        return PostazioniRepository.save(Postazioni);
    }

    //Metodo per aggiornare le postazioni
    public Postazioni aggiornaPostazioni(Integer id, Postazioni Postazioni) {
        if (PostazioniRepository.existsById(id)) {
            Postazioni.setId_postazione(id);
            return PostazioniRepository.save(Postazioni);
        } else {
            throw new EntityNotFoundException("Postazione con id" + id + "Non Trovata");
        }
    }

    //Metodo Per Eliminare la Posstazione
    public void eliminaPostazioni(Integer id) {
        if (PostazioniRepository.existsById(id)) {
            PostazioniRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Postazione con id" + id + "Non Trovata");
        }
    }

}
