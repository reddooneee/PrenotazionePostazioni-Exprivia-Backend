package com.prenotazioni.exprivia.exprv.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.prenotazioni.exprivia.exprv.dto.CosaDurataDTO;
import com.prenotazioni.exprivia.exprv.entity.CosaDurata;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Mapper(componentModel = "spring")
public interface CosaDurataMapper {

    @Mapping(target = "prenotazioneIds", source = "prenotazioni", qualifiedByName = "prenotazioniToIds")
    CosaDurataDTO toDto(CosaDurata cosaDurata);

    @Mapping(target = "prenotazioni", ignore = true)
    CosaDurata toEntity(CosaDurataDTO dto);

    @Named("prenotazioniToIds")
    default Set<Integer> prenotazioniToIds(Set<Prenotazioni> prenotazioni) {
        if (prenotazioni == null) {
            return null;
        }
        return prenotazioni.stream()
            .map(prenotazione -> prenotazione.getId_prenotazioni())
            .collect(Collectors.toSet());
    }
} 