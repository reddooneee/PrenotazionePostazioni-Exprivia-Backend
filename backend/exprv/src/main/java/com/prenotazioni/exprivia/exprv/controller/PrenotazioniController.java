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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.dto.SelectOptionDTO;
import com.prenotazioni.exprivia.exprv.dto.CreatePrenotazioneDTO;
import com.prenotazioni.exprivia.exprv.dto.AdminCreatePrenotazioneDTO;
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

    @GetMapping("/mie-prenotazioni")
    public ResponseEntity<List<PrenotazioniDTO>> getPrenotazioniUtente(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            System.out.println("CONTROLLER DEBUG - Request for user: " + userEmail);
            
            List<PrenotazioniDTO> prenotazioni = PrenotazioniService.cercaPrenotazioniUtente(userEmail);
            
            /*System.out.println("CONTROLLER DEBUG - Returning " + prenotazioni.size() + " prenotazioni");
            prenotazioni.forEach(p -> {
                System.out.println("CONTROLLER DEBUG - Prenotazione ID: " + p.getId_prenotazioni());
                System.out.println("CONTROLLER DEBUG - User: " + (p.getUsers() != null ? p.getUsers().getEmail() : "null"));
                System.out.println("CONTROLLER DEBUG - Postazione: " + (p.getPostazione() != null ? p.getPostazione().getNomePostazione() : "null"));
                System.out.println("CONTROLLER DEBUG - Stanza: " + (p.getStanze() != null ? p.getStanze().getNome() : "null"));
            });*/
            
            return ResponseEntity.ok(prenotazioni);
        } catch (Exception e) {
            System.err.println("CONTROLLER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{idPrenotazioni}")
    public ResponseEntity<?> getPrenotazioniByID(@PathVariable("id_prenotazioni") Integer id_prenotazioni) {
        try {
            PrenotazioniDTO prenotazioniDTO = PrenotazioniService.cercaSingolo(id_prenotazioni);
            return ResponseEntity.ok(prenotazioniDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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

    @PutMapping("/admin/aggiornaPrenotazione/{id}")
    public ResponseEntity<?> aggiornaPrenotazioniAdmin(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        try {
            PrenotazioniDTO prenotazioniAggiornata = PrenotazioniService.updatePrenotazioni(id, updates, true);
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

    @PostMapping("/prenota")
    public ResponseEntity<?> creaPrenotazione(@RequestBody CreatePrenotazioneDTO request, Authentication authentication) {
        try {
            String userEmail = authentication.getName(); // Ottiene l'email dell'utente loggato
            PrenotazioniDTO newPrenotazione = PrenotazioniService.creaPrenotazione(request, userEmail);
            return ResponseEntity.ok(newPrenotazione);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/admin/prenota")
    public ResponseEntity<?> creaPrenotazioneAdmin(@RequestBody AdminCreatePrenotazioneDTO request, Authentication authentication) {
        try {
            PrenotazioniDTO newPrenotazione = PrenotazioniService.creaPrenotazioneAdmin(request);
            return ResponseEntity.ok(newPrenotazione);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/stanze")
    public ResponseEntity<List<SelectOptionDTO>> getStanzeOptions() {
        return ResponseEntity.ok(PrenotazioniService.getStanzeOptions());
    }

    @GetMapping("/stanze/{idStanza}/postazioni")
    public ResponseEntity<List<SelectOptionDTO>> getPostazioniByStanza(@PathVariable Integer idStanza) {
        return ResponseEntity.ok(PrenotazioniService.getPostazioniByStanzaOptions(idStanza));
    }

    @GetMapping("/postazioni/{idPostazione}/orari-disponibili")
    public ResponseEntity<List<String>> getOrariDisponibili(
            @PathVariable Integer idPostazione,
            @RequestParam String data) {
        LocalDate date = LocalDate.parse(data);
        return ResponseEntity.ok(PrenotazioniService.getOrariDisponibili(idPostazione, date));
    }

    @GetMapping("/stanze-e-postazioni")
    public ResponseEntity<?> getStanzeEPostazioni() {
        try {
            Map<String, List<Map<String, Object>>> result = PrenotazioniService.getStanzeEPostazioni();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/prenotazioni-del-giorno")
    public ResponseEntity<?> getPrenotazioniByDay(@RequestParam String data) {
        try {
            LocalDate localDate = LocalDate.parse(data);
            List<PrenotazioniDTO> prenotazioni = PrenotazioniService.getPrenotazioniByDay(localDate.atStartOfDay());
            return ResponseEntity.ok(prenotazioni);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/prenotazioni-del-giorno-e-postazione")
    public ResponseEntity<?> getPrenotazioniByDayAndPostazione(@RequestParam String data, @RequestParam Integer postazioneId) {
        try {
            LocalDate localDate = LocalDate.parse(data);
            List<PrenotazioniDTO> prenotazioni = PrenotazioniService.getPrenotazioniByDayAndPostazione(localDate, postazioneId);
            return ResponseEntity.ok(prenotazioni);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
