package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.service.PostazioniService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.persistence.EntityNotFoundException;

@Controller
@RequestMapping("/Postazioni")
public class PostazioniController {

    private final PostazioniService PostazioniService;

    public PostazioniController(PostazioniService PostazioniService) {
        this.PostazioniService = PostazioniService;
    }

    @GetMapping()
    public List<Postazioni> getPostazioni() {
        return PostazioniService.cercaTuttePostazioni();
    }

    @GetMapping("/Postazioni/{id_postazione}")
    public ResponseEntity<Postazioni> getPostazioneByID(@PathVariable Integer id_postazione) {

        try {
            Postazioni Postazioni = PostazioniService.cercaSingolo(id_postazione);
            return ResponseEntity.ok(Postazioni);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/crea_Postazione")
    public ResponseEntity<?> creaPostazione(@RequestBody Postazioni Postazioni) {
        try {
            Postazioni newPostazioni = PostazioniService.creaPostazione(Postazioni);
            return ResponseEntity.ok(newPostazioni);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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
}
