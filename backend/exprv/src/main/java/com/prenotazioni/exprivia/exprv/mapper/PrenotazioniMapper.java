package com.prenotazioni.exprivia.exprv.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

/**
 * Mapper per la conversione tra l'entità Prenotazioni e il DTO PrenotazioniDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PrenotazioniMapper {

    /**
     * Converte un'entità Prenotazioni in PrenotazioniDTO.
     */
    PrenotazioniDTO toDto(Prenotazioni prenotazioni);

    /**
     * Converte un DTO PrenotazioniDTO in un'entità Prenotazioni.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Prenotazioni toEntity(PrenotazioniDTO prenotazioniDTO);

    /**
     * Aggiorna un'entità Prenotazioni esistente con i dati del DTO.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePrenotazioneFromDto(PrenotazioniDTO prenotazioniDTO, @MappingTarget Prenotazioni prenotazioni);

    /**
     * Converte una lista di entità Prenotazioni in una lista di PrenotazioniDTO.
     */
    List<PrenotazioniDTO> toDtoList(List<Prenotazioni> prenotazioniList);
}
