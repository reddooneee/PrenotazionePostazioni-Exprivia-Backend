package com.prenotazioni.exprivia.exprv.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.prenotazioni.exprivia.exprv.dto.StanzeDTO;
import com.prenotazioni.exprivia.exprv.entity.Stanze;

@Mapper(componentModel = "spring")
public interface StanzeMapper {

    StanzeMapper INSTANCE = Mappers.getMapper(StanzeMapper.class);

    //Decorazioni @Mapping in questo caso inutili perché i campi dell'entity sono uguali a nomi colonne db
    /*@Mapping(source = "idStanza", target = "idStanza")
    @Mapping(source = "capacitaStanza", target = "capacitaStanza")
    @Mapping(source = "tipoStanza", target = "tipoStanza")*/
    StanzeDTO toStanzeDTO(Stanze stanze);
    
    /*@Mapping(source = "idStanza", target = "idStanza")
    @Mapping(source = "capacitaStanza", target = "capacitaStanza")
    @Mapping(source = "tipoStanza", target = "tipoStanza")*/
    Stanze toStanze(StanzeDTO stanzeDTO);
}
