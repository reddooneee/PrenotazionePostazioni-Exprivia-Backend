package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.StanzeDTO;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.enumerati.tipo_stanza;
import com.prenotazioni.exprivia.exprv.mapper.StanzeMapper;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class StanzeService {

    private StanzeRepository stanzeRepository;
    private StanzeMapper stanzeMapper;

    public StanzeService(StanzeRepository stanzeRepository, StanzeMapper stanzeMapper) {
        this.stanzeRepository = stanzeRepository;
        this.stanzeMapper = stanzeMapper;

    }

    /**
     * Recupera tutte le stanze del database
     * 
     * @return Lista di StanzeDTO
     */
    public List<StanzeDTO> cercaStanze() {
        List<Stanze> stanzeList = stanzeRepository.findAll();
        return stanzeMapper.toDtoList(stanzeList);
    }

    /**
     * Recupera tutti la stanza da id
     * 
     * @return id StanzaDTO
     */
    public StanzeDTO cercaStanzaSingola(Integer id_stanza) {
        Stanze stanze = stanzeRepository.findById(id_stanza)
                .orElseThrow(() -> new RuntimeException("Stanza con ID " + id_stanza + " non trovata"));
        return stanzeMapper.toDto(stanze);
    }

    /**
     * Crea un nuovo utente
     * 
     * @param stanzeDTO dati della nuova stanza
     * @return StanzaDTO della stanza creata
     * @throws IllegalArgumentException se ci sono problemi di validazione
     */
    public StanzeDTO creaStanze(StanzeDTO stanzeDTO) {
        validateStanze(stanzeDTO);

        // Verifica che l'email non sia già in uso
        if (stanzeRepository.findById(stanzeDTO.getId_stanza()).isPresent()) {
            throw new IllegalArgumentException("Esiste già una con questo id!");
        }
        Stanze stanze = stanzeMapper.toEntity(stanzeDTO);

        Stanze salvata = stanzeRepository.save(stanze);

        return stanzeMapper.toDto(salvata);
    }

    /**
     * Aggiorna un utente esistente con i valori specificati
     * 
     * @param id      ID della stanza da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return StanzaDTO della stanza aggiornato
     * @throws EntityNotFoundException se la stanza non esiste
     */
    public StanzeDTO aggiornaStanze(Integer id, Map<String, Object> updates) {
        Stanze existingStanze = stanzeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stanza con ID " + id + " non trovata."));

        updates.forEach((key, value) -> {
            switch (key) {
                case "nome":
                    existingStanze.setNome((String) value);
                    break;
                case "creatoIl":
                    existingStanze.setCreatoIl((LocalDateTime) value);
                    break;
                case "aggiornatoIl":
                    existingStanze.setAggiornatoIl((LocalDateTime) value);
                    break;
                case "capacita_stanza":
                    existingStanze.setCapacita_stanza((Integer) value);
                    break;
                case "tipo_stanza":
                    existingStanze.setTipo_stanza(tipo_stanza.valueOf((String) value));
                    break;
            }
        });

        Stanze updatedStanze = stanzeRepository.save(existingStanze);
        return stanzeMapper.toDto(updatedStanze);
    }

    /**
     * Elimina una stanza dal sistema
     * 
     * @param id ID della da eliminare
     * @throws EntityNotFoundException se la stanza non esiste
     */
    public void eliminaStanze(Integer id_stanza) {

        if (!stanzeRepository.existsById(id_stanza)) {
            throw new EntityNotFoundException("Stanza con ID " + id_stanza + " non trovata.");
        }
        stanzeRepository.deleteById(id_stanza);
    }

    /**
     * Valida i dati della stanza
     * 
     * @param stanzeDTO dati da validare
     * @throws IllegalArgumentException se i dati non sono validi
     */
    private void validateStanze(StanzeDTO stanzeDTO) {
        if (stanzeDTO.getNome() == null) {
            throw new IllegalArgumentException("Il nome non può essere nullo.");
        }

        if (stanzeDTO.getCapacita_stanza() == null) {
            throw new IllegalArgumentException("La capacità della stanza non può essere nulla.");
        }

        if (stanzeDTO.getTipo_stanza() == null) {
            throw new IllegalArgumentException("Il tipo della stanza non può essere vuoto.");
        }
    }
}