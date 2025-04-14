package com.prenotazioni.exprivia.exprv.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.enumerati.stato_prenotazione;
import com.prenotazioni.exprivia.exprv.mapper.PrenotazioniMapper;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;
import com.prenotazioni.exprivia.exprv.repository.PrenotazioniRepository;
import com.prenotazioni.exprivia.exprv.repository.StanzeRepository;
import com.prenotazioni.exprivia.exprv.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PrenotazioniService {

    @Autowired
    private PrenotazioniRepository prenotazioniRepository;

    @Autowired
    private PostazioniRepository postazioniRepository;

    @Autowired
    private StanzeRepository stanzeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrenotazioniMapper prenotazioniMapper;

    public PrenotazioniService() {
    }

    ;

    //Costruttore PrenotazioniService
    public PrenotazioniService(PrenotazioniRepository prenotazioniRepository,
            PostazioniRepository postazioniRepository,
            StanzeRepository stanzeRepository,
            UserRepository userRepository,
            PrenotazioniMapper prenotazioniMapper) {
        this.prenotazioniRepository = prenotazioniRepository;
        this.postazioniRepository = postazioniRepository;
        this.stanzeRepository = stanzeRepository;
        this.userRepository = userRepository;
        this.prenotazioniMapper = prenotazioniMapper;
    }

    /**
     * Valida i dati della Prenotazione e salva una nuova prenotazione se valida
     *
     * @param prenotazioniDTO dati da validare e salvare
     * @return prenotazioniDTO della prenotazione salvata
     * @throws IllegalArgumentException se i dati non sono validi
     */
    public void validatePrenotazioniDTO(PrenotazioniDTO prenotazioniDTO) {
        if (prenotazioniDTO.getStanze() == null) {
            throw new IllegalArgumentException("La stanza non può essere nulla!");
        }

        if (prenotazioniDTO.getUsers() == null) {
            throw new IllegalArgumentException("L'User non può essere nullo!");
        }

        if (prenotazioniDTO.getStato_prenotazione() == null) {
            throw new IllegalArgumentException("Lo stato della Prenotazioni non può essere nullo!");
        }
    }

    // findall Tutte le prenotazioni
    /*
     * Recupera tutte le prenotazioni dal DB
     * 
     * @return Lista di PrenotazioniDTO
     */
    public List<PrenotazioniDTO> cercaTutti() {
        List<Prenotazioni> prenotazioniList = prenotazioniRepository.findAll();
        return prenotazioniMapper.toDtoList(prenotazioniList);
    }

    // Ricerca singola tramite id ma con messaggino personalizzato invece che null
    /*
     * Recupera una prenotazione con l'id
     * 
     * @return Prenotazioni in base all'id
     */
    public PrenotazioniDTO cercaSingolo(Integer id) {
        Prenotazioni prenotazioni = prenotazioniRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione con id " + id + " non trovato"));
        return prenotazioniMapper.toDto(prenotazioni);
    }

    // Creazione nuova Prenotazioni
    @Transactional
    public PrenotazioniDTO creaPrenotazioni(PrenotazioniDTO prenotazioniDTO) {

        validatePrenotazioniDTO(prenotazioniDTO);

        if (prenotazioniDTO.getId_prenotazioni() != null
                && prenotazioniRepository.existsById(prenotazioniDTO.getId_prenotazioni())) {
            throw new IllegalArgumentException("La Prenotazioni con ID "
                    + prenotazioniDTO.getId_prenotazioni() + " esiste già.");
        }

        //Conversione DTO in entity
        Prenotazioni prenotazioni = prenotazioniMapper.toEntity(prenotazioniDTO);

        //Salva L'utente
        Prenotazioni savedPrenotazioni = prenotazioniRepository.save(prenotazioni);

        //Restituisci il DTO dell'utente Salvato
        return prenotazioniMapper.toDto(savedPrenotazioni);
    }

    /**
     * Aggiorna una Prenotazione esistente con i valori specificati
     *
     * @param id ID dell'utente da aggiornare
     * @param updates mappa dei campi da aggiornare
     * @return UserDTO dell'utente aggiornato
     * @throws EntityNotFoundException se l'utente non esiste
     */
    public PrenotazioniDTO updatePrenotazioni(Integer id, Map<String, Object> updates) {
        Prenotazioni existingPrenotazioni = prenotazioniRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Prenotazione con ID " + id + " non trovata"));

        if (updates.containsKey("id")) {
            Integer newId = (Integer) updates.get("id_stanza");
            Optional<Prenotazioni> prenotazioneWithSameId = prenotazioniRepository.findById(newId);
            if (prenotazioneWithSameId.isPresent() && !prenotazioneWithSameId.get().getId_prenotazioni().equals(id)) {
                throw new IllegalArgumentException("id già in uso");
            }
        }

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
                            .orElseThrow(() -> new EntityNotFoundException(
                            "Postazione con ID " + idPostazione + " non trovata"));
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
                            .orElseThrow(
                                    () -> new EntityNotFoundException("Stanza con ID " + idStanza + " non trovata"));
                    existingPrenotazioni.setStanze(stanza);
                    break;
            }
        });

        Prenotazioni updatedPrenotazioni = prenotazioniRepository.save(existingPrenotazioni);
        return prenotazioniMapper.toDto(updatedPrenotazioni);
    }

    // Metodo Per Eliminare le prenotazioni
    public void eliminaPrenotazioni(Integer id) {
        if (!prenotazioniRepository.existsById(id)) {
            throw new EntityNotFoundException("Prenotazioni con ID " + id + " non trovata.");
        } else {
            prenotazioniRepository.deleteById(id);
        }
    }

}
