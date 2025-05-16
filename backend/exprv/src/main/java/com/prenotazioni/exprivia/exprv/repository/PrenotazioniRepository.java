package com.prenotazioni.exprivia.exprv.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prenotazioni.exprivia.exprv.entity.Prenotazioni;

@Repository
public interface PrenotazioniRepository extends JpaRepository<Prenotazioni, Integer> {
    @Query("SELECT p FROM Prenotazioni p WHERE p.users.email = :email")
    List<Prenotazioni> findByUserEmail(@Param("email") String email);

    List<Prenotazioni> findByDataInizioBetween(LocalDateTime inizioGiornata, LocalDateTime fineGiornata);

}
