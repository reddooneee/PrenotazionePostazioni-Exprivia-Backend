package com.prenotazioni.exprivia.exprv.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.PostazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;
import com.prenotazioni.exprivia.exprv.enumerati.stato_postazione;
import com.prenotazioni.exprivia.exprv.mapper.PostazioniMapper;
import com.prenotazioni.exprivia.exprv.repository.PostazioniRepository;

import jakarta.persistence.EntityNotFoundException;



@Service
public class PostazioniService {

    @Autowired
    private PostazioniRepository postazioniRepository;

    @Autowired
    private PostazioniMapper postazioniMapper;

    public PostazioniService(){}

    public PostazioniService(PostazioniRepository postazioniRepository/*, AuthController authController*/) {
        this.postazioniRepository = postazioniRepository;
    }

//Findall Tutte le Postazioni
    public List<PostazioniDTO> cercaTuttePostazioni() {
        List<Postazioni> postazioniList = postazioniRepository.findAll();
        return postazioniList.stream()
            .map(PostazioniMapper.INSTANCE::toPostazioniDTO)
            .toList();
    }

    //Ricerca Singola tramite id
    public PostazioniDTO cercaSingolo(Integer id) {
        Postazioni postazioni = postazioniRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Postazione con id " + id + " non trovata."));
        return PostazioniMapper.INSTANCE.toPostazioniDTO(postazioni);
    }

    //Creazione Nuova Postazioni
    public PostazioniDTO creaPostazione(PostazioniDTO postazioniDTO) {
        /*if (postazioni.getId_postazione() == null) {
            throw new IllegalArgumentException("L'id della postazione non puo essere nullo!");
        }*/
        Postazioni postazioni = postazioniMapper.toPostazioni(postazioniDTO);

        if (postazioni.getStato_postazione() == null) {
            throw new IllegalArgumentException("Lo stato della postazione non puo essere nullo!");
        }

        /*Stanze = id_Stanze */
        if (postazioni.getStanze() == null) {
            throw new IllegalArgumentException("L'id della stanza non puo essere nullo!");
        }

        Postazioni savedPostazioni = postazioniRepository.save(postazioni);

        return postazioniMapper.toPostazioniDTO(savedPostazioni);
    }

    //Metodo per aggiornare le postazioni
public PostazioniDTO aggiornaPostazioni(Integer id, Map<String, Object> updates) {
    Postazioni existingPostazione = postazioniRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Postazione con id " + id + " non trovata"));

    updates.forEach((key, value) -> {
        switch (key) {
            case "stanze":
                existingPostazione.setstanze(new Stanze((Integer) value));
                break;
            case "stato_postazione":
                existingPostazione.setStato_postazione(stato_postazione.valueOf((String) value)); 
                break;
            default:
                throw new IllegalArgumentException("Chiave non valida: " + key);
        }
    });

    Postazioni updatedPostazione = postazioniRepository.save(existingPostazione);
    return postazioniMapper.INSTANCE.toPostazioniDTO(updatedPostazione);
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
