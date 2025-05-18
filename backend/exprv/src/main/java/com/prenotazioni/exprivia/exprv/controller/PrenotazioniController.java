package com.prenotazioni.exprivia.exprv.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.service.PrenotazioniService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/prenotazioni")
public class PrenotazioniController {

    @Autowired
    private PrenotazioniService PrenotazioniService;

    public PrenotazioniController() {
    }

    public PrenotazioniController(PrenotazioniService PrenotazioniService) {
        this.PrenotazioniService = PrenotazioniService;
    }

    @GetMapping("/lista")
    public List<PrenotazioniDTO> getPrenotazioni() {
        return PrenotazioniService.cercaTutti();
    }

    @GetMapping("/{idPrenotazioni}")
    public ResponseEntity<PrenotazioniDTO> getPrenotazioniByID(
            @PathVariable("id_prenotazioni") Integer id_prenotazioni) {
        try {
            PrenotazioniDTO prenotazioniDTO = PrenotazioniService.cercaSingolo(id_prenotazioni);
            return ResponseEntity.ok(prenotazioniDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/creaPrenotazione")
    public ResponseEntity<?> creaPrenotazioni(@RequestBody PrenotazioniDTO prenotazioniDTO) {
        try {
            PrenotazioniDTO newPrenotazioniDTO = PrenotazioniService.creaPrenotazioni(prenotazioniDTO);
            return ResponseEntity.ok(newPrenotazioniDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/aggiornaPrenotazione/{id}")
    public ResponseEntity<?> aggiornaPrenotazioni(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            PrenotazioniDTO prenotazioniAggiornata = PrenotazioniService.updatePrenotazioni(id, updates);
            return ResponseEntity.ok(prenotazioniAggiornata);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminaPrenotazione/{id}")
    public ResponseEntity<String> eliminaPrenotazioni(@PathVariable Integer id) {
        try {
            PrenotazioniService.eliminaPrenotazioni(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/export/giorno/{date}")
    public ResponseEntity<byte[]> EsportaPrenotazioniDaily(@PathVariable String date) {
        try {

            // Parsing della data senza ora
            LocalDate localDate = LocalDate.parse(date);
            LocalDateTime dateTime = localDate.atStartOfDay();

            // Genera il file excel attraverso il file excel
            byte[] fileExcel = PrenotazioniService.FileExcDaily(dateTime);

            // Formatta la data per il nome del file
            String nomeFile = "prenotazioni_" + localDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) + ".xlsx";

            // Configura gli headers per il download
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomeFile + "\"");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(fileExcel);

        } catch (Exception e) {
            System.out.println("Errore Nell'Export " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}
