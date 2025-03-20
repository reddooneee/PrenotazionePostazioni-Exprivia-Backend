//STANZE SERVICE 

package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class StanzeService {

    // private final filter.CorsFilter> corsFilter;
    // private final AuthController authController;
    private StanzeRepository StanzeRepository;

    public StanzeService(StanzeRepository StanzeRepository) {
        this.StanzeRepository = StanzeRepository;
    }

    //FindAll Tutte Le Stanze
    public List<Stanze> cercaStanze() {
        return StanzeRepository.findAll();
    }

    // (findByID) Ricerca Singola Della Stanza Tramite id Con Exception personalizzata
    public Stanze cercaStanzaSingola(Integer id_stanza) {
        return StanzeRepository.findById(id_stanza)
                .orElseThrow(() -> new RuntimeException("Prenotazioni con id" + id_stanza + "Non trovata"));
    }

    //Creazione nuove Stanze 
    public Stanze creaStanze(Stanze Stanze) {
        //Condizioni Per i NotNull

        if (Stanze.getId_stanza() == null) {
            throw new IllegalArgumentException("L'id non puó essere nullo!");
        }

        if (Stanze.getNome() == null) {
            throw new IllegalArgumentException("Il nome non puó essere nullo!");
        }

        if (Stanze.getCapacita_stanza() == null) {
            throw new IllegalArgumentException("La capacitá della stanza non puó essere nulla");
        }

        return StanzeRepository.save(Stanze);
    }

    //Metodo Per aggiornare le stanze
    public Stanze aggiornaStanze(Integer id_stanza, Stanze Stanze) {
        if (StanzeRepository.existsById(id_stanza)) {
            Stanze.setId_stanza(id_stanza);
            return StanzeRepository.save(Stanze);
        } else {
            throw new EntityNotFoundException("Stanza con id" + id_stanza + "non trovata");
        }
    }

    //Metodo Per Eliminare Le Stanze
    public void eliminaStanze(Integer id_stanza) {
        if (StanzeRepository.existsById(id_stanza)) {
            StanzeRepository.deleteById(id_stanza);
        } else {
            throw new EntityNotFoundException("Stanza con id" + id_stanza + "non trovata");
        }

    }
}
