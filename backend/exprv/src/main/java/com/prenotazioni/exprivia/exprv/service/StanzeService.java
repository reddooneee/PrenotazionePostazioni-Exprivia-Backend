//STANZE SERVICE 
package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.StanzeDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.enumerati.tipo_stanza;
import com.prenotazioni.exprivia.exprv.mapper.StanzeMapper;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class StanzeService {

    // private final filter.CorsFilter> corsFilter;
    // private final AuthController authController;
    @Autowired
    private StanzeRepository StanzeRepository;

    @Autowired
    private StanzeMapper stanzeMapper;

    public StanzeService(StanzeRepository StanzeRepository) {
        this.StanzeRepository = StanzeRepository;
    }

    //FindAll Tutte Le Stanze
    public List<StanzeDTO> cercaStanze() {
        List<Stanze> stanzeList = StanzeRepository.findAll();
        return stanzeList.stream()
            .map(StanzeMapper.INSTANCE::toStanzeDTO)
            .toList();
    }

    // (findByID) Ricerca Singola Della Stanza Tramite id Con Exception personalizzata
    public StanzeDTO cercaStanzaSingola(Integer id_stanza) {
        Stanze stanze = StanzeRepository.findById(id_stanza)
                .orElseThrow(() -> new RuntimeException("Prenotazioni con id" + id_stanza + "Non trovata"));
        return StanzeMapper.INSTANCE.toStanzeDTO(stanze);
    }

    //Creazione nuove Stanze 
    public StanzeDTO creaStanze(StanzeDTO stanzeDTO) {
        Stanze stanze = stanzeMapper.toStanze(stanzeDTO);
        //Condizioni Per i NotNull

        if (stanzeDTO.getNome() == null) {
            throw new IllegalArgumentException("Il nome non puó essere nullo!");
        }

        if (stanzeDTO.getCapacita_stanza() == null) {
            throw new IllegalArgumentException("La capacitá della stanza non puó essere nulla");
        }

        if (stanzeDTO.getTipo_stanza() == null){
            throw new IllegalArgumentException("Il tipo della stanza non può essere vuoto.");
        }

        Stanze salvata = StanzeRepository.save(stanze);
        return stanzeMapper.toStanzeDTO(salvata);
    }

    //Metodo Per aggiornare le stanze
    public StanzeDTO aggiornaStanze(Integer id, Map<String, Object> updates) {
        Stanze existingStanze = StanzeRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Stanza con ID " + id + " non trovata."));
    
        updates.forEach((key, value) -> {
            switch (key) {
                case "nome": existingStanze.setNome((String) value); break;
                case "cognome": existingStanze.setCreatoIl((LocalDateTime) value); break;
                case "email": existingStanze.setAggiornatoIl((LocalDateTime) value); break;
                case "login": existingStanze.setCapacita_stanza((Integer) value); break;
                case "postazioni": existingStanze.setPostazioni((List<Postazioni>) value); break;
                case "ruolo_utente": existingStanze.setTipo_stanza(tipo_stanza.valueOf((String) value)); break;
            }
        });
    
        Stanze updatedStanze = StanzeRepository.save(existingStanze);
        return StanzeMapper.INSTANCE.toStanzeDTO(updatedStanze);
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
