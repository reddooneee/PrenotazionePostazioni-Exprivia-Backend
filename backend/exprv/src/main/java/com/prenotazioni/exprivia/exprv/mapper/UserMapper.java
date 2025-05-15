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
    @Mapping(target = "id_user", source = "id_user")
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "cognome", source = "cognome")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "authorities", source = "authorities", qualifiedByName = "authoritiesToStrings")
    UserDTO toDto(Users user);

    /**
     * Converte un'entità Users in AdminDTO.
     * Dato che AdminDTO ha un costruttore che accetta Users,
     * possiamo implementare questo metodo direttamente
     */
    default AdminDTO toAdminDto(Users user) {
        if (user == null) {
            return null;
        }
        return new AdminDTO(user);
    }

    /**
     * Converte un UserDTO in entità Users.
     */
    @Mapping(target = "id_user", source = "id_user")
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "cognome", source = "cognome")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "creatoIl", ignore = true)
    @Mapping(target = "aggiornatoIl", ignore = true)
    Users toEntity(UserDTO userDTO);

    /**
     * Aggiorna un'entità Users esistente con i dati del DTO.
     */
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "cognome", source = "cognome")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "enabled", source = "enabled")
    @Mapping(target = "creatoIl", ignore = true)
    @Mapping(target = "aggiornatoIl", ignore = true)
    void updateUserFromDto(UserDTO userDTO, @MappingTarget Users user);

    /**
     * Converte una lista di entità Users in una lista di UserDTO.
     */
    List<UserDTO> toDtoList(List<Users> users);

    /**
     * Converte una lista di entità Users in una lista di AdminDTO.
     */
    default List<AdminDTO> toAdminDtoList(List<Users> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toAdminDto)
                .collect(Collectors.toList());
    }

    /**
     * Converte un set di Authority in un set di stringhe.
     */
    @Named("authoritiesToStrings")
    default Set<String> authoritiesToStrings(Set<Authority> authorities) {
        if (authorities == null) {
            return new HashSet<>();
        }
        return authorities.stream()
                .map(Authority::getName)
                .filter(name -> name != null)
                .collect(Collectors.toSet());
    }

    /**
     * Converte un set di stringhe in un set di Authority.
     */
    @Named("stringsToAuthorities")
    default Set<Authority> stringsToAuthorities(Set<String> authoritiesAsString) {
        if (authoritiesAsString == null) {
            return new HashSet<>();
        }
        return authoritiesAsString.stream()
                .filter(name -> name != null && !name.isEmpty())
                .map(name -> {
                    Authority auth = new Authority();
                    auth.setName(name);
                    return auth;
                })
                .collect(Collectors.toSet());
    }
}