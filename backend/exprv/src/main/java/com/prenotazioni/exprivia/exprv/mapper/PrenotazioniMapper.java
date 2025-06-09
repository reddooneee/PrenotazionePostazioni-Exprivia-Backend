package com.prenotazioni.exprivia.exprv.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Named;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;
import com.prenotazioni.exprivia.exprv.entity.Users;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;
import com.prenotazioni.exprivia.exprv.entity.Stanze;

/**
 * Mapper per la conversione tra l'entità Prenotazioni e il DTO PrenotazioniDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PrenotazioniMapper {

    /**
     * Converte un'entità Prenotazioni in PrenotazioniDTO.
     */
    @Mapping(source = "dataInizio", target = "data_inizio")
    @Mapping(source = "dataFine", target = "data_fine")
    @Mapping(source = "users", target = "users", qualifiedByName = "usersToUserInfo")
    @Mapping(source = "postazione", target = "postazione", qualifiedByName = "postazioneToPostazioneInfo")
    @Mapping(source = "stanze", target = "stanze", qualifiedByName = "stanzeToStanzaInfo")
    PrenotazioniDTO toDto(Prenotazioni prenotazioni);

    /**
     * Converte un DTO PrenotazioniDTO in un'entità Prenotazioni.
     */
    @Mapping(source = "data_inizio", target = "dataInizio")
    @Mapping(source = "data_fine", target = "dataFine")
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

    // Custom mapping methods
    @Named("usersToUserInfo")
    default PrenotazioniDTO.UserInfo usersToUserInfo(Users users) {
        return new PrenotazioniDTO.UserInfo(users);
    }

    @Named("postazioneToPostazioneInfo")
    default PrenotazioniDTO.PostazioneInfo postazioneToPostazioneInfo(Postazioni postazione) {
        return new PrenotazioniDTO.PostazioneInfo(postazione);
    }

    @Named("stanzeToStanzaInfo")
    default PrenotazioniDTO.StanzaInfo stanzeToStanzaInfo(Stanze stanze) {
        return new PrenotazioniDTO.StanzaInfo(stanze);
    }
}
