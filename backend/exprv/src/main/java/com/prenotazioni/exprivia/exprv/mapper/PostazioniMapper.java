package com.prenotazioni.exprivia.exprv.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.prenotazioni.exprivia.exprv.dto.PostazioniDTO;
import com.prenotazioni.exprivia.exprv.entity.Postazioni;

@Mapper(componentModel = "spring")
public interface PostazioniMapper {

    PostazioniMapper INSTANCE = Mappers.getMapper(PostazioniMapper.class);

    PostazioniDTO toPostazioniDTO(Postazioni postazioni);

    Postazioni toPostazioni(PostazioniDTO postazioniDTO);
}