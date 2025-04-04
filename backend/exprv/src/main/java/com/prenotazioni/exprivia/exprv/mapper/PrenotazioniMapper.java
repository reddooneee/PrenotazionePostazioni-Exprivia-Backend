package com.prenotazioni.exprivia.exprv.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.prenotazioni.exprivia.exprv.dto.PrenotazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Mapper(componentModel = "spring")
public interface PrenotazioniMapper {

    PrenotazioniMapper INSTANCE = Mappers.getMapper(PrenotazioniMapper.class);

    PrenotazioniDTO toPrenotazioniDTO(Prenotazioni prenotazioni);

    Prenotazioni toPrenotazioni(PrenotazioniDTO prenotazioniDTO);
}