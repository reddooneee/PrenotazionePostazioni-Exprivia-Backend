package com.prenotazioni.exprivia.exprv.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.prenotazioni.exprivia.exprv.dto.UserDTO;
import com.prenotazioni.exprivia.exprv.entity.Users;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toUserDTO(Users user);

    Users toUser(UserDTO userDTO);

}