package com.prenotazioni.exprivia.exprv.mapper;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Authority;
import com.prenotazioni.exprivia.exprv.entity.Users;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "authorities", source = "authorities")
    UserDTO toDto(Users user);

    @Mapping(target = "authorities", source = "authorities")
    Users toEntity(UserDTO userDTO);

    private Set<String> authoritiesFromString(Set<String> authoritiesAsString) {
        Set<Authority> authorities = new HashSet<>();
        if (authoritiesAsString != null) {
            authorities = authoritiesAsString
                    .stream()
                    .map(string -> {
                        Authority aut = new Authority();
                        aut.setName(string);
                        return aut;
                    }
                    )
                    .collect(Collectors.toSet());
        }
        return authorities;
    }

}
