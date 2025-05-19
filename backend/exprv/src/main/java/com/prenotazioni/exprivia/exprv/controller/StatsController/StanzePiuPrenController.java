package com.prenotazioni.exprivia.exprv.controller.StatsController;

import java.util.List;
import com.prenotazioni.exprivia.exprv.service.StatsService.StanzePiuPrenService;
import com.prenotazioni.exprivia.exprv.dto.StatsDTO.StanzePiuPrenDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StanzePiuPrenController {

    @Autowired
    private StanzePiuPrenService stanzePiuPrenService;

    @GetMapping("/stanze")
    public ResponseEntity<List<StanzePiuPrenDTO>> getPrenotazioniPerStanza() {
        return ResponseEntity.ok(stanzePiuPrenService.getStanzePiuPrenotate());
    }
}
