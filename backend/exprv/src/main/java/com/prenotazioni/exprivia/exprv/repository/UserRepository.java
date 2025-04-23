package com.prenotazioni.exprivia.exprv.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.prenotazioni.exprivia.exprv.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    boolean existsByEmail(String email);

    Optional<Users> findByEmail(String email);

    Optional<Users> findByEmailIgnoreCase(String email);

    Optional<Users> findByVerificationCode(String verificationCode);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_authority (user_id, authority) VALUES (:userId, :authority)", nativeQuery = true)
    void saveUserAuthority(Long userId, String authority);
}
