package com.prenotazioni.exprivia.exprv.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.prenotazioni.exprivia.exprv.dto.PostazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;

/**
 * Mapper per la conversione tra l'entità Postazioni e il DTO PostazioniDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostazioniMapper {

    /**
     * Converte un'entità Postazioni in PostazioniDTO.
     */
    @Mapping(target = "id_stanza", source = "stanze.id_stanza")
    @Mapping(target = "statoPostazione", source = "statoPostazione")
    PostazioniDTO toDto(Postazioni postazioni);

    /**
     * Converte un DTO PostazioniDTO in un'entità Postazioni.
     */
    @Mapping(target = "stanze.id_stanza", source = "id_stanza")
    @Mapping(target = "statoPostazione", source = "statoPostazione")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Postazioni toEntity(PostazioniDTO postazioniDTO);

    /**
     * Aggiorna un'entità Postazioni esistente con i dati del DTO.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePostazioneFromDto(PostazioniDTO postazioniDTO, @MappingTarget Postazioni postazioni);

    /**
     * Converte una lista di entità Postazioni in una lista di PostazioniDTO.
     */

    List<PostazioniDTO> toDtoList(List<Postazioni> postazioniList);
}
