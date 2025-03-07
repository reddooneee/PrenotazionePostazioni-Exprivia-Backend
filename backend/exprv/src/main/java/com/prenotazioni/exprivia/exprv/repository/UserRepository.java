package com.prenotazioni.exprivia.exprv.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    boolean existsByEmail(String email);

    Optional<Users> findByLogin(String login);
}