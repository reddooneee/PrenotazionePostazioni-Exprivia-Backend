package com.prenotazioni.exprivia.exprv.service.StatsService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.StatsDTO.PrenotazioniCountDTO;
import com.prenotazioni.exprivia.exprv.repository.StatsRepository.StatisticheRepository;

@Service
public class StatisticheService {

    @Autowired
    private StatisticheRepository statisticheRepository;

    public List<PrenotazioniCountDTO> getPrenotazioniPerGiorno(LocalDateTime data_inizio) {
        List<Object[]> risultato = statisticheRepository.contaPrenotazioniPerGiorno(data_inizio);

        return risultato.stream()
                .map(result -> new PrenotazioniCountDTO(
                        // Converte il java.sql.Date in LocalDateTime
                        ((java.sql.Date) result[0]).toLocalDate().atStartOfDay(),
                        // Converte il conteggio in integer
                        ((Number) result[1]).intValue()))
                .collect(Collectors.toList());
    }

}
