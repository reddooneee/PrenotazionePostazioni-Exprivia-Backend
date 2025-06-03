package com.prenotazioni.exprivia.exprv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.CosaDurataDTO;
import com.prenotazioni.exprivia.exprv.service.CosaDurataService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cose-durata")
@Tag(name = "Cose Durata", description = "API per la gestione delle cose durata")
public class CosaDurataController {

    private final CosaDurataService cosaDurataService;

    public CosaDurataController(CosaDurataService cosaDurataService) {
        this.cosaDurataService = cosaDurataService;
    }

    @GetMapping
    @Operation(summary = "Ottieni tutte le cose durata", description = "Restituisce una lista di tutte le cose durata")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista recuperata con successo"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<CosaDurataDTO>> getAllCoseDurata() {
        return ResponseEntity.ok(cosaDurataService.findAll());
    }

    @GetMapping("/search")
    @Operation(summary = "Cerca cose durata per nome", description = "Restituisce una lista di cose durata che corrispondono al termine di ricerca")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ricerca completata con successo"),
        @ApiResponse(responseCode = "400", description = "Termine di ricerca non valido"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<CosaDurataDTO>> searchCoseDurata(
            @Parameter(description = "Termine di ricerca") @RequestParam String searchTerm) {
        return ResponseEntity.ok(cosaDurataService.searchByNome(searchTerm));
    }

    @GetMapping("/prenotazione/{prenotazioneId}")
    @Operation(summary = "Ottieni cose durata per prenotazione", description = "Restituisce una lista di cose durata associate a una prenotazione")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista recuperata con successo"),
        @ApiResponse(responseCode = "404", description = "Prenotazione non trovata"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<CosaDurataDTO>> getCoseDurataByPrenotazione(
            @Parameter(description = "ID della prenotazione") @PathVariable Integer prenotazioneId) {
        return ResponseEntity.ok(cosaDurataService.findByPrenotazioneId(prenotazioneId));
    }

    @GetMapping("/{nome}")
    @Operation(summary = "Ottieni una cosa durata per nome", description = "Restituisce una cosa durata specifica dato il suo nome")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cosa durata trovata"),
        @ApiResponse(responseCode = "404", description = "Cosa durata non trovata"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<CosaDurataDTO> getCosaDurata(
            @Parameter(description = "Nome della cosa durata") @PathVariable String nome) {
        return cosaDurataService.findOne(nome)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crea una nuova cosa durata", description = "Crea una nuova cosa durata con i dati forniti")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cosa durata creata con successo"),
        @ApiResponse(responseCode = "400", description = "Dati non validi"),
        @ApiResponse(responseCode = "409", description = "Nome già esistente"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<?> createCosaDurata(@Valid @RequestBody CosaDurataDTO cosaDurataDTO) {
        try {
            CosaDurataDTO created = cosaDurataService.create(cosaDurataDTO);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{nome}")
    @Operation(summary = "Aggiorna una cosa durata", description = "Aggiorna una cosa durata esistente con i nuovi dati")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cosa durata aggiornata con successo"),
        @ApiResponse(responseCode = "400", description = "Dati non validi"),
        @ApiResponse(responseCode = "404", description = "Cosa durata non trovata"),
        @ApiResponse(responseCode = "409", description = "Nuovo nome già esistente"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<?> updateCosaDurata(
            @Parameter(description = "Nome della cosa durata da aggiornare") @PathVariable String nome,
            @Valid @RequestBody CosaDurataDTO cosaDurataDTO) {
        try {
            return cosaDurataService.update(nome, cosaDurataDTO)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{nome}")
    @Operation(summary = "Elimina una cosa durata", description = "Elimina una cosa durata dato il suo nome")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Cosa durata eliminata con successo"),
        @ApiResponse(responseCode = "404", description = "Cosa durata non trovata"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<?> deleteCosaDurata(
            @Parameter(description = "Nome della cosa durata da eliminare") @PathVariable String nome) {
        try {
            cosaDurataService.delete(nome);
            return ResponseEntity.noContent().build();
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 