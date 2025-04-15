package com.prenotazioni.exprivia.exprv.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import com.prenotazioni.exprivia.exprv.dto.AdminDTO;
import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;

/**
 * Mapper per la conversione tra l'entità Users e i DTO UserDTO e AdminDTO.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    /**
     * Converte un'entità Users in UserDTO.
     */
    UserDTO toDto(Users user);

    /**
     * Converte un'entità Users in AdminDTO.
     */
    @Mapping(target = "authorities", source = "authorities", qualifiedByName = "authoritiesToStrings")
    AdminDTO toAdminDto(Users user);

    /**
     * Converte un UserDTO in entità Users.
     */
    Users toEntity(UserDTO userDTO);

    /**
     * Aggiorna un'entità Users esistente con i dati del DTO.
     */
    void updateUserFromDto(UserDTO userDTO, @MappingTarget Users user);

    /**
     * Converte una lista di entità Users in una lista di UserDTO.
     */
    List<UserDTO> toDtoList(List<Users> users);

    /**
     * Converte una lista di entità Users in una lista di AdminDTO.
     */
    List<AdminDTO> toAdminDtoList(List<Users> users);

    /**
     * Converte un set di Authority in un set di stringhe.
     */
    @Named("authoritiesToStrings")
    default Set<String> authoritiesToStrings(Set<Authority> authorities) {
        if (authorities == null || authorities.isEmpty()) {
            return new HashSet<>();
        }
        return authorities.stream()
                .map(Authority::getName)
                .collect(Collectors.toSet());
    }

    /**
     * Converte un set di stringhe in un set di Authority.
     */
    @Named("stringsToAuthorities")
    default Set<Authority> stringsToAuthorities(Set<String> authoritiesAsString) {
        if (authoritiesAsString == null || authoritiesAsString.isEmpty()) {
            return new HashSet<>();
        }
        return authoritiesAsString.stream()
                .map(Authority::new)
                .collect(Collectors.toSet());
    }
}