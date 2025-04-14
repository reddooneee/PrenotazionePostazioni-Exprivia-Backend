package com.prenotazioni.exprivia.exprv.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.prenotazioni.exprivia.exprv.dto.StanzeDTO;
import com.prenotazioni.exprivia.exprv.entity.Stanze;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StanzeMapper {

    StanzeDTO toDto(Stanze stanze);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Stanze toEntity(StanzeDTO stanzeDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateStanzaFromDto(StanzeDTO stanzeDTO, @MappingTarget Stanze stanze);

    List<StanzeDTO> toDtoList(List<Stanze> stanzeList);
}
