package com.prenotazioni.exprivia.exprv.mapper;

import org.mapstruct.Mapper;

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDto(Users user);
}