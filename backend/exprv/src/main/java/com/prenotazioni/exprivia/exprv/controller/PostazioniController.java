package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.PostazioniDTO;
import com.prenotazioni.exprivia.exprv.service.PostazioniService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/postazioni")
public class PostazioniController {

    @Autowired
    private PostazioniService postazioniService;

    public PostazioniController() {
    }

    public PostazioniController(PostazioniService PostazioniService) {
        this.postazioniService = PostazioniService;
    }

    @GetMapping()
    public List<PostazioniDTO> getPostazioni() {
        return postazioniService.cercaTuttePostazioni();
    }

    // GET (RICEVE LA POSTAZIONE IN BASE ALL'ID)
    @GetMapping("/{id_postazione}")
    public ResponseEntity<PostazioniDTO> getPostazioneByID(@PathVariable("id_postazione") Integer id_postazione) {
        try {
            PostazioniDTO newPostazioniDTO = postazioniService.cercaSingolo(id_postazione);
            return ResponseEntity.ok(newPostazioniDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // POST (CREA POSTAZIONE)
    @PostMapping("/creaPostazione")
    public ResponseEntity<?> creaPostazione(@RequestBody PostazioniDTO postazioniDTO) {
        try {
            PostazioniDTO newPostazioniDTO = postazioniService.creaPostazione(postazioniDTO);
            return ResponseEntity.ok(newPostazioniDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE (ELIMINA LA POSTAZIONE IN BASE ALL'ID)
    @DeleteMapping("/eliminaPostazione/{id}")
    public ResponseEntity<String> eliminaPostazioni(@PathVariable Integer id) {
        {
            try {
                postazioniService.eliminaPostazioni(id);
                return ResponseEntity.noContent().build();
            } catch (EntityNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        }

    }

    @PutMapping("/aggiornaPostazione/{id}")
    public ResponseEntity<?> aggiornaPostazioni(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            PostazioniDTO postazioneAggiornata = postazioniService.aggiornaPostazioni(id, updates);
            return ResponseEntity.ok(postazioneAggiornata);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
