package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.service.PostazioniService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/Postazioni")
public class PostazioniController {

    @Autowired
    private PostazioniService PostazioniService;

    public PostazioniController(){}
    
    public PostazioniController(PostazioniService PostazioniService) {
        this.PostazioniService = PostazioniService;
    }

    @GetMapping()
    public List<Postazioni> getPostazioni() {
        return PostazioniService.cercaTuttePostazioni();
    }

    //GET (RICEVE LA POSTAZIONE IN BASE ALL'ID)
    @GetMapping("/postazioni/{id_postazione}")
    public ResponseEntity<Postazioni> getPostazioneByID(@PathVariable Integer id_postazione) {
        try {
            Postazioni Postazioni = PostazioniService.cercaSingolo(id_postazione);
            return ResponseEntity.ok(Postazioni);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    //POST (CREA POSTAZIONE)
    @PostMapping("/crea_Postazione")
    public ResponseEntity<?> creaPostazione(@RequestBody Postazioni postazioni) {
        System.out.println("Ricevuto: " + postazioni.getStanze() + ", " + postazioni.getStato_postazione());
        try {
            Postazioni newPostazioni = PostazioniService.creaPostazione(postazioni);
            return ResponseEntity.ok(newPostazioni);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //DELETE (ELIMINA LA POSTAZIONE IN BASE ALL'ID)
    @DeleteMapping("/elimina/{id}")
    public ResponseEntity<String> eliminaPostazioni(@PathVariable Integer id
    ) {
        {
            try {
                PostazioniService.eliminaPostazioni(id);
                return ResponseEntity.noContent().build();
            } catch (EntityNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
        }

    }

    //PUT (AGGIORNA LA STANZA IN BASE ALL'ID)
    @PutMapping("/aggiornaStanza/{id}")
    public ResponseEntity<?> aggiornaPostazioni(@PathVariable Integer id, @RequestBody Postazioni Postazioni) {
        try {
            Postazioni PostazioneAggioranta = PostazioniService.aggiornaPostazioni(id, Postazioni);
            return ResponseEntity.ok(PostazioneAggioranta);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
