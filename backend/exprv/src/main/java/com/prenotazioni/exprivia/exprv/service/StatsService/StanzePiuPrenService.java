package com.prenotazioni.exprivia.exprv.service.StatsService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.prenotazioni.exprivia.exprv.dto.StatsDTO.StanzePiuPrenDTO;
import com.prenotazioni.exprivia.exprv.repository.StatsRepository.StanzePiuPrenRepository;

@Service
public class StanzePiuPrenService {

    @Autowired
    private StanzePiuPrenRepository stanzePiuPrenRepository;

    public List<StanzePiuPrenDTO> getStanzePiuPrenotate() {
        List<Object[]> risultato = stanzePiuPrenRepository.stanzePiuPrenotate();

        return risultato.stream()
                .map(result -> new StanzePiuPrenDTO(
                        (String) result[0],
                        ((Number) result[1]).intValue() // Modifica qui: usa intValue()
                ))
                .collect(Collectors.toList());

    }

}
