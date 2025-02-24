package com.prenotazioni.exprivia.exprv.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    

}
