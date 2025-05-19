package com.prenotazioni.exprivia.exprv.controller.StatsController;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.prenotazioni.exprivia.exprv.dto.StatsDTO.PrenotazioniCountDTO;
import com.prenotazioni.exprivia.exprv.service.StatsService.StatisticheService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/stats")
public class StatisticheController {

    @Autowired
    private StatisticheService statisticheService;

    @GetMapping("/prenotazioni")
    public ResponseEntity<List<PrenotazioniCountDTO>> getPrenotazioniPerGiorno(
            @RequestParam LocalDateTime dataInizio) {
        if (dataInizio == null) {
            dataInizio = LocalDateTime.now().minusDays(7);
        }

        return ResponseEntity.ok(statisticheService.getPrenotazioniPerGiorno(dataInizio));

    }
}
