package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.PostazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.StatoPostazione;
import com.prenotazioni.exprivia.exprv.mapper.PostazioniMapper;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PostazioniService {

    @Autowired
    private PostazioniRepository postazioniRepository;

    @Autowired
    private PostazioniMapper postazioniMapper;

    public PostazioniService() {
    }

    public PostazioniService(PostazioniRepository postazioniRepository) {
        this.postazioniRepository = postazioniRepository;
    }

    /**
     * Recupera tutte le postazioni.
     */
    public List<PostazioniDTO> cercaTuttePostazioni() {
        List<Postazioni> postazioniList = postazioniRepository.findAll();
        return postazioniMapper.toDtoList(postazioniList);
    }

    /**
     * Cerca una singola postazione per ID.
     */
    public PostazioniDTO cercaSingolo(Integer id) {
        Postazioni postazioni = postazioniRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Postazione con id " + id + " non trovata."));
        return postazioniMapper.toDto(postazioni);
    }

    /**
     * Crea una nuova postazione.
     */
    public PostazioniDTO creaPostazione(PostazioniDTO postazioniDTO) {
        Postazioni postazioni = postazioniMapper.toEntity(postazioniDTO);

        if (postazioni.getStatoPostazione() == null) {
            throw new IllegalArgumentException("Lo stato della postazione non può essere nullo!");
        }

        if (postazioni.getStanze() == null) {
            throw new IllegalArgumentException("L'id della stanza non può essere nullo!");
        }

        Postazioni saved = postazioniRepository.save(postazioni);
        return postazioniMapper.toDto(saved);
    }

    /**
     * Aggiorna una postazione esistente.
     */
    public PostazioniDTO aggiornaPostazioni(Integer id, Map<String, Object> updates) {
        Postazioni postazione = postazioniRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Postazione con id " + id + " non trovata."));

        updates.forEach((key, value) -> {
            switch (key) {
                case "stanze":
                    postazione.setstanze(new Stanze((Integer) value));
                    break;
                case "statoPostazione":
                    // postazione.setStato_postazione(stato_postazione.valueOf((String) value));
                    StatoPostazione nuovoStato = new StatoPostazione((String) value);
                    postazione.setStatoPostazione(nuovoStato);
                    break;
                default:
                    throw new IllegalArgumentException("Chiave non valida: " + key);
            }
        });

        Postazioni updated = postazioniRepository.save(postazione);
        return postazioniMapper.toDto(updated);
    }

    /**
     * Elimina una postazione per ID.
     */
    public void eliminaPostazioni(Integer id) {
        if (postazioniRepository.existsById(id)) {
            postazioniRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Postazione con id " + id + " non trovata.");
        }
    }
}
